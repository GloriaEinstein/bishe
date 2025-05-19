<!-- WEB/project/src/views/Home/UserProfile.vue -->
<template>
  <div class="user-profile">
    <!-- 头部区域 -->
    <header class="profile-header">
      <h1 class="gradient-title">用户兴趣画像</h1>
      <p class="subtitle">基于您的近期行为数据分析生成</p>
      <div class="decorative-line"></div>
    </header>

    <!-- 数据看板 -->
    <div class="data-panel">
      <!-- 词云卡片 -->
      <div class="card wordcloud-card">
        <div class="card-header">
          <i class="icon icon-chart"></i>
          <h3>关键词词云</h3>
          <tooltip-icon content="根据您的搜索和浏览记录生成"></tooltip-icon>
        </div>
        <div id="wordcloud" class="chart-container"></div>
      </div>

      <!-- 右侧统计面板 -->
      <div class="stats-panel">
        <div class="stat-item">
          <div class="stat-icon">
            <i class="icon icon-tag"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">128</div>
            <div class="stat-label">兴趣标签</div>
          </div>
        </div>
        <div class="stat-item highlighted">
          <div class="stat-icon">
            <i class="icon icon-trend"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">+23%</div>
            <div class="stat-label">科技类兴趣增长</div>
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

export default {
  data() {
    return {
      wordcloudData: []
    };
  },
  async mounted() {
    try {
      const userId = this.$store.state.user.userInfo.user._id;
      const { data } = await api.user.getUserDataForWordCloud(userId);
      const words = this.processText(data.text);
      const wordCount = {};
      words.forEach(word => {
        if (word.trim()) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
      this.wordcloudData = Object.keys(wordCount).map(word => ({
        name: word,
        value: wordCount[word]
      }));
      this.drawWordCloud();
    } catch (error) {
      console.error('获取数据失败', error);
    }
  },
  methods: {
    processText(text) {
      // 这里可以调用后端的分词服务，为了简单示例，使用前端模拟
      return text.split(' ');
    },
    drawWordCloud() {
      const chart = echarts.init(document.getElementById('wordcloud'));
      const option = {
        series: [
          {
            type: 'wordCloud',
            shape: 'circle',
            sizeRange: [12, 60],
            rotationRange: [-90, 90],
            textStyle: {
              normal: {
                color: function () {
                  return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',') + ')';
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            data: this.wordcloudData
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.user-profile {
  padding: 2rem;
  background: linear-gradient(135deg, #fafcff 0%, #f0f4fa 100%);
  min-height: 100vh;
}

/* 头部样式 */
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

/* 数据看板布局 */
.data-panel {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 词云卡片样式 */
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

/* 统计面板样式 */
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

/* 响应式设计 */
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
