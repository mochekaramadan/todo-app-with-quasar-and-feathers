import { LocalStorage } from 'quasar'
import auth from '../auth'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    name:'home',
    beforeEnter: (to, from, next) => {
      if (auth.user.authenticated && LocalStorage.getItem('accessToken')) {
        next('/')
      } else if (!LocalStorage.getItem('accessToken') && !auth.user.authenticated){
        next('/login')
      } else{
        next()
      }
    },
    children: [
      { path: '', component: () => import('pages/Todo.vue') },
      { path: '/help', component: () => import('pages/Help.vue') }
    ]
  },
  {
    path:'/login',
    component: () => import('layouts/Login.vue'),
    meta: {
      disableIfLoggedIn: true
    },
    name: 'login'
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
