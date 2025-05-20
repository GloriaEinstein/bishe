import express from 'express';
import { createNews, getNews, getLatestNews } from '../controllers/newsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 处理新闻发布
router.post('/publish', authMiddleware, createNews);

router.get('/list', getNews);
router.get('/latest/:count', getLatestNews);

export default router;
