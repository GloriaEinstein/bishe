import Comment from '../models/Comment.js';
import User from '../models/User.js'; // 根据你的项目结构调整路径

export const getComments = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    
    // 查询活动对应的所有评论
    const comments = await Comment.find({ activity: activityId });
    
    // 提取所有评论中的用户ID并去重
    const userIds = [...new Set(comments.map(comment => comment.user))];
    
    // 批量查询所有相关用户的完整信息
    const users = await User.find({ _id: { $in: userIds } });
    
    // 将用户信息映射为 ID 到用户对象的字典
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});
    
    // 为每条评论添加完整的用户信息
    const commentsWithUserInfo = comments.map(comment => ({
      ...comment.toObject(),
      user: userMap[comment.user.toString()] || null
    }));
    
    // 包装为包含 comments 字段的对象
    const responseData = {
      comments: commentsWithUserInfo,
      // 可以添加其他元数据字段（如分页信息）
      // pagination: { total: commentsWithUserInfo.length }
    };

    res.status(200).json({ 
      code: 200,
      success: true,
      message: '评论获取成功',
      data: responseData  // 将数组包装在对象中
    });
    
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ 
      code: 500,
      success: false,
      message: '获取评论失败',
      error: error.message 
    });
  }
};


export const postComment = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const { content } = req.body;
    const userId = req.user._id;
    const comment = new Comment({
      activity: activityId,
      user: userId,
      content
    });
    await comment.save();
    // 重新查询并填充用户信息
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name avatar');
    res.status(201).json({ comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: '发表评论失败', error });
  }
};

export const reportComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findByIdAndUpdate(commentId, { isReported: true }, { new: true });
    res.status(200).json({ message: '举报成功', comment });
  } catch (error) {
    res.status(500).json({ message: '举报评论失败', error });
  }
};
