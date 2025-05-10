import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../utils/response.js';
import config from '../config/index.js';

// bishe10/BackEnd/controllers/authController.js
export const register = async (req, res) => {
  try {
    const { username, password, userType } = req.body;
    let user;
    if (userType === 'schoolOrganization' || userType === 'offCampusOrganization') {
      user = new User({ ...req.body, username: username.trim(), userType, isVerified: false });
      await user.save();
      // 这里可以添加发送审核通知给管理员的逻辑
      successResponse(res, { message: '注册申请已提交，请等待管理员审核' }, '注册申请提交成功');
    } else {
      user = await User.create({ ...req.body, username: username.trim(), userType, isVerified: true });
      successResponse(res, user.toJSON(), '注册成功');
    }
  } catch (error) {
    if (error.code === 11000) {
      errorResponse(res, 400, '用户名已存在');
    } else {
      errorResponse(res, 500, '服务器内部错误');
    }
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(res, 401, '用户名或密码错误');
    }

    if (user.userType === 'schoolOrganization' && !user.isVerified) {
      return errorResponse(res, 401, '您的账号正在审核中，请等待管理员审核通过');
    }

    const token = jwt.sign({ id: user._id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    successResponse(res, { 
      token: `Bearer ${token}`,
      user: user.toJSON()
    }, '登录成功');
  } catch (error) {
    errorResponse(res, 500, '服务器内部错误');
  }
};
