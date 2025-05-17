import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/assessment/:id',
      name: 'assessment-detail',
      // route level code-splitting
      // this generates a separate chunk (Assessment.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AssessmentDetailView.vue')
    }
  ]
})

export default router
