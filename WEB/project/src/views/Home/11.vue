<template>
  <div class="user-center">
    <el-card>
      <h2>用户中心</h2>
      <el-divider />

      <div class="avatar-section" v-if="userInfo">
        <el-image
          :src="userInfo.user.avatar || defaultAvatar"
          fit="cover"
          class="avatar"
        />
        <el-upload
          :action="uploadUrl"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
        >
          <el-button type="primary" size="small">更换头像</el-button>
        </el-upload>
      </div>
      <!-- 其他代码 -->
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import api from '@/api'

export default {
  name: 'UserCenter',
  data() {
    return {
      defaultAvatar: require('@/assets/default-avatar.png'),
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/user/uploadAvatar',
      collegeMajorMap: {
        // 学院专业映射
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    headers() {
      const token = localStorage.getItem('authToken')
      return {
        Authorization: `Bearer ${token}`
      }
    }
  },
  // 其他代码
}
</script>

<style scoped>
/* 样式代码 */
</style>
