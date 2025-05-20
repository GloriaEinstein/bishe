// BackEnd/services/wordProcessingService.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stopwords = require('stopwords-zh/stopwords-zh.json');
import jieba from 'nodejieba';

// 修改导入方式以兼容 CommonJS 模块
const natural = require('natural');
const { TfIdf } = natural;

// 引入词性标注
jieba.load({
  dict: jieba.DEFAULT_DICT,
  hmmDict: jieba.DEFAULT_HMM_DICT,
  userDict: jieba.DEFAULT_USER_DICT,
  idfDict: jieba.DEFAULT_IDF_DICT,
  stopWordDict: jieba.DEFAULT_STOP_WORD_DICT
});

export const preprocessText = (text) => {
  if (!text || text.trim() === '') return [];
  
  // 使用 jieba 分词
  const words = jieba.cut(text);
  
  // 过滤停用词、空白字符和特定词性的词
  return words
    .filter(word => word.trim() !== '')
    .filter(word => !stopwords.includes(word))
    .filter((word) => {
      const pos = jieba.tag(word)[0].tag;
      // 只保留名词、动词、形容词
      return ['n', 'v', 'a'].includes(pos[0]); 
    });
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
