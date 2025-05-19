<!-- WEB/project/src/views/Home/UserProfile.vue -->
<template>
  <div class="user-profile">
    <h2>用户画像 - 词云图</h2>
    <div id="wordcloud" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import api from '@/api';
import * as echarts from 'echarts';
import 'echarts-wordcloud';

export default {
  data() {
    return {
      wordcloudData: []
    };
  },
  async mounted() {
    try {
      const userId = this.$store.state.user.userInfo.user._id;
      const { data } = await api.user.getUserDataForWordCloud(userId);
      const words = this.processText(data.text);
      const wordCount = {};
      words.forEach(word => {
        if (word.trim()) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
      this.wordcloudData = Object.keys(wordCount).map(word => ({
        name: word,
        value: wordCount[word]
      }));
      this.drawWordCloud();
    } catch (error) {
      console.error('获取数据失败', error);
    }
  },
  methods: {
    processText(text) {
      // 这里可以调用后端的分词服务，为了简单示例，使用前端模拟
      return text.split(' ');
    },
    drawWordCloud() {
      const chart = echarts.init(document.getElementById('wordcloud'));
      const option = {
        series: [
          {
            type: 'wordCloud',
            shape: 'circle',
            sizeRange: [12, 60],
            rotationRange: [-90, 90],
            textStyle: {
              normal: {
                color: function () {
                  return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',') + ')';
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            data: this.wordcloudData
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.user-profile {
  padding: 32px;
}
</style>
