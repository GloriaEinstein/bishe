// BackEnd/controllers/recommendationControllerNew.js
import Activity from '../models/Activity.js';
import News from '../models/News.js';
import ActivityKeywords from '../models/ActivityKeywords.js';
import NewsKeywords from '../models/NewsKeywords.js';
import UserActivity from '../models/UserActivity.js';
import UserNews from '../models/UserNews.js';
import { getUserDataForWordCloud } from './userAnalysisController.js';
import { 
  calculateKeywordSimilarity, 
  calculateUserSimilarity,
  createKeywordVector
} from '../services/wordProcessingService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getIntelligentRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const recommendationCount = 10; // 每个类别推荐数量
    
    // 获取当前用户的关键词
    const { data } = await getUserDataForWordCloud({ params: { userId } });
    const currentUserKeywords = data.keywords;
    
    // 获取所有活动和新闻的关键词
    const allActivityKeywords = await ActivityKeywords.find();
    const allNewsKeywords = await NewsKeywords.find();
    
    // 创建全局词汇表
    const allKeywords = [
      ...currentUserKeywords,
      ...allActivityKeywords.flatMap(ak => ak.keywords),
      ...allNewsKeywords.flatMap(nk => nk.keywords)
    ];
    const vocabulary = [...new Set(allKeywords)];
    
    // 1. 基于内容的推荐 - 活动
    const contentBasedActivityScores = allActivityKeywords.map(activity => {
      const similarity = calculateKeywordSimilarity(currentUserKeywords, activity.keywords);
      return {
        activityId: activity.activityId,
        similarity,
        keywords: activity.keywords
      };
    }).filter(item => item.similarity > 0.1); // 相似度阈值
    
    // 2. 基于内容的推荐 - 新闻
    const contentBasedNewsScores = allNewsKeywords.map(news => {
      const similarity = calculateKeywordSimilarity(currentUserKeywords, news.keywords);
      return {
        newsId: news.newsId,
        similarity,
        keywords: news.keywords
      };
    }).filter(item => item.similarity > 0.1); // 相似度阈值
    
    // 3. 基于用户的协同过滤推荐 - 活动
    // 获取与当前用户交互过相同活动的其他用户
    const similarUsers = await UserActivity.aggregate([
      { $match: { activityId: { $in: (await UserActivity.find({ userId })).map(ua => ua.activityId) } } },
      { $group: { _id: "$userId", activities: { $push: "$activityId" } } },
      { $match: { _id: { $ne: userId } } } // 排除当前用户
    ]);
    
    // 计算相似用户的关键词和相似度
    const userBasedActivityScores = [];
    for (const similarUser of similarUsers) {
      // 获取相似用户的关键词
      const similarUserData = await getUserDataForWordCloud({ params: { userId: similarUser._id } });
      const similarUserKeywords = similarUserData.data.keywords;
      
      // 计算用户相似度
      const userSimilarity = calculateUserSimilarity(
        { keywords: currentUserKeywords },
        { keywords: similarUserKeywords },
        vocabulary
      );
      
      if (userSimilarity > 0.3) { // 用户相似度阈值
        // 获取相似用户喜欢的活动但当前用户未交互过的
        const userActivities = await UserActivity.find({ userId: similarUser._id });
        const userActivityIds = userActivities.map(ua => ua.activityId.toString());
        const currentUserActivityIds = (await UserActivity.find({ userId })).map(ua => ua.activityId.toString());
        
        const newActivities = userActivityIds.filter(id => !currentUserActivityIds.includes(id));
        
        for (const activityId of newActivities) {
          const activityKeywords = allActivityKeywords.find(ak => ak.activityId.toString() === activityId);
          if (activityKeywords) {
            userBasedActivityScores.push({
              activityId,
              similarity: userSimilarity,
              keywords: activityKeywords.keywords
            });
          }
        }
      }
    }
    
    // 4. 基于用户的协同过滤推荐 - 新闻
    // 类似活动的处理逻辑
    const similarNewsUsers = await UserNews.aggregate([
      { $match: { newsId: { $in: (await UserNews.find({ userId })).map(un => un.newsId) } } },
      { $group: { _id: "$userId", news: { $push: "$newsId" } } },
      { $match: { _id: { $ne: userId } } }
    ]);
    
    const userBasedNewsScores = [];
    for (const similarUser of similarNewsUsers) {
      const similarUserData = await getUserDataForWordCloud({ params: { userId: similarUser._id } });
      const similarUserKeywords = similarUserData.data.keywords;
      
      const userSimilarity = calculateUserSimilarity(
        { keywords: currentUserKeywords },
        { keywords: similarUserKeywords },
        vocabulary
      );
      
      if (userSimilarity > 0.3) {
        const userNews = await UserNews.find({ userId: similarUser._id });
        const userNewsIds = userNews.map(un => un.newsId.toString());
        const currentUserNewsIds = (await UserNews.find({ userId })).map(un => un.newsId.toString());
        
        const newNews = userNewsIds.filter(id => !currentUserNewsIds.includes(id));
        
        for (const newsId of newNews) {
          const newsKeywords = allNewsKeywords.find(nk => nk.newsId.toString() === newsId);
          if (newsKeywords) {
            userBasedNewsScores.push({
              newsId,
              similarity: userSimilarity,
              keywords: newsKeywords.keywords
            });
          }
        }
      }
    }
    
    // 5. 合并内容推荐和协同过滤推荐结果
    // 活动推荐合并与排序
    const mergedActivityScores = [...contentBasedActivityScores, ...userBasedActivityScores];
    
    // 去重并计算最终分数（内容相似度权重0.6，用户相似度权重0.4）
    const uniqueActivityScores = mergedActivityScores.reduce((acc, item) => {
      const existing = acc.find(a => a.activityId.toString() === item.activityId.toString());
      if (existing) {
        existing.similarity = (existing.similarity * 0.6) + (item.similarity * 0.4);
      } else {
        acc.push({ ...item, similarity: item.similarity * (contentBasedActivityScores.includes(item) ? 0.6 : 0.4) });
      }
      return acc;
    }, []);
    
    // 新闻推荐合并与排序
    const mergedNewsScores = [...contentBasedNewsScores, ...userBasedNewsScores];
    
    const uniqueNewsScores = mergedNewsScores.reduce((acc, item) => {
      const existing = acc.find(n => n.newsId.toString() === item.newsId.toString());
      if (existing) {
        existing.similarity = (existing.similarity * 0.6) + (item.similarity * 0.4);
      } else {
        acc.push({ ...item, similarity: item.similarity * (contentBasedNewsScores.includes(item) ? 0.6 : 0.4) });
      }
      return acc;
    }, []);
    
    // 6. 获取最终推荐结果
    const topActivities = uniqueActivityScores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, recommendationCount);
      
    const topNews = uniqueNewsScores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, recommendationCount);
    
    // 查询实际活动和新闻数据
    const recommendedActivities = await Activity.find({
      _id: { $in: topActivities.map(a => a.activityId) }
    });
    
    const recommendedNews = await News.find({
      _id: { $in: topNews.map(n => n.newsId) }
    });
    
    successResponse(res, {
      recommendedActivities,
      recommendedNews
    }, '获取智能推荐数据成功');
  } catch (error) {
    console.error('Error in getIntelligentRecommendations:', error);
    errorResponse(res, 500, '获取智能推荐数据失败');
  }
};
