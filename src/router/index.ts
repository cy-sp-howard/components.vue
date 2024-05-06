import { createRouter, createMemoryHistory } from 'vue-router'
import permission from './permission'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: () => import('@/views/Login/index.vue'),
    },
  ],
})

router.beforeEach(permission)
export default router
