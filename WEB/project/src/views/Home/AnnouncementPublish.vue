<!-- AnnouncementPublish.vue -->
<template>
  <div class="announcement-publish">
    <div class="decorative-bg announcement-bg"></div>
    <el-card class="glowing-card">
      <i class="el-icon-mic title-icon"></i>
      <h2>公告发布</h2>
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
  name: 'AnnouncementPublish',
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
        await api.announcement.publish(this.form);
        this.$message.success('公告发布成功');
        this.form.title = '';
        this.form.content = '';
      } catch (error) {
        this.$message.error('公告发布失败');
      }
    }
  }
}
</script>

<style scoped>
.announcement-publish {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fc 0%, #e9f2ff 100%);
  padding: 30px 20px;
}

.announcement-bg {
  background: linear-gradient(160deg, #409eff22 0%, transparent 70%);
}

.announcement-bg::after {
  background: radial-gradient(circle, #409eff11 0%, transparent 60%);
}

.glowing-card {
  border: 1px solid rgba(64, 158, 255, 0.15);
}

.glowing-card::before {
  background: linear-gradient(135deg, #409eff33 0%, #ffffff00 40%);
}

.title-icon {
  color: #409eff;
}

h2::after {
  background-color: #409eff;
}

.el-input ::v-deep .el-input__inner,
.el-textarea ::v-deep .el-textarea__inner {
  background: #f8faff;
  border: 1px solid #e4ecff;
}

.el-button--primary {
  background: linear-gradient(135deg, #409eff, #3375ff);
}

/* 其他样式与NotificationPublish.vue相同部分已省略，实际使用时需要保留 */
</style>