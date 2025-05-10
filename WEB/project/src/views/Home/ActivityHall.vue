<template>
  <div class="activity-hall">
    <h2>活动大厅</h2>
    <!-- 筛选表单 -->
    <el-form :model="filterForm" inline @submit.prevent="handleFilter">
      <el-form-item label="活动区域">
        <el-select v-model="filterForm.area" placeholder="请选择活动区域">
          <el-option label="校内" value="校内"></el-option>
          <el-option label="校外" value="校外"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务类别">
        <el-select v-model="filterForm.serviceType" placeholder="请选择服务类别">
          <el-option label="社区服务" value="社区服务"></el-option>
          <el-option label="支教助学" value="支教助学"></el-option>
          <el-option label="扶贫减贫" value="扶贫减贫"></el-option>
          <el-option label="卫生健康" value="卫生健康"></el-option>
          <el-option label="环境保护" value="环境保护"></el-option>
          <el-option label="文化艺术" value="文化艺术"></el-option>
          <el-option label="禁毒宣传" value="禁毒宣传"></el-option>
          <el-option label="关爱特殊群体" value="关爱特殊群体"></el-option>
          <el-option label="大型活动" value="大型活动"></el-option>
          <el-option label="其它" value="其它"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目状态">
        <el-select v-model="filterForm.projectStatus" placeholder="请选择项目状态">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="待启动" value="待启动"></el-option>
          <el-option label="运行中" value="运行中"></el-option>
          <el-option label="已结项" value="已结项"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务对象">
        <el-select v-model="filterForm.serviceTarget" placeholder="请选择服务对象">
          <el-option label="儿童" value="儿童"></el-option>
          <el-option label="妇女" value="妇女"></el-option>
          <el-option label="老年人" value="老年人"></el-option>
          <el-option label="残障人士" value="残障人士"></el-option>
          <el-option label="贫困家庭" value="贫困家庭"></el-option>
          <el-option label="其它" value="其它"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目人数">
        <el-select v-model="filterForm.participantCount" placeholder="请选择项目人数">
          <el-option label="0" value="0"></el-option>
          <el-option label="1 - 100" value="1-100"></el-option>
          <el-option label="101 - 200" value="101-200"></el-option>
          <el-option label="201 - 500" value="201-500"></el-option>
          <el-option label="501 - 1000" value="501-1000"></el-option>
          <el-option label="1000以上" value="1000以上"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">筛选</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>
    <el-empty description="暂无活动" v-if="activities.length === 0"/>
    <div class="activity-list" v-else>
      <el-card 
        v-for="activity in activities" 
        :key="activity._id"
        class="activity-item"
      >
        <h3>{{ activity.title }}</h3>
        <p>{{ activity.content }}</p>
        <span>{{ formatDate(activity.createdAt) }}</span>
      </el-card>
    </div>
  </div>
</template>


<script>
import api from '@/api'

export default {
  name: 'ActivityHall',
  data() {
    return {
      activities: [],
      filterForm: {
        area: '',
        serviceType: '',
        projectStatus: '全部',
        serviceTarget: '',
        participantCount: ''
      }
    }
  },
  async mounted() {
    this.fetchActivities();
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    async fetchActivities() {
      try {
        const { data } = await api.activity.getList(this.filterForm);
        this.activities = data.activities;
      } catch (error) {
        this.$message.error('获取活动列表失败');
      }
    },
    async handleFilter() {
      await this.fetchActivities();
    },
    resetFilter() {
      this.filterForm = {
        area: '',
        serviceType: '',
        projectStatus: '全部',
        serviceTarget: '',
        participantCount: ''
      };
      this.fetchActivities();
    }
  }
}
</script>

<style scoped>
.activity-hall {
  padding: 32px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 32px;
  font-weight: 600;
  text-align: center;
  position: relative;
  padding-bottom: 12px;
}

h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%);
}

.el-form {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
}

.el-form-item {
  margin-bottom: 16px !important;
}

.el-select {
  width: 180px;
}

.el-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.el-button--primary {
  background: #6c5ce7 !important;
  border-color: #6c5ce7 !important;
  padding: 10px 24px !important;
}

.el-button--primary:hover {
  background: #5b4bc4 !important;
  transform: translateY(-1px);
}

.activity-list {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.activity-item {
  border: none !important;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.activity-item:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.activity-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%);
}

.activity-item h3 {
  font-size: 20px;
  color: #2d3436;
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.activity-item p {
  font-size: 15px;
  color: #636e72;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-item span {
  font-size: 13px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 6px;
}

.el-empty {
  margin: 60px 0;
}

.el-empty__description {
  color: #95a5a6 !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-form {
    padding: 16px;
  }
  
  .el-select {
    width: 100%;
  }
  
  .activity-list {
    grid-template-columns: 1fr;
  }
}
</style>
