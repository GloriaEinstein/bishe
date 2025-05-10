// bishe4/WEB/project/src/api/index.js
import request from '@/utils/request';

const getAuthHeader = () => {
  const token = store.state.user.token;
  return {
    Authorization: `Bearer ${token}`
  };
};
const activityApi = {
  getList: (filters) => request.get('/activity/list', { params: filters })
};

export default {
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
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    getUnverifiedUsers: () => request.get('/users/unverified'),
    verifyUser: (userId) => request.put(`/users/verify/${userId}`)
  },
  notification: {
    publish: (data) => request.post('/notifications/publish', data),
    getList: () => request.get('/notifications/list'),
    markAsRead: (notificationId) => request.put(`/notifications/${notificationId}/mark-as-read`),
    getUnreadCount: () => request.get('/notifications/unreadCount')
  },
  announcement: {
    publish: (data) => request.post('/announcements/publish', data),
    getList: () => request.get('/announcements/list')
  },
  news: {
    publish: (data) => request.post('/news/publish', data),
    getList: () => request.get('/news/list')
  },
  activity: {
    publish: (data) => request.post('/activity/publish', data),
    getList: () => request.get('/activity/list')
  }
};
