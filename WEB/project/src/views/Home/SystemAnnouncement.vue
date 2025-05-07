<template>
  <div class="system-announcement">
    <h2>系统公告</h2>
    <el-empty description="暂无公告" v-if="announcements.length === 0"/>
    <div class="announcement-list" v-else>
      <el-card 
        v-for="announcement in announcements" 
        :key="announcement._id"
        class="announcement-item"
      >
        <h3>{{ announcement.title }}</h3>
        <p>{{ announcement.content }}</p>
        <span>{{ formatDate(announcement.createdAt) }}</span>
      </el-card>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'SystemAnnouncement',
  data() {
    return {
      announcements: []
    }
  },
  async mounted() {
    try {
      const { data } = await api.announcement.getList();
      this.announcements = data.announcements;
    } catch (error) {
      this.$message.error('获取公告列表失败');
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
.system-announcement {
  padding: 40px;
  background-color: #f4f6f8;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.system-announcement h2 {
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

.announcement-list {
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.announcement-item {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 20px;
}

.announcement-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.announcement-item h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.announcement-item p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.announcement-item span {
  font-size: 14px;
  color: #999;
  display: block;
  text-align: right;
}
</style>
