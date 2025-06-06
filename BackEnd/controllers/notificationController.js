// bishe4/BackEnd/controllers/notificationController.js
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createNotification = async ({
  userId,
  message,
  type = 'general',
  relatedActivity = null,
  relatedUser = null
}) => {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
      relatedActivity,
      relatedUser,
      read: false,
      createdAt: new Date()
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    throw new Error(`创建通知失败: ${error.message}`);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    successResponse(res, { notifications }, '获取通知列表成功');
  } catch (error) {
    errorResponse(res, 500, '获取通知列表失败');
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return errorResponse(res, 404, '通知未找到');
    }
    successResponse(res, { notification }, '通知标记为已读成功');
  } catch (error) {
    errorResponse(res, 500, '标记通知为已读失败');
  }
};

export const sendWarning = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const warningNotification = await Notification.create({ 
      title: '警告通知',
      content,
      userId
    });
    successResponse(res, { warningNotification }, '警告消息发送成功');
  } catch (error) {
    errorResponse(res, 500, '警告消息发送失败');
  }
};

export const createRejectionNotification = async (username) => {
  try {
    // 创建一条拒绝通知
    await Notification.create({
      recipient: username,
      content: '你发布的活动未通过审核',
      type: 'rejection',
      createdAt: new Date()
    });
    // 这里可以添加发送邮件或其他通知方式的逻辑
    return true;
  } catch (error) {
    console.error('创建拒绝通知失败:', error);
    return false;
  }
};
