// config/index.js
import path from 'path';

export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: '7d'
  },
  upload: {
    limits: {
      fileSize: 2 * 1024 * 1024 // 2MB
    },
    avatarPath: path.join(process.cwd(), 'src/uploads/avatar') // 修改为 src 下的文件夹
  },
  corsOptions: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
};
