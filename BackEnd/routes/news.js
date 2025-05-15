// bishe8/BackEnd/routes/news.js
import express from 'express';
import { createNews, getNews, getLatestNews } from '../controllers/newsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 发布新闻接口
router.post('/publish', authMiddleware, createNews);

// 获取新闻列表接口
router.get('/list', authMiddleware, getNews);

// 获取最新新闻接口
router.get('/latest/:count', authMiddleware, getLatestNews);

export default router;
