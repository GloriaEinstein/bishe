<template>
  <div class="recommendation-container">
    <h1>智能推荐页</h1>

    <!-- 推荐活动 -->
    <div class="recommendation-section">
      <h2>为您推荐的活动</h2>
      <div v-if="recommendedActivities.length === 0" class="no-data">暂无匹配活动</div>
      <div v-else>
        <div v-for="activity in recommendedActivities" :key="activity._id" class="recommendation-item">
          <h3>{{ activity.title }}</h3>
          <p class="keywords">匹配关键词：<span>{{ activity.matchedKeywords.join('、') }}</span></p>
          <p class="introduction">{{ activity.introduction }}</p>
        </div>
      </div>
    </div>

    <!-- 推荐新闻 -->
    <div class="recommendation-section">
      <h2>为您推荐的新闻</h2>
      <div v-if="recommendedNews.length === 0" class="no-data">暂无匹配新闻</div>
      <div v-else>
        <div v-for="news in recommendedNews" :key="news._id" class="recommendation-item">
          <h3>{{ news.title }}</h3>
          <p class="keywords">匹配关键词：<span>{{ news.matchedKeywords.join('、') }}</span></p>
          <p class="summary">{{ news.summary }}</p>
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
      userKeywords: '',                // 用户关键词（字符串格式）
      rawActivities: [],               // 原始活动数据（包含_id和keywords）
      rawNews: [],                     // 原始新闻数据（包含_id和keywords）
      recommendedActivities: [],       // 推荐活动详情（含匹配关键词）
      recommendedNews: []              // 推荐新闻详情（含匹配关键词）
    };
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

    // 生成推荐列表（包含匹配关键词）
    generateRecommendations() {
      const vocab = this.buildVocabulary();
      const userKeywords = this.userKeywords.split(' ');

      // 计算活动推荐
      const activityScores = this.rawActivities.map(activity => {
        const matchedKeywords = userKeywords.filter(keyword => 
          activity.keywords.includes(keyword)
        );
        const activityVector = this.getVector(activity.keywords, vocab);
        const userVector = this.getVector(userKeywords, vocab);
        const score = this.cosineSimilarity(userVector, activityVector);
        return { 
          _id: activity.activityId, 
          score,
          matchedKeywords: [...new Set(matchedKeywords)]
        };
      }).sort((a, b) => b.score - a.score)
        .filter(item => item.matchedKeywords.length > 0)
        .slice(0, 3);

      // 计算新闻推荐
      const newsScores = this.rawNews.map(news => {
        const matchedKeywords = userKeywords.filter(keyword => 
          news.keywords.includes(keyword)
        );
        const newsVector = this.getVector(news.keywords, vocab);
        const userVector = this.getVector(userKeywords, vocab);
        const score = this.cosineSimilarity(userVector, newsVector);
        return { 
          _id: news.newsId, 
          score,
          matchedKeywords: [...new Set(matchedKeywords)]
        };
      }).sort((a, b) => b.score - a.score)
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
              matchedKeywords: item.matchedKeywords
            };
          })
        );

        this.recommendedActivities = activityDetails;
        this.recommendedNews = newsDetails;
      } catch (error) {
        console.error('获取推荐详情失败:', error);
      }
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
.recommendation-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.recommendation-section {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recommendation-item {
  margin: 15px 0;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

h2 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

h3 {
  color: #34495e;
  margin: 10px 0;
}

.keywords span {
  color: #e74c3c;
  font-weight: bold;
}

.introduction, .summary {
  color: #7f8c8d;
  line-height: 1.6;
}

.no-data {
  color: #95a5a6;
  text-align: center;
  padding: 20px;
}
</style>