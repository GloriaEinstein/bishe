// server/routes/user.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, uploadAvatar, verifyUser, getUnverifiedUsers, getUserByUsername } from '../controllers/userController.js';
// import config from '../config/index.js'; // 不需要在这里导入config，Multer配置已在uploadMiddleware中完成
import upload from '../middlewares/uploadMiddleware.js'; // 导入 Multer 配置

const router = express.Router();

// getProfile 和 updateProfile 保持不变
router.get('/info', authMiddleware, getProfile);
router.post('/update', authMiddleware, updateProfile);

router.post('/uploadAvatar', authMiddleware, upload.single('file'), uploadAvatar);

// 其他路由保持不变
router.put('/verify/:userId', authMiddleware, verifyUser);
router.get('/unverified', authMiddleware, getUnverifiedUsers);
router.get('/by-username/:username', authMiddleware, getUserByUsername);

export default router;