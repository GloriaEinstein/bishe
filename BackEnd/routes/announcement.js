// bishe8/BackEnd/routes/announcement.js
import express from 'express';
import { createAnnouncement, getAnnouncements } from '../controllers/announcementController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 发布公告接口
router.post('/publish', authMiddleware, createAnnouncement);

// 获取公告列表接口
router.get('/list', authMiddleware, getAnnouncements);

export default router;
