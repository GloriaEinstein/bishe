<template>
  <div class="activity-hall">
    <h2>活动大厅</h2>
    <el-divider/>
    
    <el-empty description="暂无活动" v-if="activities.length === 0"/>
    
    <div class="activity-list" v-else>
      <el-card 
        v-for="activity in activities" 
        :key="activity.id"
        class="activity-item"
      >
        <!-- 活动内容 -->
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityHall',
  data() {
    return {
      activities: []
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
  margin-bottom: 20px;
}

.el-empty {
  margin-top: 50px;
}
</style>