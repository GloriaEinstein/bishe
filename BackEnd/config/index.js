// config/index.js
import path from 'path'  // 添加模块导入

export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: '7d'
  },
  upload: {
    limits: {
      fileSize: 2 * 1024 * 1024 // 2MB
    },
    avatarPath: path.join(process.cwd(), 'uploads/avatar') // 现在可以正确使用path
  },
  corsOptions: {
    origin:'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
}