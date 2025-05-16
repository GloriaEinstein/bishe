<template>
  <div class="system-announcement">
    <div class="header-container">
      <h2>系统公告</h2>
      <div class="divider-line"></div>
    </div>
    
    <el-empty description="当前暂无公告" v-if="announcements.length === 0"/>
    
    <div class="announcement-list" v-else>
      <el-card 
        v-for="(announcement, index) in announcements" 
        :key="announcement._id"
        class="announcement-item"
        :class="{ 'gold-border': index === 0 }"
      >
        <div class="ribbon" v-if="index === 0">
          <span>最新公告</span>
        </div>
        <h3>{{ announcement.title }}</h3>
        <div class="content-box">
          <p>{{ announcement.content }}</p>
        </div>
        <div class="footer">
          <span class="date">{{ formatDate(announcement.createdAt) }}</span>
          <span class="author">系统管理员</span>
        </div>
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
  padding: 40px 60px;
  background: #f9fafb;
  min-height: 100vh;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto 40px;
}

h2 {
  font-size: 32px;
  color: #1a2b3c;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 15px;
  position: relative;
  padding-left: 20px;
}

h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: #1a2b3c;
}

.divider-line {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #d0d7de 30%, #d0d7de 70%, transparent 100%);
}

.announcement-list {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 25px;
}

.announcement-item {
  border: none;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 30px;
  position: relative;
  overflow: visible;
}

.announcement-item.gold-border {
  border: 2px solid #d4af37;
}

.announcement-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.ribbon {
  position: absolute;
  right: -10px;
  top: -10px;
  background: #d4af37;
  padding: 8px 25px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%);
}

h3 {
  font-size: 22px;
  color: #1a2b3c;
  margin-bottom: 20px;
  font-weight: 600;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8eef4;
}

.content-box {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  border-left: 3px solid #d0d7de;
}

p {
  font-size: 16px;
  color: #4a5568;
  line-height: 1.8;
  margin: 0;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #f0f2f5;
}

.date {
  font-size: 14px;
  color: #718096;
  letter-spacing: 0.5px;
}

.author {
  font-size: 14px;
  color: #d4af37;
  font-weight: 500;
}

.el-empty {
  margin: 80px auto;
  max-width: 500px;
}

.el-empty__description {
  color: #93a1b1;
  font-size: 16px;
}

@media (max-width: 768px) {
  .system-announcement {
    padding: 30px 20px;
  }
  
  h2 {
    font-size: 26px;
    padding-left: 15px;
  }
  
  .announcement-item {
    padding: 20px;
  }
  
  .content-box {
    padding: 15px;
  }
}
</style>