// bishe4/WEB/project/src/api/index.js
import request from '@/utils/request';

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
  getDetail: (activityId) => request.get(`/activity/${activityId}`),
  getRegisteredUsers: (activityId) => request.get(`/activity/${activityId}/registered-users`)
};

const newsApi = {
  publishNews: (data) => request.post('/news/publish', data),
  getNewsList: (params = {}) => request.get('/news/list', { params }),
  getLatestNews: (count) => request.get(`/news/latest/${count}`)
};

export default {getIntelligentRecommendations() {
    return request({
      url: '/api/recommendations/intelligent',
      method: 'get'
    });
  },
  activity: activityApi,
  auth: {
    login: (data) => request.post('/auth/login', data),
    register: (data) => request.post('/auth/register', data)
  },
  user: {
    getInfo: () => request.get('/users/info'),
    update: (data) => request.post('/users/update', data),
    uploadAvatar: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return request.post('/users/uploadAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    getUnverifiedUsers: () => request.get('/users/unverified'),
    verifyUser: (userId) => request.put(`/users/verify/${userId}`),
    getUserByUsername: (username) => request.get(`/user/by-username/${username}`),
    getUserDataForWordCloud: (userId) => request.get(`/user-analysis/user-data-for-wordcloud/${userId}`)
  },
  notification: {
    publish: (data) => request.post('/notifications/publish', data),
    getList: () => request.get('/notifications/list'),
    markAsRead: (notificationId) => request.put(`/notifications/${notificationId}/mark-as-read`),
    getUnreadCount: () => request.get('/notifications/unreadCount'),
    sendWarning: (userId, content) => request.post('/notifications/send-warning', { userId, content })
  },
  announcement: {
    publish: (data) => request.post('/announcements/publish', data),
    getList: () => request.get('/announcements/list')
  },
  news: newsApi,
  comment: {
    getComments: (activityId) => request.get(`/comments/${activityId}`),
    postComment: (activityId, content) => request.post(`/comments/${activityId}`, { content }),
    reportComment: (commentId) => request.post(`/comments/report/${commentId}`) ,// 路径对应新路由
    getReportedComments: () => request.get('/comments/reported'),
    deleteComment: (commentId) => request.delete(`/comments/${commentId}`),
    ignoreReport: (commentId) => request.put(`/comments/ignore/${commentId}`)
  },
  recommendation: {
    getRecommendations: () => request.get('/recommendations')
  },
};