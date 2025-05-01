import request from '@/utils/request'

export default {
  auth: {
    login: (data) => request.post('/auth/login', data),
    register: (data) => request.post('/auth/register', data)
  },
  user: {
    getInfo: () => request.get('/users/info'),
    update: (data) => request.patch('/users/update', data),
    uploadAvatar: (file) => {
      const formData = new FormData()
      formData.append('avatar', file)
      return request.post('/users/uploadAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  }
}