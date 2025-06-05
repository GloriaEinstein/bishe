<template>
  <div class="activity-review-container">
    <h2 class="page-title">活动审核管理</h2>
    <div class="content-wrapper">
      <div v-if="pendingActivities.length > 0" class="custom-table">
        <table class="v-for-table">
          <thead>
            <tr>
              <th>活动标题</th>
              <th>发布人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="activity in pendingActivities" 
              :key="activity.id"  class="table-row"
            >
              <td>{{ activity.title }}</td>
              <td>{{ activity.username }}</td>
              <td>
                <el-button 
                  type="success" 
                  size="small"
                  @click="approveActivity(activity.id)" >
                  通过
                </el-button>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="rejectActivity(activity.id)" >
                  拒绝
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <i class="el-icon-document-remove empty-icon"></i>
        <p>当前没有待审核的活动</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      pendingActivities: []
    };
  },
  async mounted() {
    try {
      const { data } = await api.activity.getPendingActivities();
      this.pendingActivities = data.activities;
    } catch (error) {
      console.error('获取待审核活动列表失败', error);
      this.$message.error('数据加载失败');
    }
  },
  methods: {
    async approveActivity(activityId) {
      try {
        await api.activity.approveActivity(activityId);
        this.pendingActivities = this.pendingActivities.filter(activity => activity.id !== activityId); // 修改这里：_id 改为 id
        this.$message.success('活动审核通过');
      } catch (error) {
        console.error('审核活动失败', error);
        this.$message.error('审核操作失败');
      }
    },
    async rejectActivity(activityId) {
      try {
        await api.activity.rejectActivity(activityId);
        this.pendingActivities = this.pendingActivities.filter(activity => activity.id !== activityId); // 修改这里：_id 改为 id
        this.$message.success('活动审核拒绝');
      } catch (error) {
        console.error('审核活动失败', error);
        this.$message.error('审核操作失败');
      }
    }
  }
};
</script>

<style scoped>
.activity-review-container {
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
