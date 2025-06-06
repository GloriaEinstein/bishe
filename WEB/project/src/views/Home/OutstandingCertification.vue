<template>
  <div class="container mx-auto p-4">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">优秀认证管理</h1>
      <el-button type="primary" @click="refreshActivities">
        <i class="el-icon-refresh"></i> 刷新
      </el-button>
    </div>

    <el-card class="mb-6">
      <el-form :model="filterForm" inline @submit.prevent="handleFilter">
        <el-form-item label="活动标题">
          <el-input v-model="filterForm.title" placeholder="请输入活动标题"></el-input>
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="filterForm.projectStatus" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="待启动" value="待启动"></el-option>
            <el-option label="运行中" value="运行中"></el-option>
            <el-option label="已结项" value="已结项"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">
            <i class="el-icon-search"></i> 搜索
          </el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <div class="mb-4 flex justify-between items-center">
        <h3 class="font-semibold text-gray-700">我的活动列表</h3>
        <span class="text-sm text-gray-500">共 {{ total }} 条记录</span>
      </div>

      <el-table :data="activities" stripe border @row-click="handleActivityClick" v-loading="loading">
        <el-table-column prop="title" label="活动标题" width="200"></el-table-column>
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
        <el-table-column prop="participantCount" label="参与人数" width="100"></el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              :disabled="scope.row.projectStatus === '待启动'"
              @click="handleCertify(scope.row, $event)">
              认证优秀
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
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
      username: ''
    };
  },
  async mounted() {
    this.username = this.$store.state.user.userInfo.user.username;
    console.log('当前用户名:', this.username);
    
    await this.fetchActivities();
  },
  methods: {
    async fetchActivities() {
      this.loading = true;
      try {
        const params = {
          username: this.username,
          title: this.filterForm.title,
          projectStatus: this.filterForm.projectStatus,
          page: this.currentPage,
          limit: this.pageSize
        };

        // 直接从 response 中获取数据，因为后端没有 success/code/message 字段
        const response = await api.activity.getPublishedActivities(params);
        
        // 确保 response.activities 存在且是数组
        this.activities = response.data.activities || []; // 修改这里，直接从 response 中获取 activities
        
        this.total = this.activities.length; // 根据获取到的活动数组长度设置总数

      } catch (error) {
        this.$message.error('获取活动列表失败');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async handleCertify(activity, event) {
      event.stopPropagation();
      this.$router.push({
        name: 'ActivityCertificationDetail',
        params: { activityId: activity.id }
      });
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

    handleActivityClick(row) {
      this.$router.push({
        name: 'ActivityDetail',
        params: { id: row.id }
      });
    }
  }
};
</script>