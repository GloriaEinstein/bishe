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
        }
        
      ]
    }
  ]
})

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