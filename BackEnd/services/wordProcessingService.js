// BackEnd/services/wordProcessingService.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stopwords = require('stopwords-zh/stopwords-zh.json');
import jieba from 'nodejieba';

export const preprocessText = (text) => {
  if (!text || text.trim() === '') return [];
  
  // 使用 jieba 分词
  const words = jieba.cut(text);
  
  // 过滤停用词并去除空白字符
  return words
    .filter(word => word.trim() !== '')
    .filter(word => !stopwords.includes(word));
};

export const extractKeywords = (text) => {
  if (!text || text.trim() === '') return [];
  
  // 使用 jieba 提取关键词
  const keywords = jieba.extract(text, 20); // 提取前20个关键词
  
  return keywords.map(item => item.word);
};    