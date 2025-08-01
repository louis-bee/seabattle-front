import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/page/index.vue'

// vue项目自带路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/fight',
    name: 'Fight',
    component: () =>
      import(/* webpackChunkName: "fight" */ '@/page/fight/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes],
})

export default router
