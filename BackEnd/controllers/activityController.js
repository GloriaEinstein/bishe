import Activity from '../models/Activity.js';
import ActivityKeywords from '../models/ActivityKeywords.js';
import { calculateActivityKeywords } from '../services/keywordService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createRejectionNotification } from './notificationController.js'; 


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

    const keywords = calculateActivityKeywords(title, introduction, content);

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
    const filter = { isPass: true, never: false }; 

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
    const count = parseInt(req.params.count);
    const activities = await Activity.find({ isPass: true, never: false }).sort({ createdAt: -1 }).limit(count);
    successResponse(res, { activities }, '获取最新活动成功');
  } catch (error) {
    errorResponse(res, 500, '获取最新活动失败');
  }
};

export const getActivityDetail = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId)
      .populate('registeredUsers', 'name username college'); 
    
    if (!activity ||!activity.isPass || activity.never) {
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
      .populate('registeredUsers', 'name username college'); 
    if (!activity ||!activity.isPass || activity.never) {
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
    console.log('活动关键词:', ActivityKeywords); 
    
    successResponse(res, { activityKeywords }, '获取活动关键词成功');
  } catch (error) {
    console.error('获取活动关键词失败:', error); 
    errorResponse(res, 500, '获取活动关键词失败');
  }
};

export const getPendingActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ isPass: false, never: false }); // 直接获取数组
    successResponse(res, { activities }, '获取待审核活动列表成功');
  } catch (error) {
    console.error('Error fetching pending activities:', error); // 建议添加错误日志
    errorResponse(res, 500, '获取待审核活动列表失败');
  }
};

export const approveActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const activity = await Activity.findByIdAndUpdate(
      activityId,
      { isPass: true },
      { new: true }
    );
    if (!activity) {
      return errorResponse(res, 404, '活动未找到');
    }
    successResponse(res, { activity }, '活动审核通过');
  } catch (error) {
    errorResponse(res, 500, '审核活动失败');
  }
};

export const rejectActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const activity = await Activity.findByIdAndUpdate(
      activityId,
      { never: true },
      { new: true }
    );
    if (!activity) {
      return errorResponse(res, 404, '活动未找到');
    }
    await createRejectionNotification(activity.username); // 使用正确的函数名
    successResponse(res, { activity }, '活动审核拒绝');
  } catch (error) {
    errorResponse(res, 500, '审核活动失败');
  }
};

export const getPublishedActivities = async (req, res) => {
  try {
    // 直接从查询参数获取username
    const { username } = req.query;
    
    // 使用username查询活动
    const activities = await Activity.find({ username });
    successResponse(res, { activities }, '获取活动关键词成功');
  } catch (error) {
    res.status(500).json({ message: '获取活动列表失败', error: error.message });
  }
};
