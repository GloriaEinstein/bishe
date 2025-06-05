import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import userAnalysis from './modules/userAnalysis'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    userAnalysis,
  }
})