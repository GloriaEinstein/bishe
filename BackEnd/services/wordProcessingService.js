// BackEnd/services/wordProcessingService.js
const nodejieba = require('nodejieba');
const stopwords = require('stopwords-zh'); // 中文停用词库

// 加载自定义词典（可选）
nodejieba.load({
  dict: nodejieba.DEFAULT_DICT,
  userDict: './path/to/user.dict.utf8' // 自定义词典路径
});

// 定义需要保留的词性列表（名词、动词、形容词等）
const MEANINGFUL_POS = [
  'n', 'nr', 'ns', 'nt', 'nz', // 名词类
  'v', 'vd', 'vn',            // 动词类
  'a', 'ad', 'an',            // 形容词类
  'z'                         // 状态词
];

/**
 * 文本预处理：去除特殊字符、分词、过滤停用词和无意义词性
 */
export const preprocessText = (text) => {
  if (!text) return [];
  
  // 1. 文本清洗
  const cleanText = text
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ') // 去除特殊字符
    .replace(/\s+/g, ' '); // 合并连续空格
  
  // 2. 分词并获取词性（使用nodejieba）
  const wordsWithPos = nodejieba.tag(cleanText);
  
  // 3. 过滤停用词和无意义词性
  return wordsWithPos
    .filter(item => {
      const isNotStopword = !stopwords.includes(item.word);
      const isMeaningfulPOS = MEANINGFUL_POS.includes(item.tag);
      const isLongEnough = item.word.length > 1; // 过滤单字
      return isNotStopword && isMeaningfulPOS && isLongEnough;
    })
    .map(item => item.word);
};

/**
 * 统计词频并返回TopN高频词
 */
export const getTopWords = (words, topN = 30) => {
  if (!words || words.length === 0) return [];
  
  // 统计词频
  const wordCountMap = words.reduce((map, word) => {
    map[word] = (map[word] || 0) + 1;
    return map;
  }, {});
  
  // 转换为数组并排序
  const wordCountArray = Object.entries(wordCountMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
  
  // 返回TopN
  return wordCountArray.slice(0, topN);
};

/**
 * 提取关键词（结合TF-IDF算法）
 */
export const extractKeywords = (text, topN = 10) => {
  if (!text) return [];
  
  // 使用nodejieba的extract方法提取关键词（基于TF-IDF）
  const keywords = nodejieba.extract(text, topN);
  return keywords.map(item => ({ word: item.word, score: item.weight }));
};

/**
 * 高级文本分析：结合词频和关键词提取
 */
export const analyzeText = (text, options = {}) => {
  const { 
    topWordCount = 30, 
    keywordCount = 10,
    minWordLength = 2 
  } = options;
  
  // 预处理文本
  const processedWords = preprocessText(text);
  
  // 1. 高频词分析
  const topWords = getTopWords(processedWords, topWordCount);
  
  // 2. 关键词提取（使用原始文本以保留上下文）
  const keywords = extractKeywords(text, keywordCount);
  
  // 3. 词性分布统计
  const posStats = processedWords.reduce((stats, word) => {
    const pos = nodejieba.tag(word)[0].tag;
    stats[pos] = (stats[pos] || 0) + 1;
    return stats;
  }, {});
  
  // 4. 文本摘要（简化版）
  const summary = text.length > 200 
    ? text.substring(0, 200) + '...' 
    : text;
  
  return {
    topWords,
    keywords,
    posDistribution: posStats,
    wordCount: processedWords.length,
    uniqueWordCount: new Set(processedWords).size,
    summary
  };
};
