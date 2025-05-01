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
export default {
  name: 'HomeLayout',
  computed: {
    activeMenu() {
      return this.$route.path
    }
  },
  methods: {
    handleMenuSelect(index) {
      this.$router.push(index)
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
</style>