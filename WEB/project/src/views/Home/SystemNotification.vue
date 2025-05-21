<template>
  <div class="system-notification">
    <h2>系统通知</h2>
    <el-empty description="暂无通知" v-if="notifications.length === 0"/>
    <div class="notification-list" v-else>
      <el-card 
        v-for="(notification, index) in notifications" 
        :key="notification._id"
        class="notification-item"
        :style="{ 
          backgroundColor: notification.isRead ? '#fff' : '#f0f9ff',
          transform: `rotateZ(${index % 2 === 0 ? -1 : 1}deg) translateX(${index % 2 === 0 ? '-10px' : '10px'})`
        }"
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
  padding: 40px 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.system-notification h2 {
  font-size: 28px;
  color: #1a365d;
  margin-bottom: 32px;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 3px solid #e2e8f0;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.notification-list {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(300px, 680px);
  justify-content: center;
}

.notification-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* 未读通知样式 */
.notification-item:not([style*="background-color: #fff"]) {
  border-left: 4px solid #2563eb;
  background: #f8fafc;
}

.notification-item h3 {
  font-size: 18px;
  color: #1e293b;
  margin-bottom: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-item h3::before {
  content: '•';
  color: #2563eb;
  font-size: 24px;
  line-height: 1;
}

.notification-item p {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 16px 0;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.notification-item span {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .system-notification {
    padding: 24px 16px;
  }

  .notification-item {
    margin: 0;
    border-radius: 8px;
  }

  .notification-item:not([style*="background-color: #fff"])::after {
    right: -28px;
    padding: 4px 28px;
  }
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-item {
  animation: cardEntrance 0.4s ease-out forwards;
}
</style>