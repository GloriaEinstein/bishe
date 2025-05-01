import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { successResponse, errorResponse } from '../utils/response.js'
import config from '../config/index.js'

export const register = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.create({ ...req.body, username: username.trim() })
    
    successResponse(res, user.toJSON(), '注册成功')
  } catch (error) {
    if (error.code === 11000) {
      errorResponse(res, 400, '用户名已存在')
    } else {
      errorResponse(res, 500, '服务器内部错误')
    }
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(res, 401, '用户名或密码错误')
    }

    const token = jwt.sign({ id: user._id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    })

    successResponse(res, { 
      token: `Bearer ${token}`,
      user: user.toJSON()
    }, '登录成功')
  } catch (error) {
    errorResponse(res, 500, '服务器内部错误')
  }
}