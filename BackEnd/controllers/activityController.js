// bishe10/BackEnd/controllers/activityController.js
import Activity from '../models/Activity.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createActivity = async (req, res) => {
  console.log('Received request body:', req.body); // 添加日志
  try {
    const { 
      title, 
      introduction, 
      content, 
      activityArea, 
      serviceType, 
      serviceTarget, 
      participantCount,
      startTime,
      endTime
    } = req.body;
    let projectStatus;
    const now = new Date();
    if (new Date(startTime) > now) {
      projectStatus = '待启动';
    } else if (new Date(endTime) < now) {
      projectStatus = '已结项';
    } else {
      projectStatus = '运行中';
    }
    const activity = await Activity.create({ 
      title, 
      introduction, 
      content, 
      activityArea, 
      serviceType, 
      projectStatus, 
      serviceTarget, 
      participantCount,
      startTime,
      endTime
    });
    successResponse(res, { activity }, '活动发布成功');
  } catch (error) {
    console.error('Error creating activity:', error); // 添加错误日志
    errorResponse(res, 500, '活动发布失败');
  }
};

export const registerActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { userId } = req.body;
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return errorResponse(res, 404, '活动未找到');
    }
    if (activity.registeredUsers.includes(userId)) {
      return errorResponse(res, 400, '你已经报名该活动');
    }
    activity.registeredUsers.push(userId);
    await activity.save();
    successResponse(res, { activity }, '报名成功');
  } catch (error) {
    errorResponse(res, 500, '报名失败');
  }
};


export const getActivities = async (req, res) => {
  try {
    const { area, serviceType, projectStatus, serviceTarget, participantCount } = req.query;
    const filter = {};

    if (area) filter.area = area;
    if (serviceType) filter.serviceType = serviceType;
    if (projectStatus && projectStatus!== '全部') filter.projectStatus = projectStatus;
    if (serviceTarget) filter.serviceTarget = serviceTarget;
    if (participantCount) {
      const [min, max] = participantCount.split('-').map(Number);
      if (max) {
        filter.participantCount = { $gte: min, $lte: max };
      } else if (participantCount === '0') {
        filter.participantCount = 0;
      } else {
        filter.participantCount = { $gte: min };
      }
    }

    const activities = await Activity.find(filter).sort({ createdAt: -1 });
    const now = new Date();
    activities.forEach(activity => {
      if (new Date(activity.startTime) > now) {
        activity.projectStatus = '待启动';
      } else if (new Date(activity.endTime) < now) {
        activity.projectStatus = '已结项';
      } else {
        activity.projectStatus = '运行中';
      }
      activity.save();
    });
    successResponse(res, { activities }, '获取活动列表成功');
  } catch (error) {
    errorResponse(res, 500, '获取活动列表失败');
  }
};
