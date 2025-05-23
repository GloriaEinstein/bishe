// BackEnd/routes/recommendationRoutesNew.js
import express from 'express';
import { getIntelligentRecommendations } from '../controllers/recommendationControllerNew.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/intelligent', authMiddleware, getIntelligentRecommendations);

export default router;
