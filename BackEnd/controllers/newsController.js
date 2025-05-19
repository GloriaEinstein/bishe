// bishe8/BackEnd/controllers/newsController.js
import News from '../models/News.js';
import { successResponse, errorResponse } from '../utils/response.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createNews = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    let coverImage = '';
    
    if (req.file) {
      // 构建可访问的URL路径
      coverImage = `/uploads/${req.file.filename}`;
    }
    
    const news = await News.create({ 
      title, 
      content, 
      coverImage, 
      category, 
      tags,
      createdAt: new Date()
    });
    
    successResponse(res, { news }, '新闻发布成功');
  } catch (error) {
    console.error('Error creating news:', error);
    errorResponse(res, 500, '新闻发布失败');
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