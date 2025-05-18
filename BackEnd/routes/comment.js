// comment.js 路由文件
import express from 'express';
import { getComments, postComment, reportComment } from '../controllers/commentController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const router = express.Router();

// 调整顺序：先处理具体路径，再处理通用参数
router.post('/report/:commentId', authMiddleware, reportComment); // 修改为/report/:commentId
router.get('/:activityId', getComments);
router.post('/:activityId', authMiddleware, postComment);

export default router;