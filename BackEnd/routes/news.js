import express from 'express';
import { createNews, getNews, getLatestNews } from '../controllers/newsController.js';
// 修复：添加文件扩展名
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/publish', upload.single('coverImage'), createNews);
router.get('/list', getNews);
router.get('/latest/:count', getLatestNews);

export default router;  