<template>
  <div class="activity-hall">
    <h2>活动大厅</h2>
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
      activities: []
    }
  },
  async mounted() {
    try {
      const { data } = await api.activity.getList();
      this.activities = data.activities;
    } catch (error) {
      this.$message.error('获取活动列表失败');
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  }
}
</script>

<style scoped>
.activity-hall {
  padding: 20px;
}

.activity-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.activity-item {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 20px;
}

.activity-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.activity-item h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.activity-item p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.activity-item span {
  font-size: 14px;
  color: #999;
  display: block;
  text-align: right;
}

.el-empty {
  margin-top: 50px;
}
</style>
