import { LocalStorage } from 'quasar'
import auth from '../auth'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: checkAuth,
    children: [
      { path: '', component: () => import('pages/Todo.vue') },
      { path: '/help', component: () => import('pages/Help.vue') }
    ]
  },
  {
    path:'/login',
    component: () => import('layouts/Login.vue'),
    name: 'login'
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

function checkAuth (to, from, next) {
  if (to.path === '/' && auth.user.authenticated) {
    next('/')
  }
  else if (!LocalStorage.getItem('accessToken') && to.path !== '/') {
    console.log('not logged')
    next('/login')
  }
  else {
    next()
  }
}


export default routes
