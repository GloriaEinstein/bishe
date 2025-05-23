<!-- src/views/Recommendation.vue -->
<template>
  <div class="recommendation-container">
    <div class="section">
      <h2 class="section-title">为你推荐</h2>
      <div class="card-grid">
        <!-- 活动卡片 -->
        <div 
          v-for="activity in recommendedActivities" 
          :key="activity._id" 
          class="recommendation-card activity"
        >
          <div class="card-header">
            <span class="type-label activity">活动</span>
            <div class="activity-meta">
              <span class="icon-time"></span>
              <span>{{ activity.startTime | formatDate }}</span>
              <span class="icon-location"></span>
              <span>{{ activity.location }}</span>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ activity.title }}</h3>
            <p class="card-summary">{{ activity.description }}</p>
            <div class="card-actions">
              <button @click="handleSignUp(activity._id)" class="action-btn primary">
                报名参加
              </button>
            </div>
          </div>
        </div>
        
        <!-- 新闻卡片 -->
        <div 
          v-for="news in recommendedNews" 
          :key="news._id" 
          class="recommendation-card news"
        >
          <div class="card-header">
            <span class="type-label news">新闻</span>
            <span class="category-tag" :style="{ backgroundColor: news.categoryColor }">
              {{ news.category }}
            </span>
            <span class="publish-time">{{ news.publishTime | formatDate }}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ news.title }}</h3>
            <p class="card-summary">{{ news.summary }}</p>
            <div class="card-actions">
              <button @click="handleReadMore(news._id)" class="action-btn secondary">
                阅读全文
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      recommendedActivities: [],
      recommendedNews: [],
      sortBy: 'similarity',
      isLoading: true
    };
  },
  mounted() {
    this.fetchRecommendations();
  },
  filters: {
    formatDate(time) {
      return new Date(time).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  methods: {
    async fetchRecommendations() {
      try {
        const { data } = await api.recommendation.getIntelligentRecommendations();
        this.recommendedActivities = data.recommendedActivities;
        this.recommendedNews = data.recommendedNews;
      } catch (error) {
        console.error('推荐数据加载失败:', error);
        this.$message.error('加载推荐内容失败，请重试');
      } finally {
        this.isLoading = false;
      }
    },
    handleSignUp(activityId) {
      this.$router.push(`/activity/${activityId}/signUp`);
    },
    handleReadMore(newsId) {
      this.$router.push(`/news/${newsId}`);
    }
  }
};
</script>

<style scoped>
.recommendation-container {
  padding: 20px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #1a365d;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.recommendation-card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.recommendation-card:hover {
  transform: translateY(-5px);
}

.card-header {
  padding: 12px 16px;
  background: #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.type-label {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 20px;
  color: white;
}

.activity .type-label { background: #3b82f6; }
.news .type-label { background: #10b981; }

.activity .activity-meta {
  display: flex;
  gap: 12px;
  font-size: 0.9rem;
  color: #64748b;
}

.activity .icon-time::before { content: '📅'; margin-right: 4px; }
.activity .icon-location::before { content: '📍'; margin-right: 4px; }

.news .category-tag {
  padding: 3px 8px;
  border-radius: 15px;
  color: white;
  font-size: 0.8rem;
}

.news .publish-time {
  color: #64748b;
  font-size: 0.85rem;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.125rem;
  margin-bottom: 10px;
  color: #1a365d;
}

.card-summary {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 15px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.action-btn.secondary {
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}
</style>
