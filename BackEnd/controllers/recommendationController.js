import Activity from '../models/Activity.js';
import News from '../models/News.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { preprocessText, extractKeywords } from '../services/wordProcessingService.js';

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id; // 假设用户信息已在中间件中处理

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
    const userKeywords = extractKeywords(preprocessedText);

    // 计算活动和新闻的相似度
    const allActivities = await Activity.find();
    const allNews = await News.find();

    const recommendedActivities = allActivities.filter(activity => {
      const activityText = activity.title + ' ' + activity.serviceType + ' ' + activity.content;
      const activityKeywords = extractKeywords(preprocessText(activityText).join(' '));
      const similarity = calculateSimilarity(userKeywords, activityKeywords);
      return similarity > 0.2; // 相似度阈值
    });

    const recommendedNews = allNews.filter(news => {
      const newsText = news.title + ' ' + news.content;
      const newsKeywords = extractKeywords(preprocessText(newsText).join(' '));
      const similarity = calculateSimilarity(userKeywords, newsKeywords);
      return similarity > 0.2; // 相似度阈值
    });

    res.status(200).json({
      code: 200,
      success: true,
      message: '获取推荐数据成功',
      data: {
        recommendedActivities,
        recommendedNews
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

// 计算两个关键词列表的相似度
const calculateSimilarity = (keywords1, keywords2) => {
  const intersection = keywords1.filter(keyword => keywords2.includes(keyword));
  return intersection.length / (keywords1.length + keywords2.length - intersection.length);
};
