// bishe8/BackEnd/controllers/announcementController.js
import Announcement from '../models/Announcement.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const announcement = await Announcement.create({ title, content });
    successResponse(res, { announcement }, '公告发布成功');
  } catch (error) {
    errorResponse(res, 500, '公告发布失败');
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    successResponse(res, { announcements }, '获取公告列表成功');
  } catch (error) {
    errorResponse(res, 500, '获取公告列表失败');
  }
};
