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
            <h2>{{ activity.title }}</h2>
            <p class="service-type">{{ activity.serviceType }}</p>
            <p class="introduction">{{ activity.introduction }}</p> <!-- 新增简介展示 -->
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
                <div v-for="user in registeredUsers" :key="user._id" class="user-item">
                  <i class="el-icon-user"></i>
                  {{ user.username }} <!-- 显示用户名 -->
                </div>
                <div v-if="registeredUsers.length === 0" class="empty-tip">
                  暂无报名人员
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
        introduction: '', // 新增简介字段
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
      activeTab: 'detail'
    }
  },
  methods: {
    getImageUrl(serviceType) {
      return require(`@/assets/${serviceType}.png`)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    async registerActivity(activityId) {
      try {
        const userId = this.$store.state.user.userInfo._id
        await api.activity.register(activityId, { userId })
        this.$message.success('报名成功')
        this.fetchActivityDetail(activityId)
      } catch (error) {
        this.$message.error(error.response?.data?.message || '报名失败')
      }
    },
    isRegistered(activity) {
      const userId = this.$store.state.user.userInfo._id
      return activity.registeredUsers.some(user => user._id === userId)
    },
    async fetchActivityDetail(activityId) {
      try {
        const { data } = await api.activity.getDetail(activityId)
        this.activity = data.activity
        this.registeredUsers = data.activity.registeredUsers
      } catch (error) {
        this.$message.error('获取活动详情失败')
        this.$router.push('/activity-hall')
      }
    }
  },
  async mounted() {
    const activityId = this.$route.params.activityId
    this.fetchActivityDetail(activityId)
  }
}
</script>