// bishe4/WEB/project/src/api/index.js
import request from '@/utils/request';
import store from '@/store'; // 确保导入store，以便获取token

const getAuthHeader = () => {
  const token = store.state.user.token;
  return {
    Authorization: `Bearer ${token}`
  };
};

const activityApi = {
  getList: (filters) => request.get('/activity/list', { params: filters }),
  publish: (data) => request.post('/activity/publish', data),
  register: (activityId, data) => request.post(`/activity/${activityId}/register`, data),
  getLatestActivities: (count) => request.get(`/activity/latest/${count}`),
  getActivityKeywords: () => request.get('/activity/activity-keywords'),
  getPendingActivities: () => request.get('/activity/pending'),
  approveActivity: (activityId) => request.put(`/activity/${activityId}/approve`),
  rejectActivity: (activityId) => request.put(`/activity/${activityId}/reject`),
  getPublishedActivities: (params) => request.get('/activity/published', { params }),
  getRegisteredUsers: (activityId) => request.get(`/activity/${activityId}/registered-users`),
  getDetail: (activityId) => request.get(`/activity/${activityId}`),
};

const userApi = {
  getProfile: () => request.get('/user/profile'),
  updateProfile: (data) => request.put('/user/profile', data),
  uploadAvatar: (formData) => request.post('/user/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updatePassword: (data) => request.put('/user/password', data),
  getUnverifiedOrganizations: () => request.get('/user/unverified-organizations'),
  verifyOrganization: (userId) => request.put(`/user/${userId}/verify`),
  rejectOrganization: (userId) => request.put(`/user/${userId}/reject`),
  getUserByUsername: (username) => request.get(`/user/by-username/${username}`),
  getUserDataForWordCloud: (userId) => request.get(`/user-analysis/user-data-for-wordcloud/${userId}`),
  getUserById: (userId) => request.get(`/user/${userId}`),
  // 修正后的 API 定义: activityId 作为 URL 参数，userIds 在请求体中
  certifyUserAsOutstanding: (activityId, userIds) => request.post(`/user/${activityId}/certify-outstanding`, { userIds }),
  // 修正后的 API 定义: 参数名为 activityId
  getOutstandingUsersForActivity: (activityId) => request.get(`/user/${activityId}/outstanding-users`),
};

const notificationApi = {
  publish: (data) => request.post('/notifications/publish', data),
  getList: () => request.get('/notifications/list'),
  markAsRead: (notificationId) => request.put(`/notifications/${notificationId}/mark-as-read`),
  getUnreadCount: () => request.get('/notifications/unreadCount'),
  sendWarning: (userId, content) => request.post('/notifications/send-warning', { userId, content }),
};

const announcementApi = {
  publish: (data) => request.post('/announcements/publish', data),
  getList: (params = {}) => request.get('/announcements/list', { params }),
  getDetail: (announcementId) => request.get(`/announcements/${announcementId}`),
  deleteAnnouncement: (announcementId) => request.delete(`/announcements/${announcementId}`),
  updateAnnouncement: (announcementId, data) => request.put(`/announcements/${announcementId}`, data),
};

const newsApi = {
  publishNews: (data) => request.post('/news/publish', data),
  getNewsList: (params = {}) => request.get('/news/list', { params }),
  getLatestNews: (count) => request.get(`/news/latest/${count}`),
  getNewsDetail: (newsId) => request.get(`/news/${newsId}`),
  deleteNews: (newsId) => request.delete(`/news/${newsId}`),
  updateNews: (newsId, data) => request.put(`/news/${newsId}`, data),
};

const commentApi = {
  getComments: (activityId) => request.get(`/comments/${activityId}`),
  postComment: (activityId, content) => request.post(`/comments/${activityId}`, { content }),
  reportComment: (commentId) => request.post(`/comments/report/${commentId}`),
  getReportedComments: () => request.get('/comments/reported'),
  deleteComment: (commentId) => request.delete(`/comments/${commentId}`),
  ignoreReport: (commentId) => request.put(`/comments/ignore/${commentId}`),
};

const adminApi = {
  getPendingActivities: () => request.get('/admin/activities/pending'),
  approveActivity: (activityId) => request.put(`/admin/activities/${activityId}/approve`),
  rejectActivity: (activityId) => request.put(`/admin/activities/${activityId}/reject`),
  getAllActivities: (params) => request.get('/admin/activities/all', { params }),
  getAllUsers: (params) => request.get('/admin/users/all', { params }),
  deleteUser: (userId) => request.delete(`/admin/users/${userId}`),
  deleteActivity: (activityId) => request.delete(`/admin/activities/${activityId}`),
  updateUserStatus: (userId, status) => request.put(`/admin/users/${userId}/status`, { status }),
};

export default {
  activity: activityApi,
  user: userApi,
  notification: notificationApi,
  announcement: announcementApi,
  news: newsApi,
  comment: commentApi,
  admin: adminApi,
};