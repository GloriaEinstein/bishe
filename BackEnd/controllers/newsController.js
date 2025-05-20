import News from '../models/News.js';

export const createNews = async (req, res) => {
  try {
    // 验证请求数据
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: '新闻标题不能为空'
      });
    }
    
    if (!req.body.content) {
      return res.status(400).json({
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
    
    res.status(201).json({
      success: true,
      message: '新闻创建成功',
      data: newNews
    });
  } catch (error) {
    console.error('创建新闻错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
};

export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: '获取新闻列表成功',
      data: { news }
    });
  } catch (error) {
    console.error('获取新闻列表错误:', error);
    res.status(500).json({
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
      success: true,
      message: '获取最新新闻成功',
      data: { news }
    });
  } catch (error) {
    console.error('获取最新新闻错误:', error);
    res.status(500).json({
      success: false,
      message: '获取最新新闻失败'
    });
  }
};
