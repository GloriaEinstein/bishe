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
  getPublishedActivities // 确保已导入
} from '../controllers/activityController.js';
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

router.get('/:activityId/registered-users', authMiddleware, getRegisteredUsers);

// 获取待审核活动列表接口
router.get('/pending', authMiddleware, getPendingActivities);

// 审核通过活动接口
router.put('/:activityId/approve', authMiddleware, approveActivity);

// 审核拒绝活动接口
router.put('/:activityId/reject', authMiddleware, rejectActivity);

// 获取校组织发布的活动列表 (修改这里，不再是路径参数)
router.get('/published', authMiddleware, getPublishedActivities);

// 获取活动详情接口
router.get('/:activityId', authMiddleware, getActivityDetail);
export default router;