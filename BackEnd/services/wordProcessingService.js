// BackEnd/services/wordProcessingService.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stopwords = require('stopwords-zh/stopwords-zh.json');
import jieba from 'nodejieba';
import natural from 'natural'; 
import { stripHtml } from 'string-strip-html';


// 引入词性标注
jieba.load({
  dict: jieba.DEFAULT_DICT,
  hmmDict: jieba.DEFAULT_HMM_DICT,
  userDict: jieba.DEFAULT_USER_DICT,
  idfDict: jieba.DEFAULT_IDF_DICT,
  stopWordDict: jieba.DEFAULT_STOP_WORD_DICT
});

function removeDuplicates(text) {
  const paragraphs = text.split('\n');
  const uniqueParagraphs = [];
  
  paragraphs.forEach(paragraph => {
    if (paragraph.trim() !== '' && 
        !uniqueParagraphs.some(p => p.trim() === paragraph.trim())) {
      uniqueParagraphs.push(paragraph);
    }
  });
  
  return uniqueParagraphs.join('\n');
}
// 1. 文本预处理：分词 + 去除停用词 + 过滤无效字符
export const preprocessText = (text) => {
  console.log('原始文本:', text);
  
  if (!text || typeof text !== 'string') {
    console.log('警告：文本为空或非字符串类型');
    return [];
  }
  
  // 1. 去除HTML标签
  const cleanText = stripHtml(text).result;
  
  // 2. 去除特殊符号
  let processedText = cleanText
    .replace(/【.*?】/g, '') // 去除【】及其内容
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ') // 替换特殊符号为空格
    .replace(/\s+/g, ' ') // 合并连续空格
    .trim();
  
  // 3. 去除重复内容
  processedText = removeDuplicates(processedText);
  
  console.log('处理后的文本:', processedText);
  
  // 4. 分词
  const words = jieba.cut(processedText);
  console.log('分词结果（原始）:', words);
  
  // 5. 过滤规则：保留长度≥2的中文、字母和数字组合
  const filteredWords = words.filter(word => {
    const isValid = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,}$/.test(word);
    return isValid;
  });
  
  console.log('分词结果（过滤后）:', filteredWords);
  return filteredWords;
};

export const extractKeywords = (texts, topN = 20) => {
  if (!texts || texts.length === 0) return [];
  
  const tfidf = new TfIdf();
  texts.forEach(text => {
    tfidf.addDocument(text);
  });

  const allKeywords = [];
  texts.forEach((_, index) => {
    const keywords = tfidf.listTerms(index);
    allKeywords.push(...keywords);
  });

  // 按 TF-IDF 值排序
  allKeywords.sort((a, b) => b.tfidf - a.tfidf);

  // 取前 topN 个关键词
  const topKeywords = allKeywords.slice(0, topN);
  
  return topKeywords.map(item => item.term);
};

// 2. 基于 TF-IDF 提取关键词（单文本场景）
export const extractKeywordsFromSingleText = (text) => {
  if (!text) return [];
  
  // 使用TF-IDF提取关键词
  const TfIdf = natural.TfIdf; // 获取 TfIdf 类
  const tfidfInstance = new TfIdf();
  tfidfInstance.addDocument(text);
  
  const terms = [];
  tfidfInstance.listTerms(0).forEach(item => {
    terms.push({ term: item.term, tfidf: item.tfidf });
  });
  
  // 按TF-IDF值排序并返回前10个关键词
  return terms
    .sort((a, b) => b.tfidf - a.tfidf)
    .slice(0, 10)
    .map(item => item.term);
};