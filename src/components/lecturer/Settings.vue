<template>
  <div class="space-y-8">
    <!-- Profile Settings -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Profile Settings</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Update your personal information</p>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="updateProfile" class="space-y-6">
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="full-name" class="block text-sm font-medium text-gray-700">Full name</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  id="full-name" 
                  v-model="profile.fullName" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input 
                  type="email" 
                  id="email" 
                  v-model="profile.email" 
                  disabled 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                />
                <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div class="sm:col-span-6">
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
              <div class="mt-1">
                <textarea 
                  id="bio" 
                  v-model="profile.bio" 
                  rows="3" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
              <p class="mt-2 text-sm text-gray-500">Brief description about yourself and your teaching areas.</p>
            </div>
            
            <div class="sm:col-span-6">
              <label for="specialization" class="block text-sm font-medium text-gray-700">Specialization</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  id="specialization" 
                  v-model="profile.specialization" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p class="mt-2 text-sm text-gray-500">Your main area of expertise or teaching focus.</p>
            </div>
          </div>

          <div class="flex justify-end">
            <button 
              type="button" 
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="resetProfile"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="profileUpdating"
            >
              <svg v-if="profileUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Profile Picture -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Profile Picture</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Update your profile image</p>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-full">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
            </div>
            
            <img 
              v-if="profileImageUrl" 
              :src="profileImageUrl" 
              alt="Profile Picture" 
              class="h-24 w-24 rounded-full object-cover border-2 border-indigo-200"
            />
            <div 
              v-else 
              class="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-xl font-semibold"
            >
              {{ userInitials }}
            </div>
          </div>
          
          <div>
            <label for="profile-upload" class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Upload new photo
            </label>
            <input 
              id="profile-upload" 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="uploadProfileImage"
            />
            <p class="mt-1 text-xs text-gray-500">JPG, PNG or GIF up to 5MB</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Settings -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Update your password</p>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="updatePassword" class="space-y-6">
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-6">
              <label for="current-password" class="block text-sm font-medium text-gray-700">Current password</label>
              <div class="mt-1">
                <input 
                  type="password" 
                  id="current-password" 
                  v-model="passwordForm.currentPassword" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="new-password" class="block text-sm font-medium text-gray-700">New password</label>
              <div class="mt-1">
                <input 
                  type="password" 
                  id="new-password" 
                  v-model="passwordForm.newPassword" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm password</label>
              <div class="mt-1">
                <input 
                  type="password" 
                  id="confirm-password" 
                  v-model="passwordForm.confirmPassword" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button 
              type="button" 
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="resetPasswordForm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="passwordUpdating"
            >
              <svg v-if="passwordUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your notification preferences</p>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <div class="space-y-6">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input 
                id="email-notifications" 
                v-model="notifications.email" 
                type="checkbox" 
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="email-notifications" class="font-medium text-gray-700">Email notifications</label>
              <p class="text-gray-500">Receive email notifications when your assessments are moderated.</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input 
                id="browser-notifications" 
                v-model="notifications.browser" 
                type="checkbox" 
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="browser-notifications" class="font-medium text-gray-700">Browser notifications</label>
              <p class="text-gray-500">Receive browser notifications when your assessments are moderated.</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input 
                id="summary-notifications" 
                v-model="notifications.summary" 
                type="checkbox" 
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="summary-notifications" class="font-medium text-gray-700">Weekly summary</label>
              <p class="text-gray-500">Receive a weekly summary of your assessment statuses.</p>
            </div>
          </div>

          <div class="flex justify-end">
            <button 
              type="button" 
              @click="saveNotificationSettings" 
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="notificationsUpdating"
            >
              <svg v-if="notificationsUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/firebase/config';
import { useToast } from 'vue-toastification';

export default {
  name: 'LecturerSettings',
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const toast = useToast();
    const auth = getAuth();
    const storage = getStorage();
    
    // Profile form
    const profile = ref({
      fullName: '',
      email: '',
      bio: '',
      specialization: ''
    });
    const originalProfile = ref({});
    const profileUpdating = ref(false);
    
    // Profile image
    const profileImageUrl = ref('');
    const imageLoading = ref(false);
    const userInitials = computed(() => {
      if (!props.user?.displayName) return 'U';
      return props.user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    });
    
    // Password form
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const passwordUpdating = ref(false);
    
    // Notification settings
    const notifications = ref({
      email: true,
      browser: true,
      summary: false
    });
    const notificationsUpdating = ref(false);
    
    // Load user data on mount
    onMounted(async () => {
      if (props.user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', props.user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Set profile data
            profile.value = {
              fullName: userData.fullName || userData.displayName || '',
              email: props.user.email || '',
              bio: userData.bio || '',
              specialization: userData.specialization || ''
            };
            
            // Set profile image
            if (userData.profileImageUrl) {
              profileImageUrl.value = userData.profileImageUrl;
            }
            
            // Store original values for reset functionality
            originalProfile.value = { ...profile.value };
            
            // Set notification preferences
            if (userData.notificationPreferences) {
              notifications.value = {
                email: userData.notificationPreferences.email ?? true,
                browser: userData.notificationPreferences.browser ?? true,
                summary: userData.notificationPreferences.summary ?? false
              };
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          toast.error('Failed to load user data');
        }
      }
    });
    
    // Update profile
    const updateProfile = async () => {
      if (!props.user?.uid) {
        toast.error('You must be logged in to update your profile');
        return;
      }
      
      profileUpdating.value = true;
      
      try {
        // Update user in Firestore
        await updateDoc(doc(db, 'users', props.user.uid), {
          fullName: profile.value.fullName,
          bio: profile.value.bio,
          specialization: profile.value.specialization,
          updatedAt: new Date()
        });
        
        // Update original values
        originalProfile.value = { ...profile.value };
        
        toast.success('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
      } finally {
        profileUpdating.value = false;
      }
    };
    
    // Reset profile form
    const resetProfile = () => {
      profile.value = { ...originalProfile.value };
    };
    
    // Upload profile image
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
        
        // Get the download URL
        const downloadURL = await getDownloadURL(imageRef);
        
        // Update the user's profile in Firestore
        await updateDoc(doc(db, 'users', userId), {
          profileImageUrl: downloadURL,
          updatedAt: new Date()
        });
        
        // Update the local state
        profileImageUrl.value = downloadURL;
        
        toast.success('Profile picture updated successfully');
      } catch (error) {
        console.error('Error uploading profile image:', error);
        toast.error('Failed to upload profile picture');
      } finally {
        imageLoading.value = false;
      }
    };
    
    // Update password
    const updatePassword = async () => {
      if (!auth.currentUser) {
        toast.error('You must be logged in to change your password');
        return;
      }
      
      // Validate password fields
      if (!passwordForm.value.currentPassword) {
        toast.error('Current password is required');
        return;
      }
      
      if (!passwordForm.value.newPassword) {
        toast.error('New password is required');
        return;
      }
      
      if (passwordForm.value.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
      
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      
      passwordUpdating.value = true;
      
      try {
        // Re-authenticate user
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          passwordForm.value.currentPassword
        );
        
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        // Update password
        await updatePassword(auth.currentUser, passwordForm.value.newPassword);
        
        // Reset form
        resetPasswordForm();
        
        toast.success('Password updated successfully');
      } catch (error) {
        console.error('Error updating password:', error);
        
        if (error.code === 'auth/wrong-password') {
          toast.error('Current password is incorrect');
        } else {
          toast.error('Failed to update password');
        }
      } finally {
        passwordUpdating.value = false;
      }
    };
    
    // Reset password form
    const resetPasswordForm = () => {
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    };
    
    // Save notification settings
    const saveNotificationSettings = async () => {
      if (!props.user?.uid) {
        toast.error('You must be logged in to update notification settings');
        return;
      }
      
      notificationsUpdating.value = true;
      
      try {
        // Update user in Firestore
        await updateDoc(doc(db, 'users', props.user.uid), {
          notificationPreferences: {
            email: notifications.value.email,
            browser: notifications.value.browser,
            summary: notifications.value.summary
          },
          updatedAt: new Date()
        });
        
        toast.success('Notification preferences updated successfully');
      } catch (error) {
        console.error('Error updating notification preferences:', error);
        toast.error('Failed to update notification preferences');
      } finally {
        notificationsUpdating.value = false;
      }
    };
    
    return {
      profile,
      profileUpdating,
      updateProfile,
      resetProfile,
      
      profileImageUrl,
      imageLoading,
      userInitials,
      uploadProfileImage,
      
      passwordForm,
      passwordUpdating,
      updatePassword,
      resetPasswordForm,
      
      notifications,
      notificationsUpdating,
      saveNotificationSettings
    };
  }
};
</script>
