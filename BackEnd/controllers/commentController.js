import Comment from '../models/Comment.js';

export const getComments = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const comments = await Comment.find({ activity: activityId }).populate('user', 'name avatar');
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: '获取评论失败', error });
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
