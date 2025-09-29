<template>
  <div class="mt-30 max-w-md mx-auto">
    <h1 class="text-3xl font-bold">Create an Account</h1>
    <p class="text-gray-600 mb-8">Register to access the assessment moderation dashboard</p>
    
    <!-- We don't need these notifications anymore as we're using Vue Toastification -->
    
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
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { app, db } from '@/firebase/config'
import { useToast } from 'vue-toastification'

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
    const router = useRouter()
    const auth = getAuth(app)
    const toast = useToast()
    
    const handleRegister = async () => {
      // Validate passwords match
      if (password.value !== confirmPassword.value) {
        toast.error('Passwords do not match.')
        return
      }
      
      isLoading.value = true
      
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
        const user = userCredential.user
        
        // Update profile with name
        await updateProfile(user, {
          displayName: name.value
        })
        
        // Prepare user data with both role string and boolean flags
        const userData = {
          uid: user.uid,
          fullName: name.value,
          email: email.value,
          role: role.value,
          approved: false, // User starts as unapproved
          active: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
        
        // Add boolean role flags based on selected role
        if (role.value === 'moderator') {
          userData.moderator = true
          userData.lecturer = false
        } else if (role.value === 'lecturer') {
          userData.lecturer = true
          userData.moderator = false
        }
        
        // Save user data to Firestore with pending approval status
        await setDoc(doc(db, 'users', user.uid), userData)
        
        // Clear form
        name.value = ''
        email.value = ''
        password.value = ''
        confirmPassword.value = ''
        
        // Show success message with toast
        toast.success('Registration successful! Your account is pending approval by an administrator.')
        
        // Wait 3 seconds before redirecting to login
        setTimeout(() => {
          // Go back to login page
          goToLogin()
        }, 3000)
      } catch (error) {
        console.error('Registration error:', error)
        
        // Handle different error codes with toast notifications
        switch (error.code) {
          case 'auth/email-already-in-use':
            toast.error('This email is already in use.')
            break
          case 'auth/invalid-email':
            toast.error('Invalid email address format.')
            break
          case 'auth/weak-password':
            toast.error('Password is too weak. Please use a stronger password.')
            break
          default:
            toast.error('Failed to register. Please try again.')
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
      handleRegister,
      goToLogin
    }
  }
}
</script>
