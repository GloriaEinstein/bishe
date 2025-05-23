// BackEnd/controllers/recommendationController.js
import Activity from '../models/Activity.js';
import News from '../models/News.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { 
  preprocessText, 
  extractKeywordsFromSingleText,
  calculateKeywordSimilarity 
} from '../services/wordProcessingService.js';

// 计算用户相似度（协同过滤）
const calculateUserSimilarity = async (currentUserId) => {
  try {
    // 获取当前用户的关键词
    const currentUser = await User.findById(currentUserId);
    const currentUserActivities = await Activity.find({ registeredUsers: currentUserId });
    const currentUserComments = await Comment.find({ user: currentUserId, isReported: false });
    
    const currentUserInfoText = `${currentUser.name} ${currentUser.college} ${currentUser.major}`;
    const currentUserActivityText = currentUserActivities.map(activity => activity.title + ' ' + activity.serviceType).join(' ');
    const currentUserCommentText = currentUserComments.map(comment => comment.content).join(' ');
    const currentUserAllText = currentUserInfoText + ' ' + currentUserActivityText + ' ' + currentUserCommentText;
    const currentUserKeywords = extractKeywordsFromSingleText(currentUserAllText);
    
    // 获取所有用户
    const allUsers = await User.find({ _id: { $ne: currentUserId } });
    
    // 计算每个用户与当前用户的相似度
    const userSimilarities = [];
    
    for (const user of allUsers) {
      const userActivities = await Activity.find({ registeredUsers: user._id });
      const userComments = await Comment.find({ user: user._id, isReported: false });
      
      const userInfoText = `${user.name} ${user.college} ${user.major}`;
      const userActivityText = userActivities.map(activity => activity.title + ' ' + activity.serviceType).join(' ');
      const userCommentText = userComments.map(comment => comment.content).join(' ');
      const userAllText = userInfoText + ' ' + userActivityText + ' ' + userCommentText;
      const userKeywords = extractKeywordsFromSingleText(userAllText);
      
      const similarity = calculateKeywordSimilarity(currentUserKeywords, userKeywords);
      
      userSimilarities.push({
        userId: user._id,
        similarity: similarity
      });
    }
    
    // 按相似度排序
    userSimilarities.sort((a, b) => b.similarity - a.similarity);
    
    return userSimilarities;
  } catch (error) {
    console.error('Error calculating user similarity:', error);
    return [];
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id; // 假设用户信息已在中间件中处理
    
    // 基于内容的推荐
    // 获取用户的相关信息
    const user = await User.findById(userId);
    const registeredActivities = await Activity.find({ registeredUsers: userId });
    const comments = await Comment.find({ user: userId, isReported: false });
    
    // 提取用户的特征
    const userInfoText = `${user.name} ${user.college} ${user.major}`;
    const activityText = registeredActivities.map(activity => activity.title + ' ' + activity.serviceType).join(' ');
    const commentText = comments.map(comment => comment.content).join(' ');
    const allText = userInfoText + ' ' + activityText + ' ' + commentText;
    const preprocessedWords = preprocessText(allText);
    const preprocessedText = preprocessedWords.join(' ');
    const userKeywords = extractKeywordsFromSingleText(preprocessedText);
    
    // 计算活动和新闻的相似度
    const allActivities = await Activity.find();
    const allNews = await News.find();
    
    // 基于内容的活动推荐
    const contentBasedActivities = allActivities
      .map(activity => {
        const activityText = activity.title + ' ' + activity.serviceType + ' ' + activity.content;
        const activityKeywords = extractKeywordsFromSingleText(activityText);
        const similarity = calculateKeywordSimilarity(userKeywords, activityKeywords);
        return { activity, similarity };
      })
      .filter(item => item.similarity > 0.1) // 相似度阈值
      .sort((a, b) => b.similarity - a.similarity)
      .map(item => item.activity);
    
    // 基于内容的新闻推荐
    const contentBasedNews = allNews
      .map(news => {
        const newsText = news.title + ' ' + news.content;
        const newsKeywords = extractKeywordsFromSingleText(newsText);
        const similarity = calculateKeywordSimilarity(userKeywords, newsKeywords);
        return { news, similarity };
      })
      .filter(item => item.similarity > 0.1) // 相似度阈值
      .sort((a, b) => b.similarity - a.similarity)
      .map(item => item.news);
    
    // 基于协同过滤的推荐
    const similarUsers = await calculateUserSimilarity(userId);
    const topSimilarUsers = similarUsers.slice(0, 5); // 取最相似的5个用户
    
    // 收集相似用户参与的活动
    const collaborativeActivities = [];
    for (const similarUser of topSimilarUsers) {
      const userActivities = await Activity.find({ 
        registeredUsers: similarUser.userId,
        _id: { $nin: registeredActivities.map(a => a._id) } // 排除当前用户已参与的活动
      });
      collaborativeActivities.push(...userActivities);
    }
    
    // 去重
    const uniqueCollaborativeActivities = [...new Map(collaborativeActivities.map(item => [item._id, item])).values()];
    
    // 组合基于内容和协同过滤的推荐结果
    const recommendedActivities = [...contentBasedActivities];
    
    // 添加协同过滤推荐的活动，但避免重复
    for (const activity of uniqueCollaborativeActivities) {
      if (!recommendedActivities.some(a => a._id.equals(activity._id))) {
        recommendedActivities.push(activity);
      }
    }
    
    // 返回结果（限制数量）
    res.status(200).json({
      code: 200,
      success: true,
      message: '获取推荐数据成功',
      data: {
        recommendedActivities: recommendedActivities.slice(0, 10),
        recommendedNews: contentBasedNews.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({
      code: 500,
      success: false,
      message: '获取推荐数据失败',
      error: error.message
    });
  }
};    