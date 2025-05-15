<template>
  <el-container class="home-container">
    <el-aside width="200px" class="sidebar">
      <div class="logo">志愿者管理平台</div>
      <el-menu
        :default-active="activeMenu"
        router
        @select="handleMenuSelect"
      >
        <!-- 志愿者菜单项 -->
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/volunteer-home">
          <i class="el-icon-user"></i>
          <span>志愿大厅</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/user-center">
          <i class="el-icon-user"></i>
          <span>用户中心</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/activity-hall">
          <i class="el-icon-s-platform"></i>
          <span>活动大厅</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/user-profile">
          <i class="el-icon-s-custom"></i>
          <span>用户画像</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/intelligent-recommendation">
          <i class="el-icon-star-on"></i>
          <span>智能推荐</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/system-notification">
          <i class="el-icon-bell"></i>
          <span>系统通知</span>
          <!-- <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="ml-2"></el-badge> -->
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/campus-news">
          <i class="el-icon-news"></i>
          <span>校园新闻</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/system-announcement">
          <i class="el-icon-setting"></i>
          <span>系统公告</span>
        </el-menu-item>

        <!-- 校组织菜单项 -->
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'schoolOrganization'" index="/user-center">
          <i class="el-icon-user"></i>
          <span>用户中心</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'schoolOrganization'" index="/activity-publish">
          <i class="el-icon-circle-plus"></i>
          <span>活动发布</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'schoolOrganization'" index="/news-publish">
          <i class="el-icon-edit"></i>
          <span>新闻发布</span>
        </el-menu-item>

        <!-- 校外组织菜单项 -->
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'offCampusOrganization'" index="/user-center">
          <i class="el-icon-user"></i>
          <span>用户中心</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'offCampusOrganization'" index="/activity-publish">
          <i class="el-icon-circle-plus"></i>
          <span>活动发布</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'offCampusOrganization'" index="/news-publish">
          <i class="el-icon-edit"></i>
          <span>新闻发布</span>
        </el-menu-item>

        <!-- 管理员菜单项 -->
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'admin'" index="/user-center">
          <i class="el-icon-user"></i>
          <span>用户中心</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'admin'" index="/activity-hall">
          <i class="el-icon-s-platform"></i>
          <span>活动大厅</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'admin'" index="/user-review">
          <i class="el-icon-check"></i>
          <span>用户审核</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'admin'" index="/notification-publish">
          <i class="el-icon-edit"></i>
          <span>通知发布</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'admin'" index="/announcement-publish">
          <i class="el-icon-setting"></i>
          <span>公告发布</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'admin'" index="/report-management">
          <i class="el-icon-warning"></i>
          <span>举报管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import api from '@/api'
import { mapState } from 'vuex'

export default {
  name: 'HomeLayout',
  data() {
    return {
      unreadCount: 0
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    },
    ...mapState('user', ['userInfo']),
    hasUserInfo() {
      return this.userInfo && this.userInfo.user;
    }
  },
  async mounted() {
    try {
      const { data } = await api.notification.getList();
      const unreadNotifications = data.notifications.filter(notification => !notification.isRead);
      this.unreadCount = unreadNotifications.length;
    } catch (error) {
      console.error('获取通知列表失败', error);
    }
    this.$store.dispatch('user/fetchUserInfo')
  },
  methods: {
    handleMenuSelect(index) {
      this.$router.push(index);
    },
    async fetchUserInfo() {
      try {
        const response = await api.get('/user/info', {
          headers: this.headers
        })
        this.$store.commit('user/setUser', response.data.data)
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    },
  }
  
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  background: #f5f7fa;
}

.sidebar {
  width: 200px;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fe 100%);
  box-shadow: 4px 0 15px rgba(82, 95, 127, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #f8f9fe 0%, #ffffff 100%);
  box-shadow: 0 2px 8px rgba(82, 95, 127, 0.04);
  position: relative;
  overflow: hidden;
}

.logo::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #409eff 50%, transparent);
}

.el-menu {
  border-right: none;
  padding: 8px 12px;
}

.el-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 4px 0;
  border-radius: 8px;
  color: #5a5e66;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-menu-item:hover {
  background: rgba(64, 158, 255, 0.08) !important;
  color: #409eff !important;
  transform: translateX(4px);
}

.el-menu-item.is-active {
  background: rgba(64, 158, 255, 0.1) !important;
  color: #409eff !important;
  font-weight: 500;
  position: relative;
}

.el-menu-item.is-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: #409eff;
  border-radius: 0 3px 3px 0;
}

.el-icon {
  font-size: 18px;
  margin-right: 8px;
  vertical-align: text-bottom;
}

.el-main {
  padding: 24px;
  background: #f5f7fa;
  position: relative;
}

.el-main::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #409eff, #79bbff, #a0cfff, #c6e2ff);
  opacity: 0.12;
}

.el-badge {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.el-badge /deep/ .el-badge__content {
  transform: scale(0.8);
  box-shadow: 0 0 0 1px #fff;
}
</style>
