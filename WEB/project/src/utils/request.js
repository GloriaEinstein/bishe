import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: 'http://localhost:3000/api', // 通过代理转发到后端
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.data.code !== 200) {
      Message.error(response.data.message || '请求失败')
      return Promise.reject(new Error(response.data.message))
    }
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Message.error('登录已过期，请重新登录')
          router.push('/login')
          break
        case 403:
          Message.error('没有操作权限')
          break
        default:
          Message.error(error.response.data.message || '服务器错误')
      }
    }
    return Promise.reject(error)
  }
)

export default service