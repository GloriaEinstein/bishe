import express from 'express';
import NewsKeywords from '../models/News.js';
import { createNews, getNews, getLatestNews,getNewsKeywords,getNewsDetail} from '../controllers/newsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 处理新闻发布
router.post('/publish', authMiddleware, createNews);

router.get('/list', getNews);
router.get('/latest/:count', getLatestNews);

router.get('/news-keywords', getNewsKeywords);

router.get('/:newsId', getNewsDetail);

export default router;