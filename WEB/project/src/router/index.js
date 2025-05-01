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
          path: '',
          redirect: '/user-center'
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