// bishe8/BackEnd/controllers/newsController.js
import News from '../models/News.js';
import { successResponse, errorResponse } from '../utils/response.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createNews = async (req, res) => {
  try {
    // 检查是否有上传文件
    if (!req.file) {
      return res.status(400).json({ 
        code: 400, 
        success: false, 
        message: '请上传封面图片' 
      });
    }
    
    // 构建新闻数据
    const newsData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags,
      publishTime: req.body.publishTime || new Date(),
      // 构建文件URL，假设public目录是静态资源目录
      coverImage: `/uploads/news/${req.file.filename}`
    };
    
    // 创建新闻
    const newNews = new News(newsData);
    await newNews.save();
    
    res.status(201).json({ 
      code: 200, 
      success: true, 
      message: '新闻创建成功',
      data: {
        id: newNews._id,
        ...newsData
      } 
    });
  } catch (error) {
    console.error('创建新闻错误:', error);
    
    // 如果发生错误，删除已上传的文件
    if (req.file) {
      const filePath = path.join(__dirname, '../../public/uploads/news', req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('删除上传文件失败:', err);
      });
    }
    
    res.status(500).json({ 
      code: 500, 
      success: false, 
      message: '服务器错误，请稍后重试' 
    });
  }
};

export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    successResponse(res, { news }, '获取新闻列表成功');
  } catch (error) {
    errorResponse(res, 500, '获取新闻列表失败');
  }
};

export const getLatestNews = async (req, res) => {
  try {
    const count = parseInt(req.params.count);
    const news = await News.find().sort({ createdAt: -1 }).limit(count);
    successResponse(res, { news }, '获取最新新闻成功');
  } catch (error) {
    errorResponse(res, 500, '获取最新新闻失败');
  }
};  