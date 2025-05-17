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

    const user = await User.findById(req.user._id);
    const oldAvatarPath = user.avatar;

    const avatarPath = await processAvatar(req.file.buffer, req.user._id, oldAvatarPath);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    );

    successResponse(res, { avatar: updatedUser.avatar }, '头像上传成功');
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
    const users = await User.find({ 
      userType: { $in: ['schoolOrganization', 'offCampusOrganization'] },
      isVerified: false 
    });
    successResponse(res, { users }, '获取未审核用户列表成功');
  } catch (error) {
    errorResponse(res, 500, '获取未审核用户列表失败');
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: '用户未找到' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};