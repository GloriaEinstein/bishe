<template>
  <el-container class="home-container">
    <el-aside width="200px" class="sidebar">
      <div class="logo">志愿者管理平台</div>
      <el-menu
        :default-active="activeMenu"
        router
        @select="handleMenuSelect"
      >
        <!-- 其他菜单项 -->
        <el-menu-item index="/system-notification">
          <i class="el-icon-bell"></i>
          <span>系统通知</span>
          <!-- 显示红色气泡提示 -->
          <span v-if="unreadNotificationCount > 0" class="red-bubble">{{ unreadNotificationCount }}</span>
        </el-menu-item>
        <!-- 其他菜单项 -->
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
import { mapState, mapActions } from 'vuex';

export default {
  name: 'HomeLayout',
  computed: {
    ...mapState('user', ['unreadNotificationCount']),
    activeMenu() {
      return this.$route.path;
    }
  },
  async mounted() {
    await this.fetchUnreadNotificationCount();
  },
  methods: {
    ...mapActions('user', ['fetchUnreadNotificationCount']),
    handleMenuSelect(index) {
      if (index === '/system-notification') {
        this.$store.commit('user/SET_UNREAD_NOTIFICATION_COUNT', 0); // 点击系统通知栏，清除未读通知数量
      }
      this.$router.push(index);
    }
  }
};
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
  position: relative;
}

/* 红色气泡样式 */
.red-bubble {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}
</style>
