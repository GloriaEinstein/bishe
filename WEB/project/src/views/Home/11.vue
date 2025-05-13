<template>
  <div class="activity-detail-page">
    <el-button type="primary" icon="el-icon-arrow-left" @click="goBack" class="back-btn" plain>返回活动大厅</el-button>
    <div class="left-right-container">
      <div class="left-box">
        <!-- 活动封面区 -->
        <div class="cover-section">
          <img :src="activity.coverImage" alt="活动封面" class="cover-image">
          <div class="title-wrapper">
            <h1 class="title">{{ activity.title }}</h1>
            <el-tag type="info" effect="dark" class="service-tag">{{ activity.serviceType }}</el-tag>
          </div>
        </div>

        <!-- 活动信息区 -->
        <div class="info-card">
          <div class="info-item">
            <i class="el-icon-location-outline"></i>
            <span>项目地点：</span>
            <strong>{{ activity.activityArea }}</strong>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <i class="el-icon-date"></i>
              <span>发布日期：</span>
              {{ formatDate(activity.createdAt) }}
            </div>
            <div class="info-item">
              <i class="el-icon-time"></i>
              <span>服务对象：</span>
              {{ activity.serviceTarget }}
            </div>
          </div>
          <div class="date-range">
            <i class="el-icon-alarm-clock"></i>
            {{ formatDate(activity.startTime) }} 至 {{ formatDate(activity.endTime) }}
          </div>
        </div>

        <!-- 标签页 -->
        <div class="tab-card">
          <el-tabs v-model="activeTab" class="custom-tabs">
            <el-tab-pane label="项目详情" name="detail">
              <div class="content-box" v-html="activity.content"></div>
            </el-tab-pane>
            <el-tab-pane label="报名信息" name="registration">
              <ul class="user-list">
                <li v-for="user in registeredUsers" :key="user._id" class="user-item">
                  <el-avatar :size="32" :src="user.avatar" class="user-avatar"></el-avatar>
                  <span class="username">{{ user.username }}</span>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 右侧发起人信息 -->
      <div class="right-box">
        <div class="organizer-card">
          <h3 class="organizer-title">项目发起人</h3>
          <el-avatar :size="80" :src="activity.publisher.avatar" class="organizer-avatar"></el-avatar>
          <p class="organization">{{ activity.publisher.organizationName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // script部分保持不变
  // ...
}
</script>

<style scoped>
.activity-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.back-btn {
  margin-bottom: 32px;
  transition: all 0.3s;
}
.back-btn:hover {
  transform: translateX(-4px);
}

.left-right-container {
  display: flex;
  gap: 24px;
}

.left-box {
  flex: 7;
}

.right-box {
  flex: 3;
}

/* 封面区域 */
.cover-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}
.cover-image {
  width: 280px;
  height: 200px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  object-fit: cover;
}
.title-wrapper {
  flex: 1;
}
.title-wrapper .title {
  font-size: 28px;
  color: #303133;
  margin: 0 0 16px 0;
  line-height: 1.3;
}
.title-wrapper .service-tag {
  font-size: 14px;
  padding: 6px 12px;
}

/* 信息卡片 */
.info-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}
.info-item {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}
.info-item i {
  margin-right: 8px;
  font-size: 16px;
  color: #909399;
}
.info-item strong {
  color: #303133;
}
.date-range {
  padding: 12px;
  background: #f6f8fa;
  border-radius: 8px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 标签页 */
.tab-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.custom-tabs ::v-deep .el-tabs__header {
  margin: 0;
  padding: 0 24px;
}
.custom-tabs ::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
.content-box {
  padding: 24px;
  line-height: 1.8;
  color: #606266;
}
.user-list {
  padding: 0;
  margin: 0;
}
.user-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.user-item:last-child {
  border-bottom: none;
}
.user-avatar {
  margin-right: 12px;
}
.username {
  font-size: 14px;
  color: #303133;
}

/* 发起人卡片 */
.organizer-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.organizer-title {
  color: #303133;
  margin: 0 0 16px 0;
}
.organizer-avatar {
  margin: 0 auto 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.organization {
  font-size: 14px;
  color: #606266;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .left-right-container {
    flex-direction: column;
  }
  .cover-section {
    flex-direction: column;
  }
  .cover-image {
    width: 100%;
    height: 200px;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>