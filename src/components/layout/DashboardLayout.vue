<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Mobile menu button -->
    <div class="fixed top-0 left-0 p-4 z-20 md:hidden">
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen" 
        class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Sidebar for mobile -->
    <div 
      v-if="mobileMenuOpen" 
      class="fixed inset-0 z-10 bg-gray-600 bg-opacity-75 md:hidden"
      @click="mobileMenuOpen = false"
    ></div>

    <div 
      :class="[mobileMenuOpen ? 'translate-x-0' : '-translate-x-full', 'fixed inset-y-0 left-0 z-10 w-72 transition duration-300 transform bg-white md:hidden']"
    >
      <slot name="sidebar" :user="user" :active-section="activeSection" :handle-nav-change="handleNavChange" :logout="logout"></slot>
    </div>

    <!-- Sidebar for desktop -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="w-72">
        <slot name="sidebar" :user="user" :active-section="activeSection" :handle-nav-change="handleNavChange" :logout="logout"></slot>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <div class="py-6 px-4 sm:px-6 lg:px-8">
        <slot name="content" :active-section="activeSection"></slot>
      </div>
    </div>
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
        <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-700">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  name: 'DashboardLayout',
  props: {
    user: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    initialActiveSection: {
      type: String,
      default: 'dashboard'
    }
  },
  emits: ['nav-change', 'logout'],
  setup(props, { emit }) {
    const router = useRouter();
    const auth = getAuth();
    const toast = useToast();
    
    const mobileMenuOpen = ref(false);
    const activeSection = ref(props.initialActiveSection);
    
    const handleNavChange = (sectionId) => {
      activeSection.value = sectionId;
      emit('nav-change', sectionId);
    };
    
    const logout = async () => {
      try {
        await signOut(auth);
        router.push('/');
        toast.info('You have been logged out');
        emit('logout');
      } catch (error) {
        console.error('Error signing out:', error);
        toast.error('Failed to log out. Please try again.');
      }
    };
    
    return {
      mobileMenuOpen,
      activeSection,
      handleNavChange,
      logout
    };
  }
};
</script>
