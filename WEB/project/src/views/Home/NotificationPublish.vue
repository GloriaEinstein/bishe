<!-- NotificationPublish.vue -->
<template>
  <div class="notification-publish">
    <div class="decorative-bg notification-bg"></div>
    <el-card class="glowing-card">
      <i class="el-icon-message-solid title-icon"></i>
      <h2>通知发布</h2>
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10 }"
            class="auto-resize-textarea"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlePublish">发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'NotificationPublish',
  data() {
    return {
      form: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    async handlePublish() {
      try {
        await api.notification.publish(this.form);
        this.$message.success('通知发布成功');
        this.form.title = '';
        this.form.content = '';
      } catch (error) {
        this.$message.error('通知发布失败');
      }
    }
  }
}
</script>

<style scoped>
.notification-publish {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fc 0%, #f0ffe9 100%);
  padding: 30px 20px;
}

.decorative-bg {
  position: absolute;
  width: 100%;
  height: 240px;
  z-index: 0;
}

.notification-bg {
  background: linear-gradient(160deg, #67c23a22 0%, transparent 70%);
}

.notification-bg::after {
  content: '';
  position: absolute;
  bottom: -80px;
  right: -50px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #67c23a11 0%, transparent 60%);
}

.glowing-card {
  position: relative;
  border-radius: 12px;
  border: 1px solid rgba(103, 194, 58, 0.15);
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin: 0 auto;
  transition: transform 0.3s ease;
}

.glowing-card:hover {
  transform: translateY(-5px);
}

.glowing-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(135deg, #67c23a33 0%, #ffffff00 40%);
  -webkit-mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.title-icon {
  position: absolute;
  left: 30px;
  top: 30px;
  font-size: 32px;
  color: #67c23a;
  opacity: 0.8;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #67c23a;
  border-radius: 2px;
}

.el-form {
  padding: 0 40px;
}

.el-input ::v-deep .el-input__inner,
.el-textarea ::v-deep .el-textarea__inner {
  background: #f8fff8;
  border: 1px solid #e4ffe4;
  transition: all 0.3s ease;
}

.el-button--primary {
  background: linear-gradient(135deg, #67c23a, #4da82e);
  border: none;
  position: relative;
  overflow: hidden;
}

.el-button--primary::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, 
    transparent 25%,
    rgba(255,255,255,0.1) 50%,
    transparent 75%);
  animation: shine 3s infinite;
}

@keyframes shine {
  100% {
    transform: translate(50%, 50%);
  }
}

@media (max-width: 768px) {
  .el-form {
    padding: 0 20px;
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 25px;
  }
  
  .title-icon {
    left: 20px;
    top: 20px;
    font-size: 24px;
  }
}
</style>