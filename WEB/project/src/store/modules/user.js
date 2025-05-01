import api from '@/api'

export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('authToken') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null
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
    logout({ commit }) {
      commit('CLEAR_AUTH')
    }
  }
}
