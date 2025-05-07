<template>
  <div class="user-review-container">
    <h2 class="page-title">用户审核管理</h2>
    <div class="content-wrapper">
      <div v-if="unverifiedUsers.length > 0" class="custom-table">
        <table class="v-for-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>用户类型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in unverifiedUsers" 
              :key="user._id" 
              class="table-row"
            >
              <td>{{ user.username }}</td>
              <td>{{ user.userType }}</td>
              <td>
                <el-button 
                  type="success" 
                  size="small"
                  @click="verifyUser(user._id)"
                >
                  审核通过
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <i class="el-icon-document-remove empty-icon"></i>
        <p>当前没有待审核的用户</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      unverifiedUsers: []
    };
  },
  async mounted() {
    try {
      const response = await api.user.getUnverifiedUsers();
      console.log('API 返回数据:', response.data);
      
      // 兼容两种数据结构：
      // 1. 返回 { users: [...] } 
      // 2. 直接返回用户数组
      this.unverifiedUsers = response.data.users || response.data;
      
    } catch (error) {
      console.error('获取未审核用户列表失败', error);
      this.$message.error('数据加载失败');
    }
  },
  methods: {
    async verifyUser(userId) {
      try {
        await api.user.verifyUser(userId);
        this.unverifiedUsers = this.unverifiedUsers.filter(user => user._id !== userId);
        this.$message.success('用户审核通过');
      } catch (error) {
        console.error('审核用户失败', error);
        this.$message.error('审核操作失败');
      }
    }
  }
};
</script>

<style scoped>
.user-review-container {
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

/* 自定义表格样式 */
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

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 12px;
  }
  
  .page-title {
    font-size: 20px;
    margin-bottom: 16px;
  }
  
  .v-for-table th,
  .v-for-table td {
    padding: 8px;
    font-size: 14px;
  }
}
</style>