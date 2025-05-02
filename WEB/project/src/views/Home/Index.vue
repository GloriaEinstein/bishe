<template>
  <el-container class="home-container">
    <el-aside width="200px" class="sidebar">
      <div class="logo">志愿者管理平台</div>
      <el-menu
        :default-active="activeMenu"
        router
        @select="handleMenuSelect"
      >
        <el-menu-item index="/user-center">
          <i class="el-icon-user"></i>
          <span>用户中心</span>
        </el-menu-item>
        <el-menu-item index="/activity-hall">
          <i class="el-icon-s-platform"></i>
          <span>活动大厅</span>
        </el-menu-item>
        <el-menu-item index="/user-profile">
          <i class="el-icon-s-custom"></i>
          <span>用户画像</span>
        </el-menu-item>
        <el-menu-item index="/intelligent-recommendation">
          <i class="el-icon-star-on"></i>
          <span>智能推荐</span>
        </el-menu-item>
        <el-menu-item index="/system-notification">
          <i class="el-icon-bell"></i>
          <span>系统通知</span>
          <!-- <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="ml-2"></el-badge> -->
        </el-menu-item>
        <el-menu-item index="/campus-news">
          <i class="el-icon-news"></i>
          <span>校园新闻</span>
        </el-menu-item>
        <el-menu-item index="/system-announcement">
          <i class="el-icon-setting"></i>
          <span>系统公告</span>
        </el-menu-item>
        <el-menu-item index="/activity-publish">
          <i class="el-icon-circle-plus"></i>
          <span>活动发布</span>
        </el-menu-item>
        <el-menu-item index="/user-review">
          <i class="el-icon-check"></i>
          <span>用户审核</span>
        </el-menu-item>
        <el-menu-item index="/notification-publish">
          <i class="el-icon-edit"></i>
          <span>通知发布</span>
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
  },
  methods: {
    handleMenuSelect(index) {
      this.$router.push(index);
    }
  }
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
}

.sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #d9d9d9;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  background-color: rgba(24, 144, 255, 0.1);
}

.el-main {
  padding: 20px;
  background-color: #f0f2f5;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  height: 56px;
  line-height: 56px;
}

.ml-2 {
  margin-left: 8px;
}
</style>
