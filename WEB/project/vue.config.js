// vue.config.js
const path = require('path')

module.exports = {
  // 开发服务器配置（按需启用）
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
}