<template>
  <div>
    <el-button @click="goBack">返回活动大厅</el-button>
    <!-- 活动详情内容 -->
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/activity-hall');
    }
  }
};
</script>
