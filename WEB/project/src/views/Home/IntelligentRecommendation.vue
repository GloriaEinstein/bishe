<template>
  <div class="intelligent-recommendation">
    <h2>智能推荐</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <h3>推荐活动</h3>
      <div v-for="activity in recommendedActivities" :key="activity._id" class="activity-item">
        <h4>{{ activity.title }}</h4>
        <p>{{ activity.introduction }}</p>
        <button @click="goToActivityDetail(activity._id)">查看详情</button>
      </div>
      <h3>推荐新闻</h3>
      <div v-for="news in recommendedNews" :key="news._id" class="news-item">
        <h4>{{ news.title }}</h4>
        <p>{{ news.content }}</p>
        <button @click="goToNewsDetail(news._id)">查看详情</button>
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
      const { data } = await api.recommendation.getRecommendations();
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
    }
  }
};
</script>

<style scoped>
.intelligent-recommendation {
  padding: 24px;
}

.activity-item,
.news-item {
  margin-bottom: 16px;
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 4px;
}
</style>
