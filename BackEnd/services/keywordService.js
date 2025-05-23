// bishe44/BackEnd/services/keywordService/keywordService.js
import { preprocessText, extractKeywordsFromSingleText } from '../services/wordProcessingService.js';

export const calculateActivityKeywords = (title, introduction, content) => {
  const allText = `${title} ${introduction} ${content}`;
  
  const preprocessedWords = preprocessText(allText);
  
  if (preprocessedWords.length === 0) {
    // 如果分词结果为空，使用标题中的词汇作为关键词
    const titleWords = jieba.cut(title).filter(word => word.trim() !== '' && word.length > 1);
    return titleWords.length > 0 ? titleWords.slice(0, 5) : ['活动']; // 默认关键词
  }
  
  const preprocessedText = preprocessedWords.join(' ');
  const keywords = extractKeywordsFromSingleText(preprocessedText);
  
  // 如果提取的关键词为空，使用分词结果的前5个词
  return keywords.length > 0 ? keywords : preprocessedWords.slice(0, 5);
};

export const calculateNewsKeywords = (title, category, content) => {
  const allText = `${title} ${content} ${category}`;
  
  const preprocessedWords = preprocessText(allText);
  
  if (preprocessedWords.length === 0) {
    // 如果分词结果为空，使用标题中的词汇作为关键词
    const titleWords = jieba.cut(title).filter(word => word.trim() !== '' && word.length > 1);
    return titleWords.length > 0 ? titleWords.slice(0, 5) : ['新闻']; // 默认关键词
  }
  
  const preprocessedText = preprocessedWords.join(' ');
  const keywords = extractKeywordsFromSingleText(preprocessedText);
  
  // 如果提取的关键词为空，使用分词结果的前5个词
  return keywords.length > 0 ? keywords : preprocessedWords.slice(0, 5);
};

