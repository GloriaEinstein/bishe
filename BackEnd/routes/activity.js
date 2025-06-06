// server/routes/activity.js
import express from 'express';
import {
  createActivity,
  getActivities,
  registerActivity,
  getLatestActivities,
  getActivityDetail,
  getRegisteredUsers,
  getActivityKeywords,
  getPendingActivities,
  approveActivity,
  rejectActivity,
  getPublishedActivities
} from '../controllers/activityController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/publish', authMiddleware, createActivity);
router.get('/list', authMiddleware, getActivities);
router.post('/:activityId/register', authMiddleware, registerActivity);
router.get('/latest/:count', authMiddleware, getLatestActivities);
router.get('/activity-keywords', getActivityKeywords);
router.get('/:activityId/registered-users', authMiddleware, getRegisteredUsers); // 获取已报名用户

// !!! 移除 activity 路由中的 getCertifiedUsers 和 certifyUsersForActivity !!!
// router.get('/:activityId/certified-users', authMiddleware, getCertifiedUsers);
// router.post('/:activityId/certify-users', authMiddleware, certifyUsersForActivity);

router.get('/pending', authMiddleware, getPendingActivities);
router.put('/:activityId/approve', authMiddleware, approveActivity);
router.put('/:activityId/reject', authMiddleware, rejectActivity);

// 获取当前用户发布的活动列表（带 username 过滤）
router.get('/published', authMiddleware, getPublishedActivities);

router.get('/:activityId', authMiddleware, getActivityDetail);

export default router;