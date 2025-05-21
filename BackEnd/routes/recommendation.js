import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 获取推荐数据接口
router.get('/', authMiddleware, getRecommendations);

export default router;
