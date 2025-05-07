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
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/user-center">
          <i class="el-icon-user"></i>
          <span>用户中心</span>
        </el-menu-item>
        <el-menu-item v-if="hasUserInfo && userInfo.user.userType === 'volunteer'" index="/activity-hall">
          <i class="el-icon-s-platform"></i>
          <span>活动大厅</span>
        </el-menu-item>
        <!-- 其他菜单项同理添加 hasUserInfo 检查 -->
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
}
</style>
