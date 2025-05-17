import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import LoginView from '../views/LoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
  
  ]
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  if (requiresAuth) {
    const auth = getAuth()
    const currentUser = auth.currentUser
    
    if (!currentUser) {
      // Not logged in, redirect to login page
      next({ name: 'login' })
      return
    }
    
    if (requiresAdmin) {
      try {
        // Check if user is admin (using custom claims)
        const idTokenResult = await currentUser.getIdTokenResult(true) // Force refresh token
        console.log('User claims:', idTokenResult.claims)
        const isAdmin = idTokenResult.claims.admin === true
        
        if (!isAdmin) {
          console.log('User is not an admin')
          // Not an admin, redirect to login
          next({ name: 'login' })
          return
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        next({ name: 'login' })
        return
      }
    }
  }
  
  next()
})

export default router
