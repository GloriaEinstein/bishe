<template>
  <div class="activity-detail-page">
    <!-- 整体分为左右两个盒子 -->
    <div class="left-right-container">
      <!-- 左盒子，宽度占比 7 -->
      <div class="left-box">
        <!-- 第一个盒子：活动封面、标题、服务类别 -->
        <div class="box1">
          <img :src="getImageUrl(activity.serviceType)" alt="activity image" class="activity-image">
          <div class="title-section">
            <h2>{{ activity.title }}</h2>
            <p>{{ activity.serviceType }}</p>
          </div>
        </div>
        <!-- 第二个盒子：项目地点、发布日期、项目日期、服务对象 -->
        <div class="box2">
          <p>项目地点：{{ activity.activityArea }}</p>
          <p>发布日期：{{ formatDate(activity.createdAt) }}</p>
          <p>项目日期：{{ formatDate(activity.startTime) }} - {{ formatDate(activity.endTime) }}</p>
          <p>服务对象：{{ activity.serviceTarget }}</p>
        </div>
        <!-- 第三个盒子：项目详情、报名信息切换 -->
        <div class="box3">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="项目详情" name="detail">
              <p>{{ activity.content }}</p>
            </el-tab-pane>
            <el-tab-pane label="报名信息" name="registration">
              <ul>
                <li v-for="user in registeredUsers" :key="user._id">{{ user.username }}</li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 右盒子，宽度占比 3 -->
      <div class="right-box">
        <h2>项目发起人</h2>
        <el-image :src="activity.publisher.avatar" fit="cover" class="avatar"></el-image>
        <p>{{ activity.publisher.organizationName }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activity: {
        coverImage: 'https://example.com/activity-cover.jpg',
        title: '示例活动标题',
        serviceType: '社区服务',
        activityArea: '校内',
        createdAt: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        serviceTarget: '儿童',
        content: '这是活动的详细内容...',
        publisher: {
          avatar: 'https://example.com/publisher-avatar.jpg',
          organizationName: '示例组织名称'
        }
      },
      registeredUsers: [
        { _id: 1, username: '用户1' },
        { _id: 2, username: '用户2' }
      ],
      activeTab: 'detail'
    };
  },
  methods: {
    getImageUrl(serviceType) {
      return require(`@/assets/${serviceType}.png`);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.activity-detail-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.left-right-container {
  display: flex;
  gap: 20px;
}

.left-box {
  flex: 7;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.right-box {
  flex: 3;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.box1 {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 20px;
}

.cover-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.activity-image {
  max-width: 100%; /* 确保图片不会超出容器宽度 */
  max-height: 300px; /* 限制图片的最大高度 */
  object-fit: cover; /* 保持图片比例并裁剪溢出部分 */
  border-radius: 8px; /* 添加圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.title-section h2 {
  font-size: 24px;
  color: #333333;
  margin: 0;
}

.title-section p {
  font-size: 16px;
  color: #666666;
  margin-top: 8px;
}

.box2 {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.box2 p {
  font-size: 16px;
  color: #555555;
  margin: 8px 0;
}

.box3 {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-tabs__header {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e5e5e5;
}

.el-tab-pane {
  padding: 10px 0;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.right-box h2 {
  font-size: 20px;
  color: #333333;
  margin-bottom: 10px;
}

.right-box p {
  font-size: 16px;
  color: #666666;
  margin-top: 8px;
}
</style>
