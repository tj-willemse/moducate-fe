<template>
  <div class="mt-36 max-w-md mx-auto">
    <h1 class="text-3xl font-bold">Welcome to Moducate</h1>
    <p class="text-gray-600 mb-8">Sign in to access your assessment moderation dashboard</p>
    
    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ errorMessage }}
    </div>
    
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="your@example.com" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="••••••••" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="remember" 
            v-model="rememberMe" 
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
        </div>
        
        <div>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-800" @click.prevent="forgotPassword">Forgot your password?</a>
        </div>
      </div>
      
      <button 
        type="submit" 
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </span>
        <span v-else>Sign in</span>
      </button>
    </form>
    
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account? 
        <a href="#" class="text-blue-600 hover:text-blue-800" @click.prevent="register">Register here</a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth'
import { app } from '@/firebase/config'

export default {
  name: 'LoginForm',
  emits: ['switch-to-register'],
  setup(props, { emit }) {
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const isLoading = ref(false)
    const errorMessage = ref('')
    const router = useRouter()
    const auth = getAuth(app)
    
    const handleLogin = async () => {
      errorMessage.value = ''
      isLoading.value = true
      
      try {
        // Set persistence based on remember me checkbox
        const persistenceType = rememberMe.value ? browserLocalPersistence : browserSessionPersistence
        await setPersistence(auth, persistenceType)
        
        console.log('Attempting login with:', email.value)
        
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        console.log('Login successful, user:', userCredential.user.uid)
        
        // Get user token to check claims
        const idTokenResult = await userCredential.user.getIdTokenResult(true) // Force refresh token
        console.log('User claims:', idTokenResult.claims)
        const isAdmin = idTokenResult.claims.admin === true
        console.log('Is admin?', isAdmin)
        
        // Redirect based on user role
        if (isAdmin) {
          console.log('Redirecting to admin dashboard')
          router.push('/admin')
        } else {
          console.log('Redirecting to regular dashboard')
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Login error:', error)
        
        // Handle different error codes
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage.value = 'Invalid email address format.'
            break
          case 'auth/user-disabled':
            errorMessage.value = 'This account has been disabled.'
            break
          case 'auth/user-not-found':
            errorMessage.value = 'No account found with this email.'
            break
          case 'auth/invalid-credential':
            errorMessage.value = 'Invalid email or password.'
            break
          case 'auth/wrong-password':
            errorMessage.value = 'Incorrect password.'
            break
          default:
            errorMessage.value = 'Failed to sign in. Please try again.'
        }
      } finally {
        isLoading.value = false
      }
    }
    
    const forgotPassword = () => {
      // Navigate to password reset page or show modal
      // For now, just log to console
      console.log('Forgot password clicked')
      // Future implementation: router.push('/reset-password')
    }
    
    const register = () => {
      // Emit event to flip to registration form
      emit('switch-to-register')
    }
    
    return {
      email,
      password,
      rememberMe,
      isLoading,
      errorMessage,
      handleLogin,
      forgotPassword,
      register
    }
  }
}
</script>