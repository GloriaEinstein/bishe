<template>
  <div class="report-management">
    <h2 class="page-title">举报管理</h2>
    <div class="content-wrapper">
      <div v-loading="loading">
        <div v-if="reportedComments.length > 0" class="custom-table">
          <table class="v-for-table">
            <thead>
              <tr>
                <th>评论内容</th>
                <th>用户信息</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="comment in reportedComments" 
                :key="comment._id" 
                class="table-row"
              >
                <td class="comment-content">{{ comment.content }}</td>
                <td class="user-info">
                  <div class="user-avatar">
                    <img :src="comment.user.avatar" alt="用户头像">
                  </div>
                  <span>{{ comment.user.name }}</span>
                </td>
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
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      reportedComments: [],
      loading: true
    };
  },
  async mounted() {
    try {
      const { data } = await api.comment.getReportedComments();
      
      this.reportedComments = data.reportedComments || [];
      
    } catch (error) {
      console.error('获取被举报评论列表失败', error);
      this.$message.error('获取数据失败');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async deleteComment(commentId, userId) {
      try {
        await this.$confirm('确认删除该评论？此操作不可撤销', '提示', {
          type: 'warning'
        });
        
        await api.comment.deleteComment(commentId);
        await api.notification.sendWarning(userId, '发言不当，你的评论已被删除');
        
        this.reportedComments = this.reportedComments.filter(
          comment => comment._id !== commentId
        );
        this.$message.success('评论删除成功');
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除评论失败', error);
          this.$message.error(error.response?.data?.message || '操作失败');
        }
      }
    },

    async ignoreReport(commentId) {
      try {
        await this.$confirm('确认忽略该举报？', '提示', {
          type: 'warning'
        });

        await api.comment.ignoreReport(commentId);
        this.reportedComments = this.reportedComments.filter(
          comment => comment._id !== commentId
        );
        this.$message.success('举报已忽略');
      } catch (error) {
        if (error !== 'cancel') {
          console.error('忽略举报失败', error);
          this.$message.error(error.response?.data?.message || '操作失败');
        }
      }
    }
  }
};
</script>

<style scoped>
:root {
  --primary-color: #409EFF;
  --background-light: #f8fafc;
  --text-primary: #2c3e50;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
}

.report-management {
  padding: 2rem;
  background: var(--background-light);
  min-height: calc(100vh - 64px);
}

.page-title {
  color: var(--text-primary);
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 3rem;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
}

.content-wrapper {
  background: white;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  transition: transform 0.2s ease;
}

.content-wrapper:hover {
  transform: translateY(-2px);
}

.v-for-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.v-for-table th,
.v-for-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s ease;
}

.v-for-table th {
  background-color: var(--background-light);
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.table-row:hover td {
  background-color: #f1f5f9 !important;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.user-avatar img:hover {
  transform: scale(1.05);
}

.comment-content {
  max-width: 500px;
  line-height: 1.6;
  color: var(--text-primary);
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.empty-state:hover .empty-icon {
  opacity: 1;
}

.el-button {
  transition: all 0.2s ease !important;
}

.el-button:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .report-management {
    padding: 1rem;
  }
  
  .v-for-table {
    display: block;
    overflow-x: auto;
  }
}
</style>