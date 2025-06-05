// config/index.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: '7d'
  },
  upload: {
    avatarAbsolutePath: path.join(process.cwd(), 'uploads', 'avatar'), // 确保这个路径指向你的 BackEnd/uploads/avatar
    avatarRelativePathBase: '/uploads/avatar' // 用于数据库存储和前端访问的相对路径前缀
  },
  corsOptions: {
    origin: 'http://localhost:8080', // 前端地址
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
};
