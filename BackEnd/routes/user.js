// server/routes/user.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, uploadAvatar, verifyUser, getUnverifiedUsers, getUserByUsername } from '../controllers/userController.js';
import upload from '../middlewares/uploadMiddleware.js'; 

const router = express.Router();

router.get('/info', authMiddleware, getProfile);
router.post('/update', authMiddleware, updateProfile);
router.post('/uploadAvatar', authMiddleware, upload.single('file'), uploadAvatar);
router.put('/verify/:userId', authMiddleware, verifyUser);
router.get('/unverified', authMiddleware, getUnverifiedUsers);
router.get('/by-username/:username', authMiddleware, getUserByUsername);

export default router;
