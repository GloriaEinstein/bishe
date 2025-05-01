import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/userController.js';
import config from '../config/index.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: config.upload.limits 
});

router.get('/info', authMiddleware, getProfile);
router.post('/update', authMiddleware, updateProfile);
router.post('/uploadAvatar', authMiddleware, upload.single('avatar'), uploadAvatar);

export default router;