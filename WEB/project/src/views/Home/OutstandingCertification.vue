<template>
  <div class="activity-certification-container">
    <div class="header-section">
      <h1 class="page-title">我发布的活动：参与用户优秀认证</h1>
      <el-button type="primary" icon="el-icon-refresh" @click="refreshActivities">
        刷新列表
      </el-button>
    </div>

    <el-card class="filter-card">
      <el-form :model="filterForm" inline @submit.prevent="handleFilter" label-width="80px">
        <el-form-item label="活动标题">
          <el-input v-model="filterForm.title" placeholder="请输入活动标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="filterForm.projectStatus" placeholder="请选择状态" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待启动" value="待启动"></el-option>
            <el-option label="运行中" value="运行中"></el-option>
            <el-option label="已结项" value="已结项"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh-right" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="activity-list-card">
      <div class="card-header">
        <h3 class="card-title">我发布的活动</h3>
        <span class="record-count">共 {{ total }} 条记录</span>
      </div>

      <el-table
        :data="activities"
        stripe
        border
        v-loading="loading"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="activity-table">
        <el-table-column prop="title" label="活动标题" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" label="开始日期" width="140">
          <template #default="scope">
            {{ formatDate(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束日期" width="140">
          <template #default="scope">
            {{ formatDate(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="projectStatus" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.projectStatus)">{{ getStatusText(scope.row.projectStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registeredUsers.length" label="已报名人数" width="120"></el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              :disabled="scope.row.projectStatus === '待启动'"
              @click.stop="handleCertifyUsers(scope.row)"
              class="certify-button">
              认证优秀用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="认证优秀参与用户"
      :visible.sync="certifyDialogVisible"
      width="65%"
      :close-on-click-modal="false"
      @close="resetCertifyDialog"
      class="certify-dialog">
      <div class="dialog-content">
        <h3 class="dialog-activity-title">活动名称: <span class="activity-name-text">{{ currentActivity.title }}</span></h3>
        <p class="dialog-instruction">请勾选要认证为优秀的用户，未勾选的已认证用户将被取消认证：</p>

        <el-table
          ref="multipleTable"
          :data="registeredUsers"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="usersLoading"
          element-loading-text="加载用户中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.7)"
          class="user-table">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="username" label="学号/工号" width="150"></el-table-column>
          <el-table-column prop="college" label="学院" show-overflow-tooltip></el-table-column>
          <el-table-column label="是否已认证优秀" width="150">
            <template #default="scope">
              <el-tag :type="scope.row.isCertified ? 'success' : 'info'" effect="dark">
                {{ scope.row.isCertified ? '已认证' : '未认证' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="certifyDialogVisible = false" class="cancel-button">取 消</el-button>
        <el-button type="primary" @click="submitCertifyUsers" :loading="certifying" class="confirm-button">确 定 认证</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';

export default {
  name: 'ActivityCertification',
  data() {
    return {
      activities: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      filterForm: {
        title: '',
        projectStatus: ''
      },
      loading: false,
      currentUserUsername: '', // 存储当前登录用户的 username

      // 认证用户弹窗相关数据
      certifyDialogVisible: false,
      currentActivity: {},
      registeredUsers: [], // 该活动下所有已报名用户 (包含是否已认证标记)
      selectedUsersToCertify: [], // 弹窗中勾选的要认证的用户 (完整用户对象)
      usersLoading: false,
      certifying: false // 认证提交加载状态
    };
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  watch: {
    userInfo: {
      handler(newVal) {
        if (newVal && newVal.user && newVal.user.username) {
          this.currentUserUsername = newVal.user.username;
          this.fetchActivities(); // 当用户信息加载完成后，再获取活动列表
        } else {
          console.warn('用户信息未加载或用户未登录');
          // 可选：如果用户未登录，可以重定向到登录页或显示提示
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchActivities() {
      if (!this.currentUserUsername) {
        // 如果当前用户 username 还没有，则不发送请求
        console.warn('Current user username not available, skipping fetching activities.');
        return;
      }
      this.loading = true;
      try {
        const params = {
          username: this.currentUserUsername, // 传递当前登录用户的 username
          title: this.filterForm.title,
          projectStatus: this.filterForm.projectStatus,
          page: this.currentPage,
          limit: this.pageSize
        };

        const response = await api.activity.getPublishedActivities(params);

        if (response.code === 200 && response.data) {
          this.activities = response.data.activities || [];
          this.total = response.data.total || 0;
          // 确保活动状态在前端实时更新
          const now = new Date();
          this.activities.forEach(activity => {
            const startTime = new Date(activity.startTime);
            const endTime = new Date(activity.endTime);
            if (now < startTime) {
              activity.projectStatus = '待启动';
            } else if (now >= startTime && now <= endTime) {
              activity.projectStatus = '运行中';
            } else {
              activity.projectStatus = '已结项';
            }
          });
        } else {
          this.$message.error(response.message || '获取活动列表失败');
        }

      } catch (error) {
        this.$message.error('获取活动列表失败');
        console.error('Error fetching activities:', error);
      } finally {
        this.loading = false;
      }
    },

    async handleCertifyUsers(activity) {
      this.currentActivity = activity;
      this.certifyDialogVisible = true;
      // 调用新的 API 获取已报名用户及其认证状态
      await this.fetchRegisteredAndOutstandingUsers(activity._id);
    },

    async fetchRegisteredAndOutstandingUsers(activityId) {
      this.usersLoading = true;
      try {
        // 获取该活动所有已报名用户，并包含其在当前活动中的优秀状态
        // 这里调用的是我们新增的、专门返回带 isCertified 字段的用户列表的API
        const response = await api.user.getOutstandingUsersForActivity(activityId);

        if (response.code === 200 && response.data) {
          this.registeredUsers = response.data.registeredUsers || [];

          // 默认选中已认证的用户
          this.$nextTick(() => {
            this.$refs.multipleTable.clearSelection();
            this.registeredUsers.forEach(row => {
              if (row.isCertified) {
                this.$refs.multipleTable.toggleRowSelection(row, true);
              }
            });
          });
        } else {
          this.$message.error(response.message || '获取用户列表失败');
        }

      } catch (error) {
        this.$message.error('获取用户列表失败');
        console.error('Error fetching registered/outstanding users:', error);
      } finally {
        this.usersLoading = false;
      }
    },

    handleSelectionChange(selection) {
      // selection 是被勾选的行（用户对象）的数组
      this.selectedUsersToCertify = selection;
    },

    async submitCertifyUsers() {
      this.certifying = true;
      try {
        // 提交所有勾选的用户的ID
        const userIdsToCertify = this.selectedUsersToCertify.map(user => user._id);
        
        // 调用新的认证 API，传入 activityId 和用户ID数组
        const response = await api.user.certifyUserAsOutstanding(this.currentActivity._id, userIdsToCertify);

        if (response.code === 200) {
          this.$message.success('用户优秀状态更新成功！');
          this.certifyDialogVisible = false;
          // 认证完成后，可以刷新主列表，或仅刷新当前活动的报名人数（如果需要）
          // 这里刷新整个列表以确保数据一致性
          await this.fetchActivities();
        } else {
          this.$message.error(response.message || '用户认证失败');
        }
      } catch (error) {
        this.$message.error('认证用户失败');
        console.error('Error submitting certification:', error);
      } finally {
        this.certifying = false;
      }
    },

    resetCertifyDialog() {
      this.currentActivity = {};
      this.registeredUsers = [];
      this.selectedUsersToCertify = [];
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },

    getStatusText(projectStatus) {
      switch (projectStatus) {
        case '待启动': return '待启动';
        case '运行中': return '运行中';
        case '已结项': return '已结项';
        default: return projectStatus;
      }
    },

    getStatusType(projectStatus) {
      switch (projectStatus) {
        case '待启动': return 'info';
        case '运行中': return 'success';
        case '已结项': return 'warning';
        default: return 'default';
      }
    },

    handleFilter() {
      this.currentPage = 1;
      this.fetchActivities();
    },

    resetFilter() {
      this.filterForm = {
        title: '',
        projectStatus: ''
      };
      this.currentPage = 1;
      this.fetchActivities();
    },

    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchActivities();
    },

    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchActivities();
    },

    refreshActivities() {
      this.resetFilter();
    },
  }
};
</script>

<style scoped>
/* (CSS 样式保持不变，与之前提供的相同，这里省略以节省空间) */
.activity-certification-container {
  padding: 20px;
  background: linear-gradient(to right, #ece9e6, #ffffff);
  min-height: calc(100vh - 60px); /* Adjust based on your header height */
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

/* Filter Card */
.filter-card {
  margin-bottom: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  padding: 20px 25px;
}

.el-form-item {
  margin-right: 20px; /* Spacing between form items */
  margin-bottom: 0 !important; /* Override default ElFormItem bottom margin */
}

.el-form-item:last-child {
  margin-right: 0;
}

.el-input, .el-select {
  width: 200px;
}

.el-button {
  border-radius: 8px;
  font-weight: 500;
}

.el-button--primary {
  background-color: #409EFF;
  border-color: #409EFF;
  transition: all 0.3s ease;
}

.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
  transform: translateY(-2px);
}

/* Activity List Card */
.activity-list-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  padding: 20px 25px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #34495e;
}

.record-count {
  font-size: 14px;
  color: #7f8c8d;
}

.activity-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden; /* Ensures border-radius applies to table */
}

/* Table styles */
.el-table th.el-table__cell {
  background-color: #f5f7fa;
  color: #555;
  font-weight: bold;
  font-size: 14px;
}

.el-table td.el-table__cell {
  color: #444;
  font-size: 13px;
}

.el-tag {
  border-radius: 4px;
  padding: 0 8px;
  height: 28px;
  line-height: 26px;
  font-size: 12px;
  font-weight: 500;
}

.el-tag--success {
  background-color: #e6f7ff; /* Light blue */
  color: #1890ff; /* Blue */
  border-color: #91d5ff;
}

.el-tag--info {
  background-color: #fafafa; /* Light gray */
  color: #595959; /* Darker gray */
  border-color: #d9d9d9;
}

.el-tag--warning {
  background-color: #fffbe6; /* Light yellow */
  color: #faad14; /* Orange */
  border-color: #ffe58f;
}

.certify-button {
  background-color: #67c23a;
  border-color: #67c23a;
  color: #fff;
}
.certify-button:hover {
  background-color: #85ce61;
  border-color: #85ce61;
}

/* Pagination */
.pagination-container {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  background-color: #fcfcfc;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* Dialog Styles */
.certify-dialog .el-dialog {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background-color: #fcfcfc;
}

.certify-dialog .el-dialog__header {
  background: linear-gradient(to right, #409EFF, #66b1ff);
  padding: 20px;
  border-bottom: none;
}

.certify-dialog .el-dialog__title {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.certify-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
  font-size: 20px;
}

.certify-dialog .el-dialog__body {
  padding: 30px;
  color: #333;
}

.dialog-activity-title {
  font-size: 22px;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.activity-name-text {
  color: #409EFF;
}

.dialog-instruction {
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.user-table {
  border-radius: 8px;
  overflow: hidden;
}

.user-table .el-table__header-wrapper th {
  background-color: #eef1f6;
  color: #4a4a4a;
}

.certify-dialog .el-dialog__footer {
  padding: 20px 30px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
}

.cancel-button {
  background-color: #f0f2f5;
  color: #555;
  border: none;
  transition: all 0.3s ease;
}
.cancel-button:hover {
  background-color: #e0e2e6;
  color: #333;
}

.confirm-button {
  background-color: #67c23a;
  border-color: #67c23a;
  transition: all 0.3s ease;
}
.confirm-button:hover {
  background-color: #85ce61;
  border-color: #85ce61;
  transform: translateY(-2px);
}

/* Loading overlay customization */
.el-loading-mask {
  border-radius: 12px; /* Match card border-radius */
}
</style>