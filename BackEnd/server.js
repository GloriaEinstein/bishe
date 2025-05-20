import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { connectDB } from './utils/db.js'
import config from './config/index.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import notificationRouter from './routes/notification.js';
import announcementRoutes from './routes/announcement.js';
import newsRoutes from './routes/news.js';
import commentRoutes from './routes/comment.js';
import activityRoutes from './routes/activity.js';
import userAnalysisRoutes from './routes/userAnalysis.js';
import recommendationRoutes from './routes/recommendation.js';
import { errorHandler } from './middlewares/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 3000

// 安全中间件
app.use(helmet())
app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:8080', // 前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // 允许的 HTTP 方法
  allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  credentials: true, // 允许携带凭证（如 cookies）
};

app.use(cors(corsOptions))

// 静态文件
app.use('/uploads', express.static(config.upload.avatarPath))

// 数据库连接
connectDB()

//根路径处理
app.get('/', (req, res) => {
  res.send('Welcome to the server!')
})

// 路由
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/notifications', notificationRouter);
app.use('/api/announcements', announcementRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/user-analysis', userAnalysisRoutes);
app.use('/api/recommendations', recommendationRoutes);
// 错误处理
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`)
})