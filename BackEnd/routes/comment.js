// comment.js 路由文件
import express from 'express';
import { getComments, postComment, reportComment, getReportedComments, deleteComment, ignoreReport } from '../controllers/commentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 先处理具体路径
router.get('/reported', authMiddleware, getReportedComments);
router.post('/report/:commentId', authMiddleware, reportComment); 
router.get('/:activityId', getComments);
router.post('/:activityId', authMiddleware, postComment);
router.delete('/:commentId', authMiddleware, deleteComment);
router.put('/ignore/:commentId', authMiddleware, ignoreReport);

export default router;
