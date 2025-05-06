<template>
  <div>
    <h2>用户审核</h2>
    <el-table :data="unverifiedUsers" stripe>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="userType" label="用户类型"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="verifyUser(scope.row._id)">审核通过</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      unverifiedUsers: []
    };
  },
  async mounted() {
    try {
      const response = await api.user.getUnverifiedUsers();
      this.unverifiedUsers = response.data.users;
    } catch (error) {
      console.error('获取未审核用户列表失败', error);
    }
  },
  methods: {
    async verifyUser(userId) {
      try {
        await api.user.verifyUser(userId);
        this.unverifiedUsers = this.unverifiedUsers.filter(user => user._id !== userId);
        this.$message.success('用户审核通过');
      } catch (error) {
        console.error('审核用户失败', error);
        this.$message.error('审核用户失败');
      }
    }
  }
};
</script>

<style scoped>
/* 样式 */
</style>
