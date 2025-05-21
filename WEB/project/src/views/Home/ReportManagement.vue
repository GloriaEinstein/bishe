<template>
  <div class="report-management">
    <h2 class="page-title">举报管理</h2>
    <div class="content-wrapper">
      <div v-if="reportedComments.length > 0" class="custom-table">
        <table class="v-for-table">
          <thead>
            <tr>
              <th>评论内容</th>
              <th>评论用户</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="comment in reportedComments" 
              :key="comment._id" 
              class="table-row"
            >
              <td>{{ comment.content }}</td>
              <td>{{ comment.user.name }}</td>
              <td>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="deleteComment(comment._id, comment.user._id)"
                >
                  删除评论
                </el-button>
                <el-button 
                  type="success" 
                  size="small"
                  @click="ignoreReport(comment._id, comment.user._id)"
                >
                  忽略举报
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <i class="el-icon-document-remove empty-icon"></i>
        <p>当前没有被举报的评论</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      reportedComments: []
    };
  },
  async mounted() {
    try {
      const response = await api.comment.getReportedComments();
      this.reportedComments = response.data.data.reportedComments;
    } catch (error) {
      console.error('获取被举报评论列表失败', error);
    }
  },
  methods: {
    async deleteComment(commentId, userId) {
      try {
        await api.comment.deleteComment(commentId);
        // 发送警告消息给被举报用户
        await api.notification.sendWarning(userId, '发言不当，你的评论已被删除');
        this.reportedComments = this.reportedComments.filter(comment => comment._id !== commentId);
        this.$message.success('评论删除成功');
      } catch (error) {
        console.error('删除评论失败', error);
        this.$message.error('删除评论失败，请稍后再试');
      }
    },
    async ignoreReport(commentId, reporterId) {
      try {
        await api.comment.ignoreReport(commentId);
        // 发送警告消息给举报用户
        await api.notification.sendWarning(reporterId, '举报不当，请谨慎使用举报功能');
        this.reportedComments = this.reportedComments.filter(comment => comment._id !== commentId);
        this.$message.success('举报已忽略');
      } catch (error) {
        console.error('忽略举报失败', error);
        this.$message.error('忽略举报失败，请稍后再试');
      }
    }
  }
};
</script>

<style scoped>
.report-management {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.page-title {
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #409EFF;
  display: inline-block;
}

.content-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  padding: 20px;
}

.v-for-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.v-for-table th,
.v-for-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.v-for-table th {
  background-color: #f8f9fa;
  color: #606266;
  font-weight: 600;
}

.table-row:hover td {
  background-color: #f5f7fa !important;
}
</style>
