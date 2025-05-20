<template>
  <div class="campus-news">
    <h2>校园新闻</h2>
    <el-empty description="暂无新闻" v-if="news.length === 0"/>
    <div class="news-list" v-else>
      <el-card 
        v-for="newsItem in news" 
        :key="newsItem._id"
        class="news-item"
      >
        <h3>{{ newsItem.title }}</h3>
        <img v-if="newsItem.coverImage" :src="newsItem.coverImage" alt="封面图片" style="max-width: 100%; margin-bottom: 20px;">
        <p>分类：{{ newsItem.category }}</p>
        <p>标签：{{ newsItem.tags }}</p>
        <div v-html="newsItem.content"></div>
        <span>{{ formatDate(newsItem.createdAt) }}</span>
      </el-card>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'CampusNews',
  data() {
    return {
      news: []
    }
  },
  async mounted() {
    try {
      const { data } = await api.news.getNewsList();
      this.news = data.news;
    } catch (error) {
      this.$message.error('获取新闻列表失败');
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  }
}
</script>

<style scoped>
.campus-news {
  padding: 40px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
}

.campus-news h2 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 30px;
  border-bottom: 3px solid #1a3d6d;
  padding-bottom: 15px;
  letter-spacing: 1px;
  font-weight: 600;
}

.el-empty {
  margin-top: 100px;
  color: #6c757d;
}

.news-list {
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
}

.news-item {
  border: 1px solid #e9ecef;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 24px;
  background: white;
}

.news-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.news-item h3 {
  font-size: 20px;
  color: #1a3d6d;
  margin-bottom: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.news-item img {
  border-radius: 2px;
  margin: 15px 0;
  border: 1px solid #dee2e6;
}

.news-item p {
  font-size: 14px;
  color: #495057;
  line-height: 1.8;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f5;
}

.news-item p:last-child {
  border-bottom: none;
}

.news-item span {
  font-size: 13px;
  color: #6c757d;
  text-align: right;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f1f3f5;
}

/* 分类标签图标前缀 */
.news-item p:nth-of-type(1)::before {
  content: "📁 ";
}
.news-item p:nth-of-type(2)::before {
  content: "🏷 ";
}
</style>