import api from '@/api'

export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('authToken') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    unreadNotificationCount: 0 // 新增未读通知数量状态
  }),
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('authToken', token)
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    CLEAR_AUTH(state) {
      state.token = ''
      state.userInfo = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('userInfo')
      state.unreadNotificationCount = 0 // 清除认证时，未读通知数量置为 0
    },
    SET_UNREAD_NOTIFICATION_COUNT(state, count) {
      state.unreadNotificationCount = count // 设置未读通知数量
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const { data } = await api.auth.login(credentials)
      commit('SET_TOKEN', data.token)
      commit('SET_USER_INFO', data.user)
      return data.user
    },
    async register({ commit }, credentials) {
      const { data } = await api.auth.register(credentials)
      commit('SET_TOKEN', data.token)
      commit('SET_USER_INFO', data.user)
      return data.user
    },
    async fetchUserInfo({ commit }) {
      const { data } = await api.user.getInfo()
      commit('SET_USER_INFO', data)
      return data
    },
    async updateProfile({ commit }, payload) {
      const { data } = await api.user.update(payload)
      commit('SET_USER_INFO', data)
      return data
    },
    async fetchUnreadNotificationCount({ commit }) {
      try {
        const { data } = await api.notification.getUnreadCount()
        commit('SET_UNREAD_NOTIFICATION_COUNT', data.count)
      } catch (error) {
        console.error('获取未读通知数量失败', error)
      }
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    }
  }
}
