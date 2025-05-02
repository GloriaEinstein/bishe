<template>
  <div class="system-notification">
    <h2>系统通知</h2>
    <el-empty description="暂无通知" v-if="notifications.length === 0"/>
    <div class="notification-list" v-else>
      <el-card 
        v-for="notification in notifications" 
        :key="notification._id"
        class="notification-item"
        :style="{ backgroundColor: notification.isRead ? '#fff' : '#f0f9ff' }"
        @click="markAsRead(notification._id)"
      >
        <h3>{{ notification.title }}</h3>
        <p>{{ notification.content }}</p>
        <span>{{ formatDate(notification.createdAt) }}</span>
      </el-card>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'SystemNotification',
  data() {
    return {
      notifications: []
    }
  },
  async mounted() {
    try {
      const { data } = await api.notification.getList();
      this.notifications = data.notifications;
    } catch (error) {
      this.$message.error('获取通知列表失败');
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    async markAsRead(notificationId) {
      try {
        await api.notification.markAsRead(notificationId);
        const index = this.notifications.findIndex(notification => notification._id === notificationId);
        if (index !== -1) {
          this.$set(this.notifications[index], 'isRead', true);
        }
      } catch (error) {
        this.$message.error('标记通知为已读失败');
      }
    }
  }
}
</script>

<style scoped>
.system-notification {
  padding: 40px;
  background-color: #f4f6f8;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.system-notification h2 {
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

.notification-list {
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.notification-item {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 20px;
  cursor: pointer;
}

.notification-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.notification-item h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.notification-item p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.notification-item span {
  font-size: 14px;
  color: #999;
  display: block;
  text-align: right;
}
</style>
