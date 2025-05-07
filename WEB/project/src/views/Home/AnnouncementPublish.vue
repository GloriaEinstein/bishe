<template>
  <div class="announcement-publish">
    <el-card>
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
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.el-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
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
  background-color: #409eff;
  border-radius: 2px;
}

.el-form {
  padding: 0 40px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-form-item:last-child {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
}

.el-input,
.el-textarea {
  border-radius: 8px;
}

.el-input ::v-deep .el-input__inner,
.el-textarea ::v-deep .el-textarea__inner {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-input ::v-deep .el-input__inner:focus,
.el-textarea ::v-deep .el-textarea__inner:focus {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.el-button {
  padding: 10px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 内容栏弹性调整样式 */
.auto-resize-textarea ::v-deep .el-textarea__inner {
  min-height: 120px !important;
  max-height: 400px;
  height: auto !important;
  resize: none;
  line-height: 1.6;
  padding: 12px 16px;
  white-space: pre-wrap;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .el-form {
    padding: 0 20px;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 25px;
  }

  .auto-resize-textarea ::v-deep .el-textarea__inner {
    min-height: 100px;
    max-height: 300px;
  }
}
</style>
