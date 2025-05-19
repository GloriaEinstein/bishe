import express from 'express';
import { createNews, getNews, getLatestNews } from '../controllers/newsController.js';
import { upload } from '../middlewares/upload.js'; // 确保路径正确

const router = express.Router();

// 处理文件上传的路由
router.post('/publish', upload.single('coverImage'), createNews);
router.get('/list', getNews);
router.get('/latest/:count', getLatestNews);

export default router;
