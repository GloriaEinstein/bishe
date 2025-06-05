<template>
  <!-- 模板部分 - 使用 ElementUI 的 Tooltip 替代自定义组件 -->
  <div class="user-profile">
    <header class="profile-header">
      <h1 class="gradient-title">用户兴趣画像</h1>
      <p class="subtitle">基于您的近期行为数据分析生成</p>
      <div class="decorative-line"></div>
    </header>

    <div class="data-panel">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loader"></div>
      </div>

      <div class="card wordcloud-card">
        <div class="card-header">
          <i class="icon icon-chart"></i>
          <h3>核心兴趣词云</h3>
          <!-- 使用 ElementUI 的 Tooltip 组件 -->
          <el-tooltip content="基于高权重关键词生成，过滤低效数据" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div id="wordcloud" class="chart-container"></div>
      </div>

      <!-- 其余模板部分保持不变 -->
      <div class="stats-panel">
        <div class="stat-item">
          <div class="stat-icon">
            <i class="icon icon-tag"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ filteredTagsCount }}</div>
            <div class="stat-label">有效兴趣标签</div>
          </div>
        </div>
        <div class="stat-item highlighted">
          <div class="stat-icon">
            <i class="icon icon-trend"></i>
          </div>
          <div class="stat-content">
            <div 
              class="stat-value" 
              :class="{ 
                positive: interestGrowthRate > 0,
                negative: interestGrowthRate < 0 
              }"
            >
              {{ interestGrowthRateFormatted }}
            </div>
            <div class="stat-label">兴趣增长率</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { removeStopwords } from 'stopword';

export default {
  data() {
    return {
      wordcloudData: [],
      isLoading: true,
      filteredTagsCount: 0,
      interestGrowthRate: 0,
    };
  },
  computed: {
    interestGrowthRateFormatted() {
      // 确保数值有效性
      const rate = parseFloat(this.interestGrowthRate);
      return isNaN(rate) ? '0.0%' : `${rate >= 0 ? '+' : ''}${rate.toFixed(1)}%`;
    }
  },
  async mounted() {
    try {
      this.isLoading = true;
      const userId = this.$store.state.user.userInfo.user._id;
      
      const { data } = await api.user.getUserDataForWordCloud(userId);
      const rawWords = data.text.split(' ');

      this.$store.commit('userAnalysis/UPDATE_KEYWORDS', { userId, keywords: rawWords });

      const processedData = this.processKeywords(rawWords);
      
      this.wordcloudData = processedData.filteredKeywords;
      this.filteredTagsCount = processedData.uniqueCount;
      
      // 确保获取的增长率是有效数值
      const growthRate = this.$store.getters['userAnalysis/getGrowthRate'](userId);
      this.interestGrowthRate = parseFloat(growthRate) || 0;
      
      this.drawWordCloud();
    } catch (error) {
      console.error('数据获取失败', error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    processKeywords(rawWords) {
      // 保持原有方法不变...
      const cleanedWords = rawWords
        .map(word => word.trim())
        .filter(word => 
          word.length >= 2 &&
          !/\d/.test(word)
        );

      const filteredWords = removeStopwords(cleanedWords);

      const wordFrequency = filteredWords.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});

      const filteredEntries = Object.entries(wordFrequency)
        .filter(([, count]) => count >= 2);

      return {
        filteredKeywords: filteredEntries
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value })),
        uniqueCount: new Set(filteredEntries.map(([name]) => name)).size
      };
    },

    drawWordCloud() {
      const chart = echarts.init(document.getElementById('wordcloud'));
      
      // 修复扩展运算符兼容性问题
      const values = this.wordcloudData.map(d => d.value);
      const maxSize = values.length > 0 ? Math.max.apply(null, values) : 10;
      
      const option = {
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          sizeRange: [20, Math.min(80, maxSize * 15)],
          rotationRange: [-45, 45],
          gridSize: 8,
          drawOutOfBound: false,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: () => `hsl(${Math.random() * 360}, 70%, 50%)`
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: this.wordcloudData
        }]
      };
      
      chart.setOption(option);
      window.addEventListener('resize', () => chart.resize());
    }
  }
};
</script>

<style scoped>
/* 样式部分保持不变 */
.positive { color: #27ae60; }
.negative { color: #e74c3c; }

/* 优化统计面板 */
.stat-value {
  font-size: 1.8rem;
  transition: color 0.3s;
}

.highlighted .stat-value {
  font-size: 2rem;
}

/* 优化词云容器 */
.chart-container {
  height: 520px;
  background: #f8fafb;
  border-radius: 12px;
  margin: 1rem;
}

.user-profile {
  padding: 2rem;
  background: linear-gradient(135deg, #fafcff 0%, #f0f4fa 100%);
  min-height: 100vh;
}

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.gradient-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.decorative-line {
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, #3498db 0%, rgba(52,152,219,0.2) 100%);
  margin: 0 auto;
}

.data-panel {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  z-index: 10;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #3498db;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.wordcloud-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}

.wordcloud-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f2f5;
}

.card-header h3 {
  font-size: 1.25rem;
  color: #2c3e50;
  margin: 0 0.75rem;
}

.icon {
  width: 24px;
  height: 24px;
  fill: #3498db;
}

.chart-container {
  height: 500px;
  padding: 1rem;
}

.stats-panel {
  display: grid;
  gap: 1.5rem;
}

.stat-item {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}

.stat-item:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.highlighted {
  border-left: 4px solid #3498db;
  background: linear-gradient(90deg, #f8f9fa 0%, white 100%);
}

@media (max-width: 1024px) {
  .data-panel {
    grid-template-columns: 1fr;
  }
  
  .stats-panel {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .gradient-title {
    font-size: 2rem;
  }
  
  .data-panel {
    gap: 1.5rem;
  }
  
  .stats-panel {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 400px;
  }
}
</style>
