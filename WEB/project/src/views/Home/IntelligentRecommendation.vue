<template>
  <div class="recommendation-container">
    <!-- 顶部装饰 -->
    <div class="decorative-header">
      <div class="wave-pattern"></div>
      <h1 class="title-with-decoration">
        <span class="title-icon">🌟</span>
        智能推荐页
        <span class="title-icon">🌟</span>
      </h1>
    </div>

    <!-- 推荐活动 -->
    <div class="recommendation-section activity-section">
      <div class="section-header">
        <div class="section-icon">🎪</div>
        <h2>为您推荐的活动</h2>
      </div>
      <div class="content-grid">
        <div v-if="recommendedActivities.length === 0" class="no-data">
          <div class="empty-state">
            <div class="empty-icon">🤔</div>
            <p>暂无匹配活动</p>
            <p class="empty-hint">尝试完善个人兴趣标签获取更多推荐</p>
          </div>
        </div>
        <div v-else>
          <div 
            v-for="activity in recommendedActivities" 
            :key="activity.id" 
            class="recommendation-card activity-card"
            @click="goToActivityDetail(activity.id)"
          >
            <div class="card-header">
              <h3>{{ activity.title }}</h3>
              <div class="match-badge" :class="{ 'high-match': activity.similarity >= 0.7, 'medium-match': activity.similarity >= 0.4 && activity.similarity < 0.7 }">
                <!-- <span class="badge-text">匹配度</span> -->
                <!-- <span class="badge-score">{{ (activity.similarity * 100).toFixed(0) }}%</span> -->
              </div>
            </div>
            <div class="card-content">
              <div class="card-tags">
                <span 
                  v-for="keyword in activity.matchedKeywords" 
                  :key="keyword" 
                  class="tag-item"
                >
                  {{ keyword }}
                </span>
              </div>
              <p class="card-summary">{{ activity.introduction }}</p>
            </div>
            <div class="card-footer">
              <div class="read-more">
                查看详情 <span class="arrow-icon">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐新闻 -->
    <div class="recommendation-section news-section">
      <div class="section-header">
        <div class="section-icon">📰</div>
        <h2>为您推荐的新闻</h2>
      </div>
      <div class="content-grid">
        <div v-if="recommendedNews.length === 0" class="no-data">
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p>暂无匹配新闻</p>
            <p class="empty-hint">尝试浏览更多内容丰富兴趣画像</p>
          </div>
        </div>
        <div v-else>
          <div 
            v-for="news in recommendedNews" 
            :key="news._id" 
            class="recommendation-card news-card"
            @click="goToNewsDetail(news._id)"
          >
            <div class="card-header">
              <h3>{{ news.title }}</h3>
              <div class="match-badge" :class="{ 'high-match': news.similarity >= 0.7, 'medium-match': news.similarity >= 0.4 && news.similarity < 0.7 }">
                <!-- <span class="badge-text">匹配度</span>
                <span class="badge-score">{{ (news.similarity * 100).toFixed(0) }}%</span> -->
              </div>
            </div>
            <div class="card-content">
              <div class="card-tags">
                <span 
                  v-for="keyword in news.matchedKeywords" 
                  :key="keyword" 
                  class="tag-item"
                >
                  {{ keyword }}
                </span>
              </div>
              <p class="card-summary">{{ news.summary }}</p>
            </div>
            <div class="card-footer">
              <div class="read-more">
                阅读全文 <span class="arrow-icon">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="decorative-footer">
      <div class="circular-pattern"></div>
      <p class="footer-text">基于您的兴趣智能推荐 · 更新于 {{ updateTime }}</p>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      userKeywords: '',                // 用户关键词（字符串格式）
      rawActivities: [],               // 原始活动数据（包含_id和keywords）
      rawNews: [],                     // 原始新闻数据（包含_id和keywords）
      recommendedActivities: [],       // 推荐活动详情（含匹配关键词）
      recommendedNews: []              // 推荐新闻详情（含匹配关键词）
    };
  },
  computed: {
    // 获取当前时间作为更新时间
    updateTime() {
      const now = new Date();
      return now.toLocaleString();
    }
  },
  methods: {
    // 构建全局词汇表
    buildVocabulary() {
      const userKeywords = this.userKeywords.split(' ');
      const activityKeywords = this.rawActivities.flatMap(activity => activity.keywords);
      const newsKeywords = this.rawNews.flatMap(news => news.keywords);
      const allKeywords = [...userKeywords, ...activityKeywords, ...newsKeywords];
      return [...new Set(allKeywords)];
    },

    // 将关键词列表转换为向量
    getVector(keywords, vocab) {
      const vector = new Array(vocab.length).fill(0);
      keywords.forEach(word => {
        const index = vocab.indexOf(word);
        if (index !== -1) vector[index] = 1;
      });
      return vector;
    },

    // 计算余弦相似度
    cosineSimilarity(vecA, vecB) {
      let dotProduct = 0, magnitudeA = 0, magnitudeB = 0;
      for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] ** 2;
        magnitudeB += vecB[i] ** 2;
      }
      return magnitudeA && magnitudeB 
        ? dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
        : 0;
    },

    // 生成推荐列表（包含匹配关键词和相似度）
    generateRecommendations() {
      const vocab = this.buildVocabulary();
      const userKeywords = this.userKeywords.split(' ');
      const userVector = this.getVector(userKeywords, vocab);

      // 计算活动推荐
      const activityScores = this.rawActivities.map(activity => {
        const matchedKeywords = userKeywords.filter(keyword => 
          activity.keywords.includes(keyword)
        );
        const activityVector = this.getVector(activity.keywords, vocab);
        const similarity = this.cosineSimilarity(userVector, activityVector);
        return { 
          _id: activity.activityId, 
          similarity,
          matchedKeywords: [...new Set(matchedKeywords)]
        };
      }).sort((a, b) => b.similarity - a.similarity)
        .filter(item => item.matchedKeywords.length > 0)
        .slice(0, 3);

      // 计算新闻推荐
      const newsScores = this.rawNews.map(news => {
        const matchedKeywords = userKeywords.filter(keyword => 
          news.keywords.includes(keyword)
        );
        const newsVector = this.getVector(news.keywords, vocab);
        const similarity = this.cosineSimilarity(userVector, newsVector);
        return { 
          _id: news.newsId, 
          similarity,
          matchedKeywords: [...new Set(matchedKeywords)]
        };
      }).sort((a, b) => b.similarity - a.similarity)
        .filter(item => item.matchedKeywords.length > 0)
        .slice(0, 3);

      return { activityScores, newsScores };
    },

    // 获取推荐项的详细信息
    async fetchRecommendationDetails(recommendations) {
      try {
        // 获取活动详情
        const activityDetails = await Promise.all(
          recommendations.activityScores.map(async (item) => {
            const { data } = await api.activity.getDetail(item._id);
            return {
              ...data.activity,
              similarity: item.similarity,
              matchedKeywords: item.matchedKeywords
            };
          })
        );

        // 获取新闻详情（假设存在api.news.getDetail接口）
        const newsDetails = await Promise.all(
          recommendations.newsScores.map(async (item) => {
            const { data } = await api.news.getDetail(item._id);
            return {
              ...data.news,
              similarity: item.similarity,
              matchedKeywords: item.matchedKeywords
            };
          })
        );

        this.recommendedActivities = activityDetails;
        this.recommendedNews = newsDetails;
      } catch (error) {
        console.error('获取推荐详情失败:', error);
      }
    },

    // 跳转到活动详情页
    goToActivityDetail(activityId) {
      console.log('跳转到活动详情页:', activityId);
      console.log(this.recommendedActivities);
      
      this.$router.push(`/activity-detail/${activityId}`);
    },

    // 跳转到新闻详情页（假设存在新闻详情页路由）
    goToNewsDetail(newsId) {
      this.$router.push(`/campus-news`);
    }
  },
  async mounted() {
    try {
      // 获取用户关键词
      const userId = this.$store.state.user.userInfo.user._id;
      const { data: userData } = await api.user.getUserDataForWordCloud(userId);
      this.userKeywords = userData.text;

      // 获取活动关键词数据
      const { data: activityData } = await api.activity.getActivityKeywords();
      this.rawActivities = activityData.activityKeywords;

      // 获取新闻关键词数据
      const { data: newsData } = await api.news.getNewsKeywords();
      this.rawNews = newsData.newsKeywords;

      // 生成推荐结果并获取详情
      const recommendations = this.generateRecommendations();
      console.log('recommendations:', recommendations);
      
      await this.fetchRecommendationDetails(recommendations);

    } catch (error) {
      console.error('数据加载失败:', error);
    }
  }
};
</script>

<style scoped>
/* 基础变量 */
:root {
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  --gradient-secondary: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  --color-text: #1e293b;
  --color-text-light: #64748b;
  --color-bg: #f8fafc;
  --color-card: #ffffff;
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 基础布局 */
.recommendation-container {
  padding: 2.5rem 1.5rem;
  background: var(--color-bg);
  min-height: 100vh;
  font-family: 'Inter', system-ui, sans-serif;
}

/* 动态标题装饰 */
.decorative-header {
  position: relative;
  margin: -2.5rem -1.5rem 3rem;
  padding: 4rem 1.5rem 6rem;
  background: var(--gradient-primary);
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
}

.wave-pattern {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 1.5rem;
  border-radius: 4px;
}

.title-with-decoration {
  text-align: center;
  color: white;
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

.title-icon {
  display: inline-block;
  margin: 0 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  animation: float 3s ease-in-out infinite;
}

/* 推荐板块 */
.recommendation-section {
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-card);
  border-radius: 1.5rem;
  box-shadow: var(--shadow-lg);
  transition: var(--transition);
  max-width: 1200px;
  position: relative;
  overflow: hidden;
}

.recommendation-section:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl);
}

/* 板块特色边框 */
.activity-section {
  border-left: 4px solid #6366f1;
}

.news-section {
  border-left: 4px solid #f59e0b;
}

/* 板块头部 */
.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(4px);
}

/* 卡片系统 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.recommendation-card {
  background: var(--color-card);
  border-radius: 1rem;
  overflow: hidden;
  transition: var(--transition);
  border: 1px solid rgba(226, 232, 240, 0.5);
  cursor: pointer;
  position: relative;
}

.recommendation-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* 卡片头部 */
.card-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(99, 102, 241, 0.01) 100%);
  border-bottom: 1px solid rgba(241, 245, 249, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

h3 {
  color: var(--color-text);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.375;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 匹配度徽章 */
.match-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.high-match {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.medium-match {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

/* 卡片内容 */
.card-content {
  padding: 1.5rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag-item {
  background: rgba(99, 102, 241, 0.05);
  color: #6366f1;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.75rem;
  transition: var(--transition);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.tag-item:hover {
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.card-summary {
  color: var(--color-text-light);
  font-size: 0.875rem;
  line-height: 1.625;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

/* 卡片底部 */
.card-footer {
  padding: 1rem 1.5rem;
  background: rgba(241, 245, 249, 0.3);
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
}

.read-more {
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: var(--transition);
}

.read-more:hover {
  color: #4f46e5;
  transform: translateX(3px);
}

/* 空状态 */
.no-data {
  grid-column: 1 / -1;
  padding: 3rem 0;
  text-align: center;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 3rem;
  color: rgba(100, 116, 139, 0.3);
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

/* 底部装饰 */
.decorative-footer {
  margin: 4rem -1.5rem -2.5rem;
  padding: 4rem 1.5rem 2rem;
  background: var(--gradient-secondary);
  clip-path: polygon(0 10%, 100% 0, 100% 100%, 0 100%);
  position: relative;
}

.footer-text {
  color: white;
  text-align: center;
  font-size: 0.875rem;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 动画 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes rotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recommendation-container {
    padding: 1.5rem;
  }

  .decorative-header {
    padding: 3rem 1.5rem 4rem;
    margin: -1.5rem -1.5rem 2rem;
  }

  .title-with-decoration {
    font-size: 1.75rem;
  }

  .recommendation-section {
    padding: 1.5rem;
    border-radius: 1rem;
    margin: 1.5rem 0;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .card-header {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
