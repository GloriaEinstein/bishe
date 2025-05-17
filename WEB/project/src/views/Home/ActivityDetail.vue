<template>
  <div class="activity-detail-page">
    <!-- 自然装饰元素 -->
    <div class="nature-deco leaf-top"></div>
    <div class="nature-deco leaf-bottom"></div>
    
    <div class="left-right-container">
      <!-- 左侧内容区 -->
      <div class="left-box forest-card">
        <!-- 标题缎带 -->
        <div class="title-ribbon">
          <i class="el-icon-map-location ribbon-icon"></i>
          <span class="ribbon-text">活动详情</span>
        </div>

        <!-- 封面和标题 -->
        <div class="box1">
          <img :src="getImageUrl(activity.serviceType)" alt="activity image" class="activity-image">
          <div class="title-section">
            <h2>{{ this.activity.title }}</h2>
            <p class="service-type">{{ activity.serviceType }}</p>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="box2">
          <div class="info-item">
            <i class="el-icon-location-outline"></i>
            <span>项目地点：{{ activity.activityArea }}</span>
          </div>
          <div class="info-item">
            <i class="el-icon-time"></i>
            <span>发布日期：{{ formatDate(activity.createdAt) }}</span>
          </div>
          <div class="info-item">
            <i class="el-icon-date"></i>
            <span>项目日期：{{ formatDate(activity.startTime) }} - {{ formatDate(activity.endTime) }}</span>
          </div>
          <div class="info-item">
            <i class="el-icon-user-solid"></i>
            <span>服务对象：{{ activity.serviceTarget }}</span>
          </div>
        </div>

        <!-- 详情/报名切换 -->
        <div class="box3">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="项目详情" name="detail">
              <div class="content-box">
                <i class="el-icon-notebook-2 content-icon"></i>
                <p>{{ activity.content }}</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="报名信息" name="registration">
              <div class="registration-list">
                <div 
                  v-for="user in registeredUsers" 
                  :key="user._id" 
                  class="user-item"
                >
                  <i class="el-icon-user"></i>
                  <span class="user-name">{{ user.name }}</span>
                  <span class="college-tooltip">{{ user.college }}</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 右侧发起人信息 -->
      <div class="right-box woodland-card">
        <div class="organizer-frame">
          <h2 class="organizer-title">
            <i class="el-icon-office-building"></i>
            项目发起人
          </h2>
          <el-image 
            :src="activity.avatar" 
            fit="cover" 
            class="avatar wood-frame"
          ></el-image>
          <p class="organization-name">
            <i class="el-icon-school"></i>
            {{ activity.organizationName }}
          </p>
          <el-button 
              class="forest-btn" 
              @click="registerActivity(activityId)" 
              :disabled="isRegistered(activity)"
            >
              <i class="el-icon-thumb"></i>
              {{ isRegistered(activity) ? '已报名' : '立即报名' }}
            </el-button>
          <el-button 
          class="return-btn"
          @click="goBackToHall"
        >
          <i class="el-icon-back"></i>
          返回大厅
        </el-button>
        <!-- <el-button @click="nod">
          11
        </el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'ActivityDetail',
  data() {
    return {
      activity: {
        _id: '',
        title: '',
        serviceType: '',
        activityArea: '',
        createdAt: '',
        startTime: '',
        endTime: '',
        serviceTarget: '',
        content: '',
        avatar: '@/assets/default-avatar.png',
        organizationName: '',
        registeredUsers: []
      },
      registeredUsers: [],
      activeTab: 'detail',
      activityId:''
    }
  },
  methods: {
    nod() {
      console.log('this.registeredUsers', this.registeredUsers)
    },
    goBackToHall() {
      this.$router.push('/activity-hall');
    },
    goToActivityDetail(activityId) {
    // 确保activityId是字符串
    this.$router.push(`/activity-detail/${activityId}`);
    },
    getImageUrl(serviceType) {
      return require(`@/assets/${serviceType}.png`)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },
    async registerActivity(activityId) {
      try {
        const userId = this.$store.state.user.userInfo.user._id;

        await api.activity.register(activityId, { userId });
        this.$message.success('报名成功');
        this.fetchActivityDetail(activityId);
      } catch (error) {
        this.$message.error('报名失败');
      }
    },
    isRegistered(activity) {
      const userId = this.$store.state.user.userInfo.user._id;
      return activity.registeredUsers.some(user => user.id === userId);
    },
    async fetchActivityDetail(activityId) {
      try {
        const { data } = await api.activity.getDetail(activityId);

        this.activity.title = data.activity.title;
        this.activity.serviceType = data.activity.serviceType;
        this.activity.activityArea = data.activity.activityArea;
        this.activity.createdAt = data.activity.createdAt;
        this.activity.startTime = data.activity.startTime; 
        this.activity.endTime = data.activity.endTime;
        this.activity.serviceTarget = data.activity.serviceTarget;
        this.activity.content = data.activity.content;
        this.registeredUsers = data.activity.registeredUsers;
        this.activity.organizationName = data.activity.name;

      } catch (error) {
        this.$message.error('获取活动详情失败');
        throw error; 
      }
    },
    formatDate(dateString) {
      if (!dateString) return '未知';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    },
  },
  async mounted() {
    const activityId = this.$route.params.activityId;
    this.activityId = activityId;
  
  // 添加ID有效性校验
    if (!activityId || !/^[0-9a-fA-F]{24}$/.test(activityId)) {
    this.$message.error('活动ID格式错误');
    this.$router.push('/activity-hall');
    return;
  }

    await this.fetchActivityDetail(activityId);
  }
}
</script>

<style scoped>
.user-item {
  position: relative;
}

.college-tooltip {
  visibility: hidden;
  opacity: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  transition: opacity 0.2s;
  font-size: 12px;
  margin-left: 8px;
}

.user-item:hover .college-tooltip {
  visibility: visible;
  opacity: 1;
}

.user-item::after {
  content: "";
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.7);
  display: none;
}

.user-item:hover::after {
  display: block;
}

:root {
  --forest-dark: #2d5a27;
  --forest-medium: #4a785e;
  --forest-light: #8da67b;
  --wood-color: #6b4f3a;
  --parchment: #f5f5f5;
  --leaf-light: #b3c99d;
}

.activity-detail-page {
  padding: 40px 30px;
  background: 
    linear-gradient(160deg, #e9f3e1 0%, #d4e8cc 100%),
    repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 30px,
      var(--leaf-light) 30px,
      var(--leaf-light) 31px
    );
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 自然装饰元素 */
.nature-deco {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
}

.leaf-top {
  top: -50px;
  left: -30px;
  width: 250px;
  height: 400px;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%232d5a27" d="M30,10 Q40,5 50,20 Q60,5 70,10 Q80,15 75,30 Q85,40 70,50 Q85,60 75,70 Q80,85 70,90 Q60,95 50,80 Q40,95 30,90 Q20,85 25,70 Q15,60 30,50 Q15,40 25,30 Q20,15 30,10"/></svg>');
}

.leaf-bottom {
  right: -80px;
  bottom: -50px;
  width: 350px;
  height: 500px;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%234a785e" d="M70,90 Q60,85 55,75 Q50,85 40,80 Q30,75 35,65 Q25,55 40,50 Q25,45 35,35 Q30,25 40,20 Q50,15 55,25 Q60,15 70,20 Q80,25 75,35 Q85,45 70,50 Q85,55 75,65 Q80,75 70,90"/></svg>');
}

/* 主容器布局 */
.left-right-container {
  display: flex;
  gap: 30px;
  position: relative;
  z-index: 1;
}

/* 左侧卡片样式 */
.forest-card {
  flex: 7;
  background: 
    linear-gradient(to bottom right, #ffffff 0%, #f8fbf0 100%),
    repeating-linear-gradient(
      -45deg,
      transparent 0px,
      transparent 50px,
      rgba(141,166,123,0.05) 50px,
      rgba(141,166,123,0.05) 52px
    );
  border: 2px solid var(--forest-medium);
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 
    0 8px 32px rgba(45,90,39,0.1),
    inset 0 0 20px rgba(141,166,123,0.1);
  position: relative;
  overflow: hidden;
}

.forest-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 65%,
    rgba(141,166,123,0.1) 100%
  );
}

/* 标题缎带 */
.title-ribbon {
  position: absolute;
  top: -18px;
  left: 30px;
  background: var(--forest-dark);
  padding: 8px 40px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 12px rgba(45,90,39,0.2);
  display: flex;
  align-items: center;
  gap: 10px;
}

.ribbon-icon {
  color: #fff;
  font-size: 24px;
}

.ribbon-text {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
}

/* 活动封面区域 */
.box1 {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 2px dashed var(--forest-medium);
}

.activity-image {
  width: 280px;
  height: 200px;
  border-radius: 12px;
  margin-right: 30px;
  border: 3px solid white;
  box-shadow: 
    0 4px 12px rgba(45,90,39,0.15),
    inset 0 0 8px rgba(45,90,39,0.1);
}

.title-section h2 {
  font-size: 28px;
  color: var(--forest-dark);
  margin: 0;
  letter-spacing: 1px;
}

.service-type {
  font-size: 16px;
  color: var(--forest-medium);
  background: rgba(141,166,123,0.1);
  padding: 6px 15px;
  border-radius: 20px;
  display: inline-block;
  margin-top: 12px;
}

/* 基本信息区 */
.box2 {
  padding: 25px;
  background: rgba(141,166,123,0.08);
  border: 1px solid rgba(141,166,123,0.2);
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 
    0 2px 8px rgba(45,90,39,0.05),
    inset 0 1px 2px rgba(255,255,255,0.3);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 15px 0;
  font-size: 16px;
  color: var(--wood-color);
}

.info-item i {
  color: var(--forest-medium);
  font-size: 18px;
}

/* 详情/报名切换 */
.box3 {
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  border: 1px solid rgba(141,166,123,0.2);
  box-shadow: 0 2px 8px rgba(45,90,39,0.05);
}

.content-box {
  padding: 20px;
  line-height: 1.8;
  color: var(--wood-color);
  position: relative;
}

.content-icon {
  position: absolute;
  top: -12px;
  left: -8px;
  font-size: 40px;
  color: rgba(141,166,123,0.3);
  transform: rotate(-15deg);
}

.registration-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  padding: 20px;
}

.user-item {
  background: rgba(141,166,123,0.08);
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--forest-medium);
}

/* 右侧发起人卡片 */
.woodland-card {
  flex: 3;
  background: 
    linear-gradient(to bottom right, #fff 0%, #f9f6f0 100%),
    repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 50px,
      rgba(107,79,58,0.05) 50px,
      rgba(107,79,58,0.05) 52px
    );
  border: 2px solid var(--wood-color);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 
    0 8px 32px rgba(107,79,58,0.1),
    inset 0 0 15px rgba(107,79,58,0.05);
}

.organizer-frame {
  border: 1px solid rgba(107,79,58,0.2);
  padding: 25px;
  border-radius: 12px;
  background: rgba(255,255,255,0.9);
}

.wood-frame {
  border: 3px solid white;
  box-shadow: 
    0 4px 12px rgba(107,79,58,0.1),
    inset 0 0 8px rgba(107,79,58,0.1);
}

.forest-btn {
  background: linear-gradient(to bottom, #8da67b, #6b8c5e);
  border: none;
  color: white;
  border-radius: 25px;
  padding: 12px 35px;
  font-size: 16px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 20px;
}

.forest-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(141,166,123,0.3);
}

.forest-btn:disabled {
  background: linear-gradient(to bottom, #c2d1b8, #a8b89e);
  cursor: not-allowed;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .left-right-container {
    flex-direction: column;
  }

  .nature-deco {
    display: none;
  }

  .forest-card,
  .woodland-card {
    margin: 0;
    padding: 25px;
  }

  .activity-image {
    width: 100%;
    height: auto;
    margin-right: 0;
    margin-bottom: 20px;
  }

  .box1 {
    flex-direction: column;
  }
  .return-btn {
      width: 100%;
      margin-top: 15px;
      background: linear-gradient(to bottom, #9e9e9e, #757575);
      border: none;
      color: white;
      border-radius: 25px;
      padding: 12px 35px;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .return-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(158,158,158,0.3);
    }

    .return-btn i {
      margin-right: 8px;
    }
    
}
</style>