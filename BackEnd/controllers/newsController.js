import News from '../models/News.js';
import NewsKeywords from '../models/NewsKeywords.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { calculateNewsKeywords } from '../services/keywordService.js';

export const createNews = async (req, res) => {
  try {
    // 验证请求数据
    if (!req.body.title) {
      return res.status(400).json({
        code: 401, // 自定义错误码，表示标题为空
        success: false,
        message: '新闻标题不能为空'
      });
    }

    if (!req.body.content) {
      return res.status(400).json({
        code: 402, // 自定义错误码，表示内容为空
        success: false,
        message: '新闻内容不能为空'
      });
    }

    // 创建新闻
    const newNews = new News({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags,
      publishTime: req.body.publishTime || new Date()
    });
    
    await newNews.save();

    const keywords = calculateNewsKeywords(req.body.title,req.body.content,req.body.category);
    console.log('提取的关键词:', keywords);
    
    await NewsKeywords.create({
      newsId: newNews._id,
      keywords : keywords
    });

    

    res.status(201).json({
      code: 200, // 自定义成功码
      success: true,
      message: '新闻创建成功',
      data: newNews
    });
  } catch (error) {
    console.error('创建新闻错误:', error);
    res.status(500).json({
      code: 500, // 自定义错误码，表示服务器错误
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
};

export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json({
      code: 200, // 自定义成功码
      success: true,
      message: '获取新闻列表成功',
      data: { news }
    });
  } catch (error) {
    console.error('获取新闻列表错误:', error);
    res.status(500).json({
      code: 501, // 自定义错误码，表示获取列表失败
      success: false,
      message: '获取新闻列表失败'
    });
  }
};

export const getLatestNews = async (req, res) => {
  try {
    const count = parseInt(req.params.count);
    const news = await News.find().sort({ createdAt: -1 }).limit(count);
    res.status(200).json({
      code: 200, // 自定义成功码
      success: true,
      message: '获取最新新闻成功',
      data: { news }
    });
  } catch (error) {
    console.error('获取最新新闻错误:', error);
    res.status(500).json({
      code: 502, // 自定义错误码，表示获取最新新闻失败
      success: false,
      message: '获取最新新闻失败'
    });
  }
};