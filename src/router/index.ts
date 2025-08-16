import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/page/index.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/match',
    name: 'matchPage',
    component: () =>
      import(/* webpackChunkName: "match" */ '@/page/match/index.vue'),
  },
  {
    path: '/place',
    name: 'placePage',
    component: () =>
      import(/* webpackChunkName: "match" */ '@/page/place/index.vue'),
  },
  {
    path: '/fight',
    name: 'fightPage',
    component: () =>
      import(/* webpackChunkName: "fight" */ '@/page/fight/index.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () =>
      import(/* webpackChunkName: "test" */ '@/page/test/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes],
})

export default router
