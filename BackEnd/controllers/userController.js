// server/controllers/userController.js
import User from '../models/User.js';
import Activity from '../models/Activity.js'; // 导入 Activity 模型
import { successResponse, errorResponse } from '../utils/response.js';
import { processAvatar } from '../services/upload.js';
import { createNotification } from './notificationController.js';

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // 从URL参数中获取用户ID

    // 查找用户，可以根据需要选择返回的字段，这里选择不返回密码
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return errorResponse(res, 404, '用户未找到');
    }

    successResponse(res, { user }, '获取用户详细信息成功');
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    errorResponse(res, 500, '获取用户详细信息失败');
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return errorResponse(res, 404, '用户不存在');
    }
    successResponse(res, { user }, '获取用户信息成功');
  } catch (error) {
    console.error('获取用户信息失败:', error);
    errorResponse(res, 500, '获取用户信息失败');
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, password, userType, createdAt, isVerified, ...updateData } = req.body;
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
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return errorResponse(res, 404, '用户不存在');
    }
    successResponse(res, { user }, '更新资料成功');
  } catch (error) {
    console.error('更新资料失败:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return errorResponse(res, 400, messages.join(', '));
    }
    errorResponse(res, 500, '更新资料失败');
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, '没有文件上传或文件类型不正确。');
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 404, '用户不存在');
    }

    const oldAvatarPath = user.avatar;

    const avatarPath = await processAvatar(req.file.buffer, userId, oldAvatarPath);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    );

    successResponse(res, { avatar: updatedUser.avatar }, '头像上传成功');
  } catch (error) {
    console.error('头像上传失败:', error);
    errorResponse(res, 500, '头像上传失败: ' + error.message);
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

// !!! 修改 certifyUserAsOutstanding 函数，使其处理批量认证和取消认证 !!!
export const certifyUserAsOutstanding = async (req, res) => {
  try {
    const { activityId } = req.params; // 现在 activityId 从 params 获取
    const { userIds } = req.body; // 期望接收一个用户ID数组，表示本次要认证的用户
    const currentUserUsername = req.user.username; // 当前操作的校组织用户的 username

    if (!Array.isArray(userIds)) {
      return errorResponse(res, 400, '请提供要认证的用户ID列表 (数组)');
    }

    const activity = await Activity.findById(activityId);

    if (!activity) {
      return errorResponse(res, 404, '活动未找到');
    }

    // 权限校验：确保只有该活动的发布者才能进行认证操作
    if (activity.username !== currentUserUsername) {
       return errorResponse(res, 403, '无权认证此活动的参与用户');
    }

    // 获取所有已报名该活动的用户
    const registeredUserIds = activity.registeredUsers.map(id => id.toString());

    // 遍历所有已报名用户，决定是添加还是移除 outstandingActivities
    for (const registeredUserId of registeredUserIds) {
      const user = await User.findById(registeredUserId);
      if (!user) continue; // 如果用户不存在则跳过

      const isUserSelectedToCertify = userIds.includes(registeredUserId.toString());
      const isUserCurrentlyOutstandingForActivity = user.outstandingActivities.some(
        oaid => oaid.toString() === activityId.toString()
      );

      if (isUserSelectedToCertify && !isUserCurrentlyOutstandingForActivity) {
        // 用户被选中且目前未被认证 -> 添加认证
        await User.findByIdAndUpdate(
          registeredUserId,
          { $addToSet: { outstandingActivities: activityId } }, // $addToSet 确保不重复添加
          { new: true }
        );
        // 发送认证通知
        await createNotification({
          userId: registeredUserId,
          message: `你在活动 "${activity.title}" 中被 ${req.user.name}（${req.user.userType}）认证为优秀！`,
          type: 'outstanding-certification',
          relatedActivity: activityId,
          relatedUser: req.user._id // 发布者用户ID
        });
      } else if (!isUserSelectedToCertify && isUserCurrentlyOutstandingForActivity) {
        // 用户未被选中但目前已被认证 -> 取消认证
        await User.findByIdAndUpdate(
          registeredUserId,
          { $pull: { outstandingActivities: activityId } },
          { new: true }
        );
        // 发送取消认证通知 (可选，根据需求决定是否发送)
        await createNotification({
          userId: registeredUserId,
          message: `你在活动 "${activity.title}" 中的优秀认证被 ${req.user.name}（${req.user.userType}）取消。`,
          type: 'certification-revoked',
          relatedActivity: activityId,
          relatedUser: req.user._id
        });
      }
    }

    successResponse(res, {}, '用户优秀状态更新成功');
  } catch (error) {
    console.error('更新用户优秀状态失败:', error);
    errorResponse(res, 500, '更新用户优秀状态失败');
  }
};

// 新增接口：获取某个活动下已报名用户的优秀认证状态 (用于弹窗数据)
export const getOutstandingUsersForActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId)
      .populate('registeredUsers', 'name username college outstandingActivities'); // 填充 registeredUsers 并带出 outstandingActivities

    if (!activity || !activity.isPass || activity.never) {
      return errorResponse(res, 404, '活动未找到');
    }

    // 构建一个包含每个用户是否在该活动中被认证为优秀的状态列表
    const usersWithCertificationStatus = activity.registeredUsers.map(user => {
      const isCertified = user.outstandingActivities.some(
        oaid => oaid.toString() === activityId.toString()
      );
      return {
        _id: user._id,
        name: user.name,
        username: user.username,
        college: user.college,
        isCertified: isCertified,
      };
    });

    successResponse(res, { registeredUsers: usersWithCertificationStatus }, '获取已报名用户及其优秀认证状态成功');
  } catch (error) {
    console.error('获取已报名用户及其优秀认证状态失败:', error);
    errorResponse(res, 500, '获取已报名用户及其优秀认证状态失败');
  }
};