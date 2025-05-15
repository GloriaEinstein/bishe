<template>
  <div class="activity-detail-page">
    <el-button type="primary" icon="el-icon-arrow-left" @click="goBack" class="back-btn" plain>返回活动大厅</el-button>
    <div class="left-right-container">
      <!-- 左盒子，宽度占比 7 -->
      <div class="left-box">
        <!-- 第一个盒子：活动封面、标题、服务类别 -->
        <div class="box1">
          <img :src="getImageUrl(activity.serviceType)" alt="activity image" class="activity-image">
          <div class="title-section">
            <h2>{{ activity.title }}</h2>
            <p>{{ activity.serviceType }}</p>
          </div>
        </div>
        <!-- 第二个盒子：项目地点、发布日期、项目日期、服务对象 -->
        <div class="box2">
          <p>项目地点：{{ activity.activityArea }}</p>
          <p>发布日期：{{ formatDate(activity.createdAt) }}</p>
          <p>项目日期：{{ formatDate(activity.startTime) }} - {{ formatDate(activity.endTime) }}</p>
          <p>服务对象：{{ activity.serviceTarget }}</p>
        </div>
        <!-- 第三个盒子：项目详情、报名信息切换 -->
        <div class="box3">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="项目详情" name="detail">
              <p>{{ activity.content }}</p>
            </el-tab-pane>
            <el-tab-pane label="报名信息" name="registration">
              <ul>
                <li v-for="user in registeredUsers" :key="user._id">{{ user.username }}</li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 右盒子，宽度占比 3 -->
      <div class="right-box">
        <h2>项目发起人</h2>
        <el-image :src="activity.publisher.avatar" fit="cover" class="avatar"></el-image>
        <p>{{ activity.publisher.organizationName }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      activity: {},
      registeredUsers: [],
      activeTab: 'detail'
    };
  },
  async mounted() {
    const activityId = this.$route.params.activityId;
    try {
      const { data } = await api.activity.getDetail(activityId);
      this.activity = data.activity;
      this.registeredUsers = data.activity.registeredUsers;
    } catch (error) {
      this.$message.error('获取活动详情失败');
    }
  },
  methods: {
    getImageUrl(serviceType) {
      return require(`@/assets/${serviceType}.png`);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
/* 样式保持不变 */
</style>
