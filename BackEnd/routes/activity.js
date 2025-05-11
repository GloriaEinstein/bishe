// bishe8/BackEnd/routes/activity.js
import express from 'express';
import { createActivity, getActivities, registerActivity } from '../controllers/activityController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 发布活动接口
router.post('/publish', authMiddleware, createActivity);

// 获取活动列表接口
router.get('/list', authMiddleware, getActivities);

router.post('/:activityId/register', authMiddleware, registerActivity);

export default router;
