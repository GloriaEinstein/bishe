import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// 注册接口
router.post('/register', register);

// 登录接口
router.post('/login', login);

export default router;