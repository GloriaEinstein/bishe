// server/routes/user.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, uploadAvatar, verifyUser, getUnverifiedUsers, getUserByUsername ,certifyUserAsOutstanding ,getOutstandingUsersForActivity ,getUserById} from '../controllers/userController.js';
import upload from '../middlewares/uploadMiddleware.js'; 

const router = express.Router();

router.get('/info', authMiddleware, getProfile);
router.post('/update', authMiddleware, updateProfile);
router.post('/uploadAvatar', authMiddleware, upload.single('file'), uploadAvatar);
router.put('/verify/:userId', authMiddleware, verifyUser);
router.get('/unverified', authMiddleware, getUnverifiedUsers);
router.get('/by-username/:username', authMiddleware, getUserByUsername);
router.post('/:userId/certify-outstanding', authMiddleware, certifyUserAsOutstanding);
router.get('/:userId', authMiddleware, getUserById);
// !!! 新增：认证用户为优秀 (activityId 作为 params) !!!
router.post('/:activityId/certify-outstanding', authMiddleware, certifyUserAsOutstanding);

// !!! 新增：获取某个活动下已报名用户的优秀认证状态 !!!
router.get('/:activityId/outstanding-users', authMiddleware, getOutstandingUsersForActivity);

export default router;
