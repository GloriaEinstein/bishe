// BackEnd/controllers/userAnalysisController.js
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

export const getUserDataForWordCloud = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Processing user ID:', userId);

    // 获取用户个人资料信息
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        code: 404,
        success: false,
        message: '用户不存在',
        data: null 
      });
    }
    const userInfoText = `${user.name} ${user.college} ${user.major}`;
    console.log('User found:', user.name);

    // 获取用户报名的活动信息
    const registeredActivities = await Activity.find({ registeredUsers: userId });
    const activityText = registeredActivities.map(activity => 
      activity.title + ' ' + activity.serviceType
    ).join(' ');
    console.log('Activities found:', registeredActivities.length);

    // 获取用户在活动下的留言信息（使用新的字段名 `user`）
    const comments = await Comment.find({ user: userId, isReported: false });
    console.log('Comments found:', comments.length);

    if (comments.length === 0) {
      console.warn('No comments found for user:', userId);
    }

    const commentText = comments.map(comment => comment.content).join(' ');

    const allText = userInfoText + ' ' + activityText + ' ' + commentText;

    res.status(200).json({ 
      code: 200,
      success: true,
      message: '获取数据成功',
      data: { 
        text: allText,
        commentCount: comments.length 
      } 
    });
  } catch (error) {
    console.error('Error in getUserDataForWordCloud:', error);
    res.status(500).json({ 
      code: 500,
      success: false,
      message: '获取数据失败',
      error: error.message 
    });
  }
};
