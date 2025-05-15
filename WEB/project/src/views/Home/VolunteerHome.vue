<template>
  <div class="volunteer-home">
    <!-- 日历、时间和天气信息 -->
    <div class="info-section">
      <div class="date-time">
        <p>{{ currentDate }}</p>
        <p>{{ currentTime }}</p>
      </div>
      <div class="weather" v-if="weatherInfo">
        <p>{{ weatherInfo.location }} {{ weatherInfo.weather }}</p>
        <p>{{ weatherInfo.temperature }}°C</p>
      </div>
    </div>

    <!-- 最新活动 -->
    <div class="latest-activities">
      <h2>最新活动</h2>
      <ul>
        <li v-for="activity in latestActivities" :key="activity._id">
          <h3>{{ activity.title }}</h3>
          <p>{{ activity.introduction }}</p>
          <p>发布时间: {{ formatDate(activity.createdAt) }}</p>
        </li>
      </ul>
    </div>

    <!-- 最新新闻 -->
    <div class="latest-news">
      <h2>最新新闻</h2>
      <ul>
        <li v-for="news in latestNews" :key="news._id">
          <h3>{{ news.title }}</h3>
          <p>{{ news.content }}</p>
          <p>发布时间: {{ formatDate(news.createdAt) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      currentDate: '',
      currentTime: '',
      weatherInfo: null,
      latestActivities: [],
      latestNews: []
    }
  },
  mounted() {
    this.updateDateTime()
    setInterval(this.updateDateTime, 1000)
    this.fetchWeather()
    this.fetchLatestActivities()
    this.fetchLatestNews()
  },
  methods: {
    updateDateTime() {
      const now = new Date()
      this.currentDate = now.toLocaleDateString()
      this.currentTime = now.toLocaleTimeString()
    },
    async fetchWeather() {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=28c23c8014224bb3b1860608251505&q=${latitude},${longitude}`)
            const data = await response.json()
            this.weatherInfo = {
              location: data.location.name,
              weather: data.current.condition.text,
              temperature: data.current.temp_c
            }
          })
        }
      } catch (error) {
        console.error('获取天气信息失败', error)
      }
    },
    async fetchLatestActivities() {
      try {
        const { data } = await api.activity.getLatestActivities(3)
        this.latestActivities = data.activities
      } catch (error) {
        console.error('获取最新活动失败', error)
      }
    },
    async fetchLatestNews() {
      try {
        const { data } = await api.news.getLatestNews(3)
        this.latestNews = data.news
      } catch (error) {
        console.error('获取最新新闻失败', error)
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.volunteer-home {
  padding: 32px;
  background: linear-gradient(190deg, #f5f7fa 60%, #e3e9f2 100%);
  min-height: 100vh;
}

.info-section {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
  flex-wrap: wrap;
  justify-content: center;
}

.date-time {
  background: rgba(255,255,255,0.95);
  padding: 32px 48px;
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(41,128,185,0.1),
    inset 2px 2px 4px rgba(255,255,255,0.3);
  position: relative;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(52,152,219,0.15);
  transition: transform 0.3s ease;
  min-width: 280px;
  text-align: center;
}

.date-time:hover {
  transform: translateY(-4px);
}

.date-time::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(45deg, #3498db, #8e44ad);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.weather {
  background: linear-gradient(135deg, #3498db, #6366f1);
  color: white;
  padding: 32px 48px;
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(52,152,219,0.2),
    inset 0 -2px 4px rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
  min-width: 280px;
}

.weather::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  top: -30px;
  right: -30px;
}

.latest-activities,
.latest-news {
  max-width: 880px;
  margin: 0 auto 48px;
  background: rgba(255,255,255,0.98);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 12px 40px rgba(0,0,0,0.08),
    inset 0 1px 2px rgba(255,255,255,0.3);
  border: 1px solid rgba(236,239,241,0.8);
}

h2 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 28px;
  padding-bottom: 16px;
  position: relative;
  font-weight: 600;
}

h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #8e44ad);
  border-radius: 2px;
}

ul {
  display: grid;
  gap: 24px;
}

li {
  background: rgba(248,249,250,0.95);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(233,236,239,0.5);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  backdrop-filter: blur(4px);
  cursor: pointer;
}

li:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(52,152,219,0.15);
  background: white;
}

.date-time p:first-child {
  font-size: 1.6rem;
  color: #2c3e50;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.date-time p:last-child {
  font-size: 2.4rem;
  background: linear-gradient(45deg, #3498db, #6366f1);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
}

.weather p:first-child {
  font-size: 1.4rem;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.weather p:last-child {
  font-size: 2.8rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  margin-bottom: 10px;
  font-weight: 500;
}

p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

p:last-child {
  color: #95a5a6;
  font-size: 0.9rem;
  margin-top: 14px;
}

@media (max-width: 768px) {
  .volunteer-home {
    padding: 24px;
  }
  
  .date-time,
  .weather {
    padding: 24px;
    width: 100%;
    min-width: auto;
  }
  
  .latest-activities,
  .latest-news {
    padding: 24px;
    border-radius: 20px;
  }
  
  h2 {
    font-size: 1.8rem;
  }
  
  .date-time p:last-child {
    font-size: 2rem;
  }
  
  .weather p:last-child {
    font-size: 2.2rem;
  }
}

* {
  scroll-behavior: smooth;
}

.date-time p:first-child::after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #8e44ad);
  margin: 12px auto 0;
  transition: width 0.3s ease;
}

.date-time:hover p:first-child::after {
  width: 80px;
}
</style>