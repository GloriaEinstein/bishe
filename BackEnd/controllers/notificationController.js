// bishe4/BackEnd/controllers/notificationController.js
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createNotification = async (req, res) => {
  try {
    const { title, content } = req.body;
    const notification = await Notification.create({ title, content });
    successResponse(res, { notification }, '通知发布成功');
  } catch (error) {
    errorResponse(res, 500, '通知发布失败');
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
