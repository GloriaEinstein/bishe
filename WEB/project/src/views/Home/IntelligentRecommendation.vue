<template>
  <div class="recommendation-container">
    <h1>智能推荐页</h1>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      userKeywords: [],
      activityKeywords: [],
      newsKeywords: []
    };
  },
  async mounted() {
  try {
    const userId = this.$store.state.user.userInfo.user._id;
    const { data: userData } = await api.user.getUserDataForWordCloud(userId);
    this.userKeywords = userData.text;

    // 获取活动关键词
    const { data: activityKeywordsData } = await api.activity.getActivityKeywords();
    this.activityKeywords = activityKeywordsData.activityKeywords;
    console.log('活动关键词:', this.activityKeywords);

    // 获取新闻关键词
    const { data: newsKeywordsData } = await api.news.getNewsKeywords();
    this.newsKeywords = newsKeywordsData.newsKeywords;
    console.log('新闻关键词:', this.newsKeywords);
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}
}

</script>

<style scoped>
.recommendation-container {
  padding: 20px;
}
</style>
