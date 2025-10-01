import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import LoginView from '../views/LoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import ModeratorDashboardView from '../views/ModeratorDashboardView.vue'
import LecturerDashboardView from '../views/LecturerDashboardView.vue'

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
    {
      path: '/moderator',
      name: 'moderator-dashboard',
      component: ModeratorDashboardView,
      meta: { requiresAuth: true, requiresModerator: true }
    },
    {
      path: '/lecturer',
      name: 'lecturer-dashboard',
      component: LecturerDashboardView,
      meta: { requiresAuth: true, requiresLecturer: true }
    }
  ]
})

// Wait for Firebase Auth to initialize
let authInitialized = false
const auth = getAuth()

auth.onAuthStateChanged(() => {
  authInitialized = true
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const requiresModerator = to.matched.some(record => record.meta.requiresModerator)
  const requiresLecturer = to.matched.some(record => record.meta.requiresLecturer)
  
  if (requiresAuth) {
    // Wait for Firebase Auth to initialize if it hasn't already
    if (!authInitialized) {
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(() => {
          unsubscribe()
          resolve()
        })
      })
    }
    
    const currentUser = auth.currentUser
    
    if (!currentUser) {
      // Not logged in, redirect to login page
      next({ name: 'login' })
      return
    }
    
    try {
      // Get user claims
      const idTokenResult = await currentUser.getIdTokenResult(true) // Force refresh token
      console.log('User claims:', idTokenResult.claims)
      
      // Check if role is in token claims
      let isAdmin = idTokenResult.claims.admin === true;
      let isModerator = idTokenResult.claims.moderator === true || idTokenResult.claims.role === 'moderator';
      let isLecturer = idTokenResult.claims.lecturer === true || idTokenResult.claims.role === 'lecturer';
      let isApproved = idTokenResult.claims.approved === true;
      
      // If no role found in claims, check Firestore directly
      if (!isAdmin && !isModerator && !isLecturer) {
        console.log('No role found in claims, checking Firestore...');
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data from Firestore:', userData);
            
            isAdmin = userData.admin === true;
            isModerator = userData.moderator === true || userData.role === 'moderator';
            isLecturer = userData.lecturer === true || userData.role === 'lecturer';
            isApproved = userData.approved === true;
          }
        } catch (firestoreError) {
          console.error('Error checking Firestore for role:', firestoreError);
        }
      }
      
      // Now check role-specific requirements
      if (requiresAdmin && !isAdmin) {
        console.log('User is not an admin');
        next({ name: 'login' });
        return;
      }
      
      if (requiresModerator && !isModerator) {
        console.log('User is not a moderator');
        next({ name: 'login' });
        return;
      }
      
      if (requiresLecturer && !isLecturer) {
        console.log('User is not a lecturer');
        next({ name: 'login' });
        return;
      }
      
      // Check if user is approved
      if (!isApproved && !(isAdmin || isModerator || isLecturer)) {
        console.log('User is not approved');
        next({ name: 'login' });
        return;
      }
    } catch (error) {
      console.error('Error checking user claims:', error)
      next({ name: 'login' })
      return
    }
  }
  
  next()
})

export default router
