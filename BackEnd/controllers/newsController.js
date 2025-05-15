// bishe8/BackEnd/controllers/newsController.js
import News from '../models/News.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = await News.create({ title, content });
    successResponse(res, { news }, '新闻发布成功');
  } catch (error) {
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
    const count = parseInt(req.params.count)
    const news = await News.find().sort({ createdAt: -1 }).limit(count)
    successResponse(res, { news }, '获取最新新闻成功')
  } catch (error) {
    errorResponse(res, 500, '获取最新新闻失败')
  }
}
