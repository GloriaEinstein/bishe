// store/modules/userAnalysis.js
export default {
  namespaced: true,
  state: {
    wordcloudHistory: {} // 结构：{ userId: { prevKeywords: [], currentKeywords: [] } }
  },
  mutations: {
    UPDATE_KEYWORDS(state, { userId, keywords }) {
      if (!state.wordcloudHistory[userId]) {
        state.wordcloudHistory[userId] = { prevKeywords: [], currentKeywords: [] };
      }
      // 将当前数据变为历史，新数据存入current
      state.wordcloudHistory[userId].prevKeywords = state.wordcloudHistory[userId].currentKeywords;
      state.wordcloudHistory[userId].currentKeywords = keywords;
    }
  },
  getters: {
    getGrowthRate: (state) => (userId) => {
      const history = state.wordcloudHistory[userId];
      if (!history || history.prevKeywords.length === 0) return 0;
      
      const prevCount = new Set(history.prevKeywords).size;
      const currentCount = new Set(history.currentKeywords).size;
      return ((currentCount - prevCount) / prevCount * 100).toFixed(1);
    }
  }
};