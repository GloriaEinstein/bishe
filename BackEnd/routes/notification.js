// bishe4/BackEnd/routes/notification.js
import express from 'express';
import { createNotification, getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 发布通知接口
router.post('/publish', authMiddleware, createNotification);

// 获取通知列表接口
router.get('/list', authMiddleware, getNotifications);

// 标记通知为已读接口
router.put('/:notificationId/mark-as-read', authMiddleware, markNotificationAsRead);

export default router;
