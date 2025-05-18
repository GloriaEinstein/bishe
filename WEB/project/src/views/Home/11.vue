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
          <div class="info-item">
            <i class="el-icon-s-check"></i>
            <span>项目状态：{{ activity.projectStatus }}</span>
          </div>
          <div class="info-item">
            <i class="el-icon-user"></i>
            <span>参与人数：{{ activity.registeredUsers.length }}/{{ activity.participantCount }}</span>
          </div>
        </div>

        <!-- 详情/报名/评论切换 -->
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
                <div v-for="user in registeredUsers" :key="user._id" class="user-item">
                  <i class="el-icon-user"></i>
                  {{ user.username }} <!-- 显示用户名 -->
                </div>
                <div v-if="registeredUsers.length === 0" class="empty-tip">
                  暂无报名人员
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="评论区" name="comments">
              <div class="comment-section">
                <el-form :model="commentForm" @submit.prevent="submitComment">
                  <el-form-item>
                    <el-input v-model="commentForm.content" type="textarea" placeholder="发表评论"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitComment">发表</el-button>
                  </el-form-item>
                </el-form>
                <div v-for="comment in comments" :key="comment._id" class="comment-item">
                  <el-image :src="comment.user.avatar" fit="cover" class="avatar"></el-image>
                  <span class="user-name">{{ comment.user.name }}</span>
                  <p class="comment-content">{{ comment.content }}</p>
                  <el-button type="danger" size="mini" @click="reportComment(comment._id)">举报</el-button>
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
            :src="activity.publisher?.avatar" 
            fit="cover" 
            class="avatar wood-frame"
          ></el-image>
          <p class="organization-name">
            <i class="el-icon-school"></i>
            {{ activity.publisher?.organizationName || '未填写组织信息' }}
          </p>
          <el-button 
            class="forest-btn" 
            @click="registerActivity(activity._id)" 
            :disabled="isRegistered(activity)"
          >
            <i class="el-icon-thumb"></i>
            立即报名
          </el-button>
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
        introduction: '',
        serviceType: '',
        activityArea: '',
        createdAt: '',
        startTime: '',
        endTime: '',
        serviceTarget: '',
        content: '',
        participantCount: 0,
        projectStatus: '',
        publisher: {
          avatar: '',
          organizationName: ''
        },
        registeredUsers: []
      },
      registeredUsers: [],
      activeTab: 'detail',
      commentForm: {
        content: ''
      },
      comments: []
    }
  },
  async mounted() {
    try {
      const activityId = this.$route.params.id;
      const { data } = await api.activity.getActivityDetail(activityId);
      this.activity = data.activity;
      this.registeredUsers = data.registeredUsers;
      const commentsResponse = await api.comment.getComments(activityId);
      this.comments = commentsResponse.data.comments;
    } catch (error) {
      console.error('获取活动详情失败', error);
    }
  },
  methods: {
    async submitComment() {
      try {
        const activityId = this.$route.params.id;
        const response = await api.comment.postComment(activityId, this.commentForm.content);
        this.comments.push(response.data.comment);
        this.commentForm.content = '';
      } catch (error) {
        console.error('发表评论失败', error);
      }
    },
    async reportComment(commentId) {
      try {
        await api.comment.reportComment(commentId);
        this.$message.success('举报成功，等待管理员审核');
      } catch (error) {
        console.error('举报评论失败', error);
      }
    }
  }
}
</script>

<style scoped>
.comment-section {
  padding: 20px;
}

.comment-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-weight: bold;
  margin-right: 10px;
}

.comment-content {
  flex-grow: 1;
}
</style>
