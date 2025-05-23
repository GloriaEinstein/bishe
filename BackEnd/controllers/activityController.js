// bishe10/BackEnd/controllers/activityController.js
import Activity from '../models/Activity.js';
import ActivityKeywords from '../models/ActivityKeywords.js';
import { calculateActivityKeywords } from '../services/keywordService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createActivity = async (req, res) => {
  console.log('Received request body:', req.body); 
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

    // 获取发布活动用户的username
    const username = req.user.username; 
    const name = req.user.name;
    const avatar = req.user.avatar;

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
      endTime,
      username,
      name,
      avatar
    });

    console.log('标题:', title);
    console.log('简介:', introduction);
    console.log('内容:', content);

    // 计算活动的关键词
    const keywords = calculateActivityKeywords(title, introduction, content);

    // 保存关键词到新模型中
    await ActivityKeywords.create({
      activityId: activity._id,
      keywords
    });

    successResponse(res, { activity }, '活动发布成功');
  } catch (error) {
    console.error('Error creating activity:', error); 
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

export const getLatestActivities = async (req, res) => {
  try {
    const count = parseInt(req.params.count)
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(count)
    successResponse(res, { activities }, '获取最新活动成功')
  } catch (error) {
    errorResponse(res, 500, '获取最新活动失败')
  }
}

export const getActivityDetail = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId)
      // 新增：populate 报名用户的 name, username, college 字段
      .populate('registeredUsers', 'name username college'); 
      
    if (!activity) {
      return errorResponse(res, 404, '活动未找到');
    }
    
    successResponse(res, { activity }, '获取活动详情成功');
  } catch (error) {
    errorResponse(res, 500, '获取活动详情失败');
  }
};

export const getRegisteredUsers = async (req, res) => {
  try {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId)
      // 新增：populate 报名用户的 name, username, college 字段
      .populate('registeredUsers', 'name username college'); 
    if (!activity) {
      return errorResponse(res, 404, '活动未找到');
    }
    successResponse(res, { registeredUsers: activity.registeredUsers }, '获取已报名人员列表成功');
  } catch (error) {
    errorResponse(res, 500, '获取已报名人员列表失败');
  }
};

export const getActivityKeywords = async (req, res) => {
  try {
    const activityKeywords = await ActivityKeywords.find();
    console.log('活动关键词:', ActivityKeywords); // 记录详细的关键词信息
    
    successResponse(res, { activityKeywords }, '获取活动关键词成功');
  } catch (error) {
    console.error('获取活动关键词失败:', error); // 记录详细错误信息
    errorResponse(res, 500, '获取活动关键词失败');
  }
};


