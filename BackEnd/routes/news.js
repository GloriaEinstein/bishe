import express from 'express';
import { createNews, getNews, getLatestNews } from '../controllers/newsController.js';

const router = express.Router();

// 处理新闻发布（不再处理文件上传）
router.post('/publish', createNews);
router.get('/list', getNews);
router.get('/latest/:count', getLatestNews);

export default router;
