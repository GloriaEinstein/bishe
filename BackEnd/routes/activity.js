import express from 'express';
import ActivityKeywords from '../models/ActivityKeywords.js';
import { createActivity, getActivities, registerActivity, getLatestActivities, getActivityDetail, getRegisteredUsers, getActivityKeywords} from '../controllers/activityController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 发布活动接口
router.post('/publish', authMiddleware, createActivity);

// 获取活动列表接口
router.get('/list', authMiddleware, getActivities);

// 报名活动接口
router.post('/:activityId/register', authMiddleware, registerActivity);

// 获取最新活动接口
router.get('/latest/:count', authMiddleware, getLatestActivities);

router.get('/activity-keywords', getActivityKeywords);

// 获取活动详情接口
router.get('/:activityId', authMiddleware, getActivityDetail);

router.get('/:activityId/registered-users', authMiddleware, getRegisteredUsers);



export default router;
