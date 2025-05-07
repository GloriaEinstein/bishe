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
        <p>{{ newsItem.content }}</p>
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
      const { data } = await api.news.getList();
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
  background-color: #f4f6f8;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.campus-news h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.el-empty {
  margin-top: 100px;
  color: #999;
}

.news-list {
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.news-item {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 20px;
}

.news-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.news-item h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.news-item p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.news-item span {
  font-size: 14px;
  color: #999;
  display: block;
  text-align: right;
}
</style>
