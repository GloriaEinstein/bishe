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
            <el-tab-pane label="评论区" name="comments">
              <!-- 发布评论区域 -->
              <div class="post-comment-area">
                <div class="comment-avatar">
                  <el-image 
                    :src="defaultAvatar" 
                    fit="cover" 
                    class="avatar"
                  ></el-image>
                </div>
                <div class="comment-input-wrapper">
                  <el-input
                    v-model="commentForm.content"
                    type="textarea"
                    :rows="3"
                    placeholder="分享你的想法..."
                    @keyup.enter.native="submitComment"
                  ></el-input>
                  <div class="comment-action">
                    <el-button 
                      type="primary" 
                      @click="submitComment"
                      :disabled="!commentForm.content.trim()"
                    >
                      发布评论
                    </el-button>
                  </div>
                </div>
              </div>
              
              <!-- 评论列表 -->
              <div class="comments-list">
                <div v-for="comment in comments" :key="comment._id" class="comment-item">
                  <div class="comment-avatar">
                    <el-image 
                      :src="defaultAvatar" 
                      fit="cover" 
                      class="avatar"
                    ></el-image>
                  </div>
                  <div class="comment-content-wrapper">
                    <div class="comment-header">
                      <span class="user-name">{{ comment.user.name }}</span>
                      <span class="college-info">{{ comment.user.college }}</span>
                    </div>
                    <p class="comment-content">{{ comment.content }}</p>
                    <div class="comment-footer">
                      <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
                      <span class="report-btn" @click="reportComment(comment._id)">举报</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="学院分布" name="collegeDistribution">
              <!-- 优化图表容器样式 -->
              <div id="college-distribution-chart" class="chart-container"></div>
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
            :src="defaultAvatar" 
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
import * as echarts from 'echarts';

export default {
  name: 'ActivityDetail',
  data() {
    return {
      activity: {
        id: '',
        title: '',
        serviceType: '',
        activityArea: '',
        createdAt: '',
        startTime: '',
        endTime: '',
        serviceTarget: '',
        content: '',
        organizationName: '',
        registeredUsers: []
      },
      registeredUsers: [],
      activeTab: 'detail',
      activityId:'',
      commentForm: {
        content: ''
      },
      comments: [],
      defaultAvatar: require('@/assets/default-avatar.png'),
    }
  },
  computed: {
    // 获取当前用户头像
    userAvatar() {
      return this.$store.state.user.userInfo.user.avatar || '@/assets/default-user-avatar.png';
    }
  },
  methods: {
    nod() {
      console.log(this.comments)
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
      const registeredUsers = this.registeredUsers;
      
      for (let i = 0; i < registeredUsers.length; i++) {
        const user = registeredUsers[i];
        if (user._id === userId) {
          return true;
        }
      }
      
      return false;
    },
    async fetchActivityDetail(activityId) {
      try {
        const { data } = await api.activity.getDetail(activityId);
        console.log(data);
        
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
    async submitComment() {
      try {
        if (!this.commentForm.content.trim()) {
          this.$message.warning('评论内容不能为空');
          return;
        }
        
        const response = await api.comment.postComment(this.activityId, this.commentForm.content);
        this.$message.success('评论发布成功');
        
        // 刷新评论列表
        await this.fetchComments(this.activityId);
        this.commentForm.content = '';
        
        // 滚动到最新评论
        this.$nextTick(() => {
          const commentList = document.querySelector('.comments-list');
          if (commentList) {
            commentList.scrollTop = commentList.scrollHeight;
          }
        });
      } catch (error) {
        this.$message.error('评论发布失败，请稍后再试');
        console.error('发表评论失败', error);
      }
    },
    async reportComment(commentId) {
      try {
        await api.comment.reportComment(commentId);
        this.$message.success('举报成功，等待管理员审核');
        await this.fetchComments(this.activityId);
      } catch (error) {
        console.error('举报评论失败', error);
        this.$message.error('举报失败，请稍后再试');
      }
    },
    // 校验活动ID格式
    isValidActivityId(id) {
      return id && /^[0-9a-fA-F]{24}$/.test(id);
    },

    // 处理无效ID
    handleInvalidId() {
      this.$message.error('活动ID格式错误，正在返回大厅...');
      setTimeout(() => this.$router.push('/activity-hall'), 1500);
    },
    async fetchComments(activityId) {
      try {
        const data = await api.comment.getComments(activityId);
        console.log(data);
        
        this.comments = data.data.comments;
        console.log(this.comments);
        
      } catch (error) {
        console.error('拉取评论失败:', error);
        throw error;
      }
    },
    drawCollegeDistributionChart() {
      // 统计每个学院的报名人数
      const collegeCount = {};
      this.registeredUsers.forEach(user => {
        if (collegeCount[user.college]) {
          collegeCount[user.college]++;
        } else {
          collegeCount[user.college] = 1;
        }
      });

      // 转换为 ECharts 所需的数据格式
      const chartData = Object.keys(collegeCount).map(college => ({
        value: collegeCount[college],
        name: college
      }));

      // 初始化 ECharts 实例
      const chart = echarts.init(document.getElementById('college-distribution-chart'));

      // 优化 ECharts 配置项
      const option = {
        title: {
          text: '学院分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
        },
        series: [
          {
            name: '报名人数',
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['50%', '50%'],
            data: chartData
          }
        ]
      };

      // 使用配置项显示图表
      chart.setOption(option);
    }
  },
  async mounted() {
  try {
    // 1. 校验并获取活动ID
    const activityId = this.$route.params.activityId;
    if (!this.isValidActivityId(activityId)) {
      this.handleInvalidId();
      return;
    }
    this.activityId = activityId;

    // 2. 显示加载状态
    this.$loading({ lock: true, text: '加载活动中，请稍候...' });

    // 3. 并行获取活动详情和评论（若无需依赖顺序）
    await Promise.all([
      this.fetchActivityDetail(activityId),
      this.fetchComments(activityId)
    ]);

    // 4. 隐藏加载状态
    this.$loading().close();

  } catch (error) {
    // 5. 统一错误处理
    this.$loading().close();
    this.handleDataLoadError(error);
  }

  this.drawCollegeDistributionChart();
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
  --bilibili-blue: #00a1d6;
  --bilibili-gray: #99a2aa;
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

/* 评论区样式优化 */
.post-comment-area {
  display: flex;
  padding: 15px;
  margin-bottom: 20px;
  background-color: rgba(244, 245, 247, 0.8);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.post-comment-area:hover {
  background-color: rgba(244, 245, 247, 1);
  box-shadow: 0 2px 8px rgba(141,166,123,0.1);
}

.comment-input-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.comment-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.comment-action .el-button {
  background-color: var(--bilibili-blue);
  color: white;
  border-radius: 4px;
  padding: 8px 20px;
  transition: all 0.3s ease;
}

.comment-action .el-button:hover {
  background-color: #008ec4;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 161, 214, 0.3);
}

.comment-action .el-button:disabled {
  background-color: rgba(0, 161, 214, 0.5);
  cursor: not-allowed;
}

.comments-list {
  margin-top: 20px;
}

.comment-item {
  display: flex;
  margin-bottom: 25px;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(141,166,123,0.1);
}

.comment-item:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(141,166,123,0.1);
}

.comment-avatar {
  margin-right: 15px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bilibili-blue);
  transition: all 0.3s ease;
}

.comment-avatar:hover .avatar {
  transform: scale(1.1);
}

.comment-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-name {
  font-weight: 600;
  color: var(--bilibili-blue);
  font-size: 16px;
  transition: all 0.3s ease;
}

.user-name:hover {
  color: var(--forest-dark);
  text-decoration: underline;
}

.college-info {
  color: var(--bilibili-gray);
  font-size: 13px;
  background-color: rgba(141,166,123,0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.comment-content {
  margin: 8px 0;
  line-height: 1.6;
  color: var(--wood-color);
  font-size: 15px;
  padding: 10px;
  background-color: rgba(244, 245, 247, 0.5);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.comment-content:hover {
  background-color: rgba(244, 245, 247, 0.8);
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.comment-time {
  color: var(--bilibili-gray);
  font-size: 13px;
}

.report-btn {
  color: var(--bilibili-gray);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.report-btn:hover {
  color: #ff4d4f;
  transform: translateY(-1px);
}

/* 学院分布图表容器样式 */
.chart-container {
  width: 100%;
  max-width: 600px;
  height: 500px;
  margin: 40px auto 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.95);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(45,90,39,0.08);
  padding: 24px 0;
  transition: box-shadow 0.3s;
}

@media (max-width: 900px) {
  .chart-container {
    max-width: 100%;
    height: 320px;
    padding: 10px 0;
  }
}
</style>
