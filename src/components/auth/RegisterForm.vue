<template>
  <div class="mt-30 max-w-md mx-auto">
    <h1 class="text-3xl font-bold">Create an Account</h1>
    <p class="text-gray-600 mb-8">Register to access the assessment moderation dashboard</p>
    
    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ errorMessage }}
    </div>
    
    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          placeholder="John Doe" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="mb-4">
        <label for="register-email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input 
          type="email" 
          id="register-email" 
          v-model="email" 
          placeholder="your@example.com" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="mb-4">
        <label for="register-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          type="password" 
          id="register-password" 
          v-model="password" 
          placeholder="••••••••" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="mb-6">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          placeholder="••••••••" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
        <div class="flex space-x-6">
          <div class="flex items-center">
            <input 
              type="radio" 
              id="moderator" 
              name="role" 
              value="moderator" 
              v-model="role"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              required
            />
            <label for="moderator" class="ml-2 block text-sm text-gray-700">Moderator</label>
          </div>
          <div class="flex items-center">
            <input 
              type="radio" 
              id="lecturer" 
              name="role" 
              value="lecturer" 
              v-model="role"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="lecturer" class="ml-2 block text-sm text-gray-700">Lecturer</label>
          </div>
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
          Creating account...
        </span>
        <span v-else>Register</span>
      </button>
    </form>
    
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600">
        Already have an account? 
        <a href="#" class="text-blue-600 hover:text-blue-800" @click.prevent="goToLogin">Sign in</a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { app } from '@/firebase/config'

export default {
  name: 'RegisterForm',
  emits: ['switch-to-login'],
  setup(props, { emit }) {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const role = ref('moderator')
    const isLoading = ref(false)
    const errorMessage = ref('')
    const router = useRouter()
    const auth = getAuth(app)
    
    const handleRegister = async () => {
      errorMessage.value = ''
      
      // Validate passwords match
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.'
        return
      }
      
      isLoading.value = true
      
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
        
        // Update profile with name
        await updateProfile(userCredential.user, {
          displayName: name.value
        })
        
        // Redirect to dashboard on successful registration
        router.push('/dashboard')
      } catch (error) {
        console.error('Registration error:', error)
        
        // Handle different error codes
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage.value = 'This email is already in use.'
            break
          case 'auth/invalid-email':
            errorMessage.value = 'Invalid email address format.'
            break
          case 'auth/weak-password':
            errorMessage.value = 'Password is too weak. Please use a stronger password.'
            break
          default:
            errorMessage.value = 'Failed to register. Please try again.'
        }
      } finally {
        isLoading.value = false
      }
    }
    
    const goToLogin = () => {
      emit('switch-to-login')
    }
    
    return {
      name,
      email,
      password,
      confirmPassword,
      role,
      isLoading,
      errorMessage,
      handleRegister,
      goToLogin
    }
  }
}
</script>
