<template>
  <div class="h-screen bg-white border-r border-gray-200 flex flex-col">
    <!-- User Profile -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
          {{ userInitials }}
        </div>
        <div>
          <div class="font-medium text-gray-800">{{ userName }}</div>
          <div class="text-xs text-indigo-500 flex items-center">
            <span class="h-2 w-2 rounded-full bg-indigo-500 mr-1"></span>
            {{ userRole }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <ul>
        <li v-for="(item, index) in navItems" :key="index">
          <a 
            :href="item.href" 
            @click.prevent="$emit('nav-change', item.id)"
            :class="[
              activeItem === item.id 
                ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-500' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'flex items-center px-4 py-3 text-sm font-medium'
            ]"
          >
            <component :is="item.icon" class="h-5 w-5 mr-3" />
            {{ item.name }}
          </a>
        </li>
      </ul>
    </nav>
    
    <!-- Logo and Logout -->
    <div class="p-4 border-t border-gray-200">
      <div class="mb-4">
        <img src="@/public/logo.svg" alt="Moducate Logo" class="h-8" />
      </div>
      <button 
        @click="$emit('logout')" 
        class="flex items-center text-sm text-gray-600 hover:text-gray-900"
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

// Icons
const HomeIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  `
};

const AssessmentIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  `
};

const SubjectIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  `
};

const ModeratorIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  `
};

const ArchiveIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  `
};

const ActivityIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
};

const SettingsIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
};

export default {
  name: 'DashboardSidebar',
  components: {
    HomeIcon,
    AssessmentIcon,
    SubjectIcon,
    ModeratorIcon,
    ArchiveIcon,
    ActivityIcon,
    SettingsIcon
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    activeItem: {
      type: String,
      default: 'dashboard'
    }
  },
  emits: ['nav-change', 'logout'],
  setup(props) {
    const navItems = [
      { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, href: '#' },
      { id: 'assessments', name: 'Assessments', icon: AssessmentIcon, href: '#' },
      { id: 'subjects', name: 'Subjects', icon: SubjectIcon, href: '#' },
      { id: 'moderators', name: 'Moderators', icon: ModeratorIcon, href: '#' },
      { id: 'archives', name: 'Archives', icon: ArchiveIcon, href: '#' },
      { id: 'activity', name: 'Logs & Activity', icon: ActivityIcon, href: '#' },
      { id: 'settings', name: 'Settings', icon: SettingsIcon, href: '#' }
    ];

    const userName = computed(() => {
      return props.user?.displayName || 'Admin User';
    });

    const userInitials = computed(() => {
      if (!props.user?.displayName) return 'A';
      return props.user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    });

    const userRole = computed(() => {
      return 'Admin';
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
