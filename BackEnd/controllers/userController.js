// server/controllers/userController.js
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { processAvatar } from '../services/upload.js'; // 确保这里导入的是 services/upload.js
import { createNotification } from './notificationController.js'; 

export const getProfile = async (req, res) => {
  try {
    // 假设 req.user._id 是认证中间件设置的用户 ID
    const user = await User.findById(req.user._id).select('-password'); // 避免返回密码
    if (!user) {
      return errorResponse(res, 404, '用户不存在');
    }
    successResponse(res, { user }, '获取用户信息成功');
  } catch (error) {
    console.error('获取用户信息失败:', error); // 打印详细错误信息
    errorResponse(res, 500, '获取用户信息失败');
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, password, userType, createdAt, isVerified, ...updateData } = req.body; // 过滤掉不允许直接修改的字段
    
    // 确保只更新允许修改的字段
    const allowedUpdates = ['name', 'studentId', 'college', 'major', 'email', 'signature'];
    const actualUpdate = {};
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        actualUpdate[key] = updateData[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: actualUpdate },
      { new: true, runValidators: true } // 运行 Schema 验证器
    ).select('-password'); // 避免返回密码

    if (!user) {
      return errorResponse(res, 404, '用户不存在');
    }
    successResponse(res, { user }, '更新资料成功');
  } catch (error) {
    console.error('更新资料失败:', error); // 打印详细错误信息
    // 处理验证错误
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return errorResponse(res, 400, messages.join(', '));
    }
    errorResponse(res, 500, '更新资料失败');
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    // Multer 配置在 uploadMiddleware.js 中处理了文件筛选和大小限制
    // 如果没有文件，可能是 Multer 错误（会被全局错误处理捕获）或者前端没有发送文件
    if (!req.file) {
      return errorResponse(res, 400, '没有文件上传或文件类型不正确。');
    }

    const userId = req.user._id; // 获取用户 ID
    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 404, '用户不存在');
    }

    const oldAvatarPath = user.avatar; // 获取当前用户的旧头像路径

    // 调用头像处理服务
    const avatarPath = await processAvatar(req.file.buffer, userId, oldAvatarPath);

    // 更新数据库中的头像路径
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    );

    successResponse(res, { avatar: updatedUser.avatar }, '头像上传成功');
  } catch (error) {
    console.error('头像上传失败:', error); // 打印详细错误信息
    // 将错误传递给全局错误处理中间件
    // 或者在这里根据错误类型返回更具体的错误信息
    errorResponse(res, 500, '头像上传失败: ' + error.message);
  }
};

// 其他控制器函数保持不变
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

export const certifyUserAsOutstanding = async (req, res) => {
  try {
    const { userId } = req.params;
    const { activityId } = req.body;
    const publisherId = req.user._id; // 当前操作的校组织用户ID

    // 标记用户为优秀
    const user = await User.findByIdAndUpdate(
      userId, 
      { $addToSet: { outstandingActivities: activityId } }, 
      { new: true }
    );

    // 获取活动信息
    const activity = await Activity.findById(activityId);
    
    // 使用现有的通知创建方法发送通知
    await createNotification({
      userId,
      message: `你在活动 "${activity.title}" 中被 ${req.user.username}（${req.user.userType}）认证为优秀！`,
      type: 'outstanding-certification', // 添加通知类型
      relatedActivity: activityId,
      relatedUser: publisherId
    });

    res.status(200).json({ message: '认证成功' });
  } catch (error) {
    res.status(500).json({ message: '认证失败', error: error.message });
  }
};