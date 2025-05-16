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
  padding: 60px 40px;
  background: linear-gradient(45deg, #f8f9fa 0%, #f1f3f5 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.system-notification::before {
  content: '';
  position: absolute;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(94,114,228,0.08) 0%, transparent 70%);
  z-index: 0;
}

.system-notification h2 {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 40px;
  position: relative;
  display: inline-block;
  font-family: 'Playfair Display', serif;
  letter-spacing: 2px;
  transform: rotateZ(-2deg);
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  padding: 12px 30px;
  border-radius: 12px;
  box-shadow: 5px 5px 15px rgba(0,0,0,0.1);
}

.notification-list {
  display: grid;
  gap: 35px;
  grid-template-columns: minmax(420px, 800px);
  justify-content: center;
  position: relative;
  z-index: 1;
}

.notification-item {
  position: relative;
  border: none;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 12px 12px 24px rgba(0,0,0,0.08), 
             -6px -6px 12px rgba(255,255,255,0.9);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 30px;
  cursor: pointer;
  clip-path: polygon(0 0, 100% 0, 98% 98%, 2% 100%);
  margin: 0 20px;
}

.notification-item:hover {
  transform: rotateZ(0deg) translateY(-8px) scale(1.02);
  box-shadow: 15px 15px 30px rgba(0,0,0,0.12), 
             -8px -8px 16px rgba(255,255,255,0.95);
  clip-path: polygon(0 0, 100% 0, 96% 96%, 4% 100%);
}

.notification-item:not([style*="background-color: #fff"]) {
  border-left: 5px solid #5e72e4;
  background: linear-gradient(145deg, #f0f9ff 0%, #e3f2fd 100%);
}

.notification-item:not([style*="background-color: #fff"])::after {
  content: 'NEW';
  position: absolute;
  top: -12px;
  right: -12px;
  background: #5e72e4;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(94,114,228,0.3);
  transform: rotateZ(8deg);
}

.notification-item h3 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-left: 40px;
  position: relative;
}

.notification-item h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235e72e4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
  background-size: contain;
  filter: drop-shadow(2px 2px 3px rgba(94,114,228,0.2));
}

.notification-item p {
  font-size: 17px;
  color: #4a5568;
  line-height: 1.8;
  margin: 25px 0;
  padding: 20px;
  background: rgba(245, 245, 245, 0.6);
  border-radius: 12px;
  position: relative;
  left: 15px;
}

.notification-item span {
  font-size: 15px;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.notification-item span::before {
  content: '🕒';
  font-size: 18px;
  opacity: 0.8;
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.1));
}

@media (max-width: 768px) {
  .system-notification {
    padding: 40px 20px;
  }
  
  .notification-list {
    grid-template-columns: 1fr;
  }

  .notification-item {
    margin: 0 10px;
    transform: rotateZ(0deg) !important;
    clip-path: none;
  }

  .notification-item:hover {
    transform: translateY(-5px) !important;
  }
  
  .notification-item:not([style*="background-color: #fff"])::after {
    right: 10px;
  }
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(20px) rotateZ(10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateZ(0deg);
  }
}

.notification-item {
  animation: cardEntrance 0.6s ease forwards;
}
</style>