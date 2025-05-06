import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { processAvatar } from '../services/upload.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    successResponse(res, { user }, '获取用户信息成功');
  } catch (error) {
    errorResponse(res, 500, '获取用户信息失败');
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { college, major, email } = req.body;
    const updateData = {
      ...req.body,
      college,
      major,
      email
    };
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    );
    successResponse(res, { user }, '更新资料成功');
  } catch (error) {
    errorResponse(res, 500, '更新资料失败');
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, '请上传头像文件');
    }
    
    const avatarPath = await processAvatar(req.file.buffer, req.user._id);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    );
    
    successResponse(res, { avatar: user.avatar }, '头像上传成功');
  } catch (error) {
    errorResponse(res, 500, '头像上传失败');
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );
    if (!user) {
      return errorResponse(res, 404, '用户不存在');
    }
    successResponse(res, { user }, '用户审核通过');
  } catch (error) {
    errorResponse(res, 500, '审核用户失败');
  }
};

export const getUnverifiedUsers = async (req, res) => {
  try {
    const users = await User.find({ userType: 'schoolOrganization', isVerified: false });
    successResponse(res, { users }, '获取未审核用户列表成功');
  } catch (error) {
    errorResponse(res, 500, '获取未审核用户列表失败');
  }
};
