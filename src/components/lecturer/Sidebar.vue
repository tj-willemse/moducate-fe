<template>
  <div class="h-screen bg-white border-r border-gray-200 flex flex-col">
    <!-- User Profile -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex flex-col items-center space-y-4">
        <!-- Profile Picture -->
        <div class="relative">
          <img 
            v-if="user?.profileImageUrl" 
            :src="user.profileImageUrl" 
            alt="Profile Picture" 
            class="h-20 w-20 rounded-full object-cover border-2 border-indigo-200"
          />
          <div 
            v-else 
            class="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-xl font-semibold"
          >
            {{ userInitials }}
          </div>
        </div>
        
        <div class="text-center">
          <div class="font-medium text-gray-800 text-lg">{{ userName }}</div>
          <div class="text-sm text-indigo-500 flex items-center justify-center mt-1">
            <span class="h-2 w-2 rounded-full bg-indigo-500 mr-1"></span>
            {{ userRole }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 py-6 overflow-y-auto">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.id">
          <a 
            href="#" 
            @click.prevent="$emit('nav-change', item.id)"
            :class="[
              activeItem === item.id 
                ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-500' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent',
              'flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200'
            ]"
          >
            <div :class="[
              activeItem === item.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600',
              'flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 mr-3'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="item.id === 'dashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                <path v-else-if="item.id === 'assessments'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                <path v-else-if="item.id === 'subjects'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            {{ item.name }}
          </a>
        </li>
      </ul>
    </nav>
    
    <!-- Logo and Logout -->
    <div class="p-6 border-t border-gray-200">
      <div class="mb-6">
        <img src="/logo.svg" alt="Moducate Logo" class="h-8" onerror="this.src='https://via.placeholder.com/120x30?text=Moducate';this.onerror='';" />
      </div>
      <button 
        @click="$emit('logout')" 
        class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Log out
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'LecturerSidebar',
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    activeItem: {
      type: String,
      default: 'dashboard'
    }
  },
  emits: ['nav-change', 'logout'],
  setup(props) {
    const navItems = [
      { id: 'dashboard', name: 'Dashboard', href: '#' },
      { id: 'assessments', name: 'Assessments', href: '#' },
      { id: 'subjects', name: 'Subjects', href: '#' }
    ];

    const userName = computed(() => {
      return props.user?.displayName || 'User';
    });

    const userInitials = computed(() => {
      if (!props.user?.displayName) return 'U';
      return props.user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    });

    const userRole = computed(() => {
      const role = props.user?.role?.toLowerCase() || 'user';
      // Capitalize first letter
      return role.charAt(0).toUpperCase() + role.slice(1);
    });

    return {
      navItems,
      userName,
      userInitials,
      userRole
    };
  }
};
</script>
