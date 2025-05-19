// BackEnd/routes/userAnalysisRoutes.js
import express from 'express';
import { getUserDataForWordCloud } from '../controllers/userAnalysisController.js';

const router = express.Router();

router.get('/user-data-for-wordcloud/:userId', getUserDataForWordCloud);

export default router;
