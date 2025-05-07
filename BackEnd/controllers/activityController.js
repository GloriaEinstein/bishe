// bishe8/BackEnd/controllers/activityController.js
import Activity from '../models/Activity.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createActivity = async (req, res) => {
  try {
    const { title, content } = req.body;
    const activity = await Activity.create({ title, content });
    successResponse(res, { activity }, '活动发布成功');
  } catch (error) {
    errorResponse(res, 500, '活动发布失败');
  }
};

export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    successResponse(res, { activities }, '获取活动列表成功');
  } catch (error) {
    errorResponse(res, 500, '获取活动列表失败');
  }
};
