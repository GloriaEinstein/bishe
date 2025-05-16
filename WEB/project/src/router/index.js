import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Auth/Login'),
      meta: { guestOnly: true }
    },
    {
      path: '/',
      component: () => import('@/views/Home/Index'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/user-center',
          name: 'UserCenter',
          component: () => import('@/views/Home/UserCenter')
        },
        {
          path: '/activity-hall',
          name: 'ActivityHall',
          component: () => import('@/views/Home/ActivityHall')
        },
        {
          path: '/activity-detail/:activityId',
          name: 'ActivityDetail',
          component: () => import('@/views/Home/ActivityDetail'),
        },
        {
          path: '/user-profile',
          name: 'UserProfile',
          component: () => import('@/views/Home/UserProfile'),
        },
        {
          path:'/intelligent-recommendation',
          name: 'IntelligentRecommendation',
          component: () => import('@/views/Home/IntelligentRecommendation'),
        },
        {
          path:'/system-notification',
          name: 'SystemNotification',
          component: () => import('@/views/Home/SystemNotification'),
        },
        {
          path:'/campus-news',
          name: 'CampusNews',
          component: () => import('@/views/Home/CampusNews'),
        },
        {
          path:'/system-announcement',
          name: 'SystemAnnouncement',
          component: () => import('@/views/Home/SystemAnnouncement'),
        },
        {
          path:'/activity-publish',
          name: 'ActivityPublish',
          component: () => import('@/views/Home/ActivityPublish'),
        },
        {
          path:'/user-review',
          name: 'UserReview',
          component: () => import('@/views/Home/UserReview'),
        },
        {
          path:'/notification-publish',
          name: 'NotificationPublish',
          component: () => import('@/views/Home/NotificationPublish'),
        },
        {
          path:'/news-publish',
          name: 'NewsPublish',
          component: () => import('@/views/Home/NewsPublish'),
        },
        {
          path:'/announcement-publish',
          name: 'AnnouncementPublish',
          component: () => import('@/views/Home/AnnouncementPublish'),
        },
        {
          path:'/report-management',
          name: 'ReportManagement',
          component: () => import('@/views/Home/ReportManagement'),
        },
        {
          path: '/volunteer-home',
          name: 'VolunteerHome',
          component: () => import('@/views/Home/VolunteerHome')
        }
        
      ]
    }
  ]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated' &&!err.message.includes('Navigation cancelled')) {
      // 如果不是导航重复或导航取消的错误，重新抛出
      throw err
    }
  })
}

const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated' &&!err.message.includes('Navigation cancelled')) {
      // 如果不是导航重复或导航取消的错误，重新抛出
      throw err
    }
  })
}

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.user.token
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router