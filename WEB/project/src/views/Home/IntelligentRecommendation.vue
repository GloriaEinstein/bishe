<template>
  <div class="intelligent-recommendation">
    <h2>智能推荐</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <h3>推荐活动</h3>
      <div v-for="activity in recommendedActivities" :key="activity._id" class="activity-item">
        <img :src="activity.images[0] || 'https://picsum.photos/200/150'" alt="Activity" class="activity-image" />
        <div class="activity-info">
          <h4>{{ activity.title }}</h4>
          <p>{{ activity.introduction }}</p>
          <div class="activity-meta">
            <span><i class="fa fa-calendar"></i> {{ formatDate(activity.startTime) }}</span>
            <span><i class="fa fa-map-marker"></i> {{ activity.location }}</span>
          </div>
          <button @click="goToActivityDetail(activity._id)">查看详情</button>
        </div>
      </div>
      
      <h3>推荐新闻</h3>
      <div v-for="news in recommendedNews" :key="news._id" class="news-item">
        <img :src="news.coverImage || 'https://picsum.photos/200/150'" alt="News" class="news-image" />
        <div class="news-info">
          <h4>{{ news.title }}</h4>
          <p>{{ news.content | truncate(100) }}</p>
          <div class="news-meta">
            <span><i class="fa fa-clock-o"></i> {{ formatDate(news.publishTime) }}</span>
            <span><i class="fa fa-user"></i> {{ news.author }}</span>
          </div>
          <button @click="goToNewsDetail(news._id)">查看详情</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      loading: true,
      recommendedActivities: [],
      recommendedNews: []
    };
  },
  async mounted() {
    try {
      // 从后端获取推荐内容
      const { data } = await api.recommendations.getIntelligentRecommendations();
      
      this.recommendedActivities = data.recommendedActivities;
      this.recommendedNews = data.recommendedNews;
      
      this.loading = false;
    } catch (error) {
      console.error('获取推荐数据失败', error);
      this.loading = false;
    }
  },
  methods: {
    goToActivityDetail(activityId) {
      this.$router.push(`/activity-detail/${activityId}`);
    },
    goToNewsDetail(newsId) {
      this.$router.push(`/news-detail/${newsId}`);
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  },
  filters: {
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  }
};
</script>

<style scoped>
.intelligent-recommendation {
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 50px;
}

.activity-item, .news-item {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.activity-item:hover, .news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.activity-image, .news-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
}

.activity-info, .news-info {
  padding: 15px;
  flex: 1;
}

.activity-meta, .news-meta {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}

.activity-meta span, .news-meta span {
  margin-right: 15px;
}

button {
  background-color: #165DFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0E42B3;
}
</style>
