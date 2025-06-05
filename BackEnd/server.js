import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'; // 导入 path 模块
import { fileURLToPath } from 'url'; // 导入用于 ES Module 获取 __dirname 的函数
import fs from 'fs/promises'; // 导入 fs/promises 用于异步文件操作
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
import recommendationRoutesNew from './routes/recommendationRoutesNew.js';
import { errorHandler } from './middlewares/authMiddleware.js' // 假设你的 errorHandler 在这里

const app = express()
const PORT = process.env.PORT || 3000

// 获取当前模块的目录路径 (server 目录)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 安全中间件
app.use(helmet())
app.use(express.json())

// 使用 config 中定义的 corsOptions
app.use(cors(config.corsOptions))

// 静态文件服务：将 '/uploads' URL 前缀映射到项目根目录下的 'uploads' 文件夹
// 确保这个路径正确，指向你的实际 uploads 文件夹
// 如果你的项目结构是 BackEnd/uploads，那么这里就是 path.join(__dirname, 'uploads')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/recommendations', recommendationRoutesNew);

// 错误处理 (确保这个中间件是最后一个)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`)
  // 在服务器启动时确保头像上传目录存在
  fs.mkdir(config.upload.avatarAbsolutePath, { recursive: true })
    .then(() => console.log(`确保头像上传目录 ${config.upload.avatarAbsolutePath} 存在。`))
    .catch(err => console.error(`创建头像上传目录失败:`, err));
})
