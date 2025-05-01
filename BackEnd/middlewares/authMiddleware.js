import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import config from '../config/index.js'
import { errorResponse } from '../utils/response.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token:', token); // 打印 Token，检查是否正确传递

    if (!token) {
      return res.status(401).json({ code: 401, message: '请先进行身份验证' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // 打印解码后的 Token

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户不存在或已被删除' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('身份验证失败:', error.message);
    res.status(401).json({ code: 401, message: '身份验证失败，请重新登录' });
  }
};

export const errorHandler = (err, req, res, next) => {
  console.error('🚨 Error:', err.stack)

  const statusCode = err.statusCode || 500
  const message = statusCode === 500 ? '服务器错误' : err.message

  errorResponse(res, statusCode, message)
}