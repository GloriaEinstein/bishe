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
      projectStatus, 
      serviceTarget, 
      participantCount,
      startTime,
      endTime
    } = req.body;
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
    successResponse(res, { activities }, '获取活动列表成功');
  } catch (error) {
    errorResponse(res, 500, '获取活动列表失败');
  }
};
