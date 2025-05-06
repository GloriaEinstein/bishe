// bishe4/WEB/project/src/api/index.js
import request from '@/utils/request';

export default {
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
    verifyUser: (userId) => request.put(`/users/verify/${userId}`)
  },
  notification: {
    publish: (data) => request.post('/notifications/publish', data),
    getList: () => request.get('/notifications/list'),
    markAsRead: (notificationId) => request.put(`/notifications/${notificationId}/mark-as-read`),
    getUnreadCount: () => request.get('/notifications/unreadCount')
  }
};
