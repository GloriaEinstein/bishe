import express from 'express';
import { createNews, getNews, getLatestNews } from '../controllers/newsController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// 处理新闻发布，先上传图片，再创建新闻
router.post('/publish', upload.single('image'), (req, res, next) => {
  if (req.file) {
    req.body.coverImage = `/uploads/news/${req.file.filename}`;
  }
  next();
}, createNews);

router.get('/list', getNews);
router.get('/latest/:count', getLatestNews);

export default router;
