<template>
  <div class="h-screen bg-white border-r border-gray-200 flex flex-col">
    <!-- User Profile -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex flex-col items-center space-y-4">
        <!-- Profile Picture with Upload Option -->
        <div class="relative group">
          <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-full">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
          </div>
          
          <img 
            v-if="profileImageUrl" 
            :src="profileImageUrl" 
            alt="Profile Picture" 
            class="h-20 w-20 rounded-full object-cover border-2 border-indigo-200"
          />
          <div 
            v-else 
            class="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-xl font-semibold"
          >
            {{ userInitials }}
          </div>
          
          <!-- Upload Overlay -->
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <label for="profile-upload" class="cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
            <input 
              id="profile-upload" 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="uploadProfileImage"
            />
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
        <li v-for="(item, index) in filteredNavItems" :key="index">
          <a 
            :href="item.href" 
            @click.prevent="$emit('nav-change', item.id)"
            :class="[
              activeItem === item.id 
                ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-500' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent',
              'flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 group'
            ]"
          >
            <!-- Dashboard Icon -->
            <div v-if="item.id === 'dashboard'" :class="[
              activeItem === item.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
              'flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 mr-3'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            
            <!-- Assessments Icon -->
            <div v-else-if="item.id === 'assessments'" :class="[
              activeItem === item.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
              'flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 mr-3'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            
            <!-- Subjects Icon -->
            <div v-else-if="item.id === 'subjects'" :class="[
              activeItem === item.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
              'flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 mr-3'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            
            <!-- User Management Icon -->
            <div v-else-if="item.id === 'users'" :class="[
              activeItem === item.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
              'flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 mr-3'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            
            <!-- Archives Icon -->
            <div v-else-if="item.id === 'archives'" :class="[
              activeItem === item.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
              'flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 mr-3'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            
            <!-- Activity Icon -->
            <div v-else-if="item.id === 'activity'" :class="[
              activeItem === item.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
              'flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 mr-3'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            
            <!-- Settings Icon -->
            <div v-else-if="item.id === 'settings'" :class="[
              activeItem === item.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
              'flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 mr-3'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <!-- Default Icon (fallback) -->
            <div v-else :class="[
              activeItem === item.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
              'flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 mr-3'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
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
import { ref, computed, onMounted, watch } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useToast } from 'vue-toastification';

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
  name: 'AppSidebar',
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
      default: () => ({})
    },
    activeItem: {
      type: String,
      default: 'dashboard'
    }
  },
  emits: ['nav-change', 'logout'],
  setup(props) {
    const toast = useToast();
    const storage = getStorage();
    const db = getFirestore();
    
    // State
    const profileImageUrl = ref('');
    const imageLoading = ref(false);
    
    // All possible navigation items
    const allNavItems = [
      { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, href: '#', roles: ['admin', 'moderator', 'lecturer'] },
      { id: 'assessments', name: 'Assessments', icon: AssessmentIcon, href: '#', roles: ['admin', 'moderator', 'lecturer'] },
      { id: 'subjects', name: 'Subjects', icon: SubjectIcon, href: '#', roles: ['admin', 'lecturer'] },
      { id: 'users', name: 'User Management', icon: ModeratorIcon, href: '#', roles: ['admin'] },
      { id: 'archives', name: 'Archives', icon: ArchiveIcon, href: '#', roles: ['admin', 'moderator'] },
      { id: 'settings', name: 'Settings', icon: SettingsIcon, href: '#', roles: ['admin', 'moderator', 'lecturer'] }
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

    // Filter navigation items based on user role
    const filteredNavItems = computed(() => {
      const role = props.user?.role?.toLowerCase() || 'user';
      return allNavItems.filter(item => item.roles.includes(role));
    });
    
    // Load profile image on component mount and when user changes
    onMounted(async () => {
      if (props.user?.uid) {
        await loadProfileImage();
      }
    });
    
    // Watch for user changes and reload profile image when user changes
    watch(() => props.user?.uid, async (newUserId) => {
      if (newUserId) {
        await loadProfileImage();
      } else {
        // Reset profile image if no user
        profileImageUrl.value = '';
      }
    });
    
    // Load the user's profile image from Firestore/Storage
    const loadProfileImage = async () => {
      try {
        // First check if the user has a profileImageUrl in Firestore
        const userDoc = await getDoc(doc(db, 'users', props.user.uid));
        if (userDoc.exists() && userDoc.data().profileImageUrl) {
          // Add cache busting parameter to prevent browser caching
          const timestamp = new Date().getTime();
          const imageUrl = userDoc.data().profileImageUrl;
          profileImageUrl.value = imageUrl.includes('?') ? 
            `${imageUrl}&t=${timestamp}` : 
            `${imageUrl}?t=${timestamp}`;
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
      }
    };
    
    // Handle profile image upload
    const uploadProfileImage = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      imageLoading.value = true;
      
      try {
        // Create a storage reference
        const userId = props.user.uid;
        const imageRef = storageRef(storage, `profileImages/${userId}`);
        
        // Upload the file
        await uploadBytes(imageRef, file);
        
        // Get the download URL with cache busting
        const timestamp = new Date().getTime();
        const downloadURL = await getDownloadURL(imageRef) + `?t=${timestamp}`;
        
        // Update the user's profile in Firestore
        await updateDoc(doc(db, 'users', userId), {
          profileImageUrl: downloadURL,
          updatedAt: new Date()
        });
        
        // Update the local state
        profileImageUrl.value = downloadURL;
        
        // Force a UI refresh by briefly clearing and resetting the URL
        setTimeout(() => {
          profileImageUrl.value = '';
          setTimeout(() => {
            profileImageUrl.value = downloadURL;
          }, 50);
        }, 50);
        
        toast.success('Profile picture updated successfully');
      } catch (error) {
        console.error('Error uploading profile image:', error);
        toast.error('Failed to upload profile picture');
      } finally {
        imageLoading.value = false;
      }
    };

    return {
      filteredNavItems,
      userName,
      userInitials,
      userRole,
      profileImageUrl,
      imageLoading,
      uploadProfileImage
    };
  }
};
</script>
