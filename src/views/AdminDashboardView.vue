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
      <Sidebar 
        :user="user" 
        :active-item="activeSection" 
        @nav-change="handleNavChange" 
        @logout="logout"
      />
    </div>

    <!-- Sidebar for desktop -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="w-72">
        <Sidebar 
          :user="user" 
          :active-item="activeSection" 
          @nav-change="handleNavChange" 
          @logout="logout"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <div class="py-6 px-4 sm:px-6 lg:px-8">
        <!-- Dashboard Section -->
        <div v-if="activeSection === 'dashboard'" class="space-y-6">
          <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
          
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Assessments" 
              :count="assessmentsCount" 
              change="+12" 
              bg-color="bg-indigo-500"
              :icon="AssessmentIcon"
            />
            <StatCard 
              title="Pending Moderation" 
              :count="pendingModerationCount" 
              change="+3" 
              bg-color="bg-amber-500"
              :icon="PendingIcon"
            />
            <StatCard 
              title="Completed Reviews" 
              :count="completedReviewsCount" 
              change="+8" 
              bg-color="bg-emerald-500"
              :icon="CompletedIcon"
            />
            <StatCard 
              title="Active Moderators" 
              :count="activeModeratorsCount" 
              change="+2" 
              bg-color="bg-blue-500"
              :icon="ModeratorIcon"
            />
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column (Chart) -->
            <div class="lg:col-span-2 space-y-6">
              <DashboardChart 
                title="Assessment Statistics" 
                :labels="chartLabels" 
                :datasets="chartDatasets"
              />
            </div>
            
            <!-- Right Column (Recent Assessments) -->
            <div class="space-y-6">
              <AssessmentTable 
                title="Recent Assessments" 
                :assessments="recentAssessments" 
                :show-pagination="false"
                :show-add-button="false"
                @view-assessment="viewAssessment"
              />
            </div>
          </div>
        </div>
        
        <!-- User Management Section -->
        <div v-if="activeSection === 'users'" class="space-y-6">
          <h1 class="text-2xl font-semibold text-gray-900">User Management</h1>
          
          <!-- User Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Users" 
              :count="totalUsersCount" 
              change="+5" 
              bg-color="bg-indigo-500"
              :icon="ModeratorIcon"
            />
            <StatCard 
              title="Active Users" 
              :count="activeUsersCount" 
              change="+3" 
              bg-color="bg-emerald-500"
              :icon="CompletedIcon"
            />
            <StatCard 
              title="Pending Approval" 
              :count="pendingUsersCount" 
              change="+2" 
              bg-color="bg-amber-500"
              :icon="PendingIcon"
            />
          </div>
          
          <!-- User Management Component -->
          <UserManagement 
            :users="users" 
            :pending-users="pendingUsers" 
            :active-users="activeUsers" 
            :current-page="currentPage"
            :page-size="pageSize"
            @approve-user="approveUser"
            @reject-user="rejectUser"
            @update-role="updateUserRole"
            @page-change="handlePageChange"
          />
        </div>
        
        <!-- Assessments Section -->
        <div v-if="activeSection === 'assessments'" class="space-y-6">
          <h1 class="text-2xl font-semibold text-gray-900">Assessments</h1>
          
          <!-- Assessment Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Assessments" 
              :count="assessmentsCount" 
              change="+12" 
              bg-color="bg-indigo-500"
              :icon="AssessmentIcon"
            />
            <StatCard 
              title="Pending Moderation" 
              :count="pendingModerationCount" 
              change="+3" 
              bg-color="bg-amber-500"
              :icon="PendingIcon"
            />
            <StatCard 
              title="Completed Reviews" 
              :count="completedReviewsCount" 
              change="+8" 
              bg-color="bg-emerald-500"
              :icon="CompletedIcon"
            />
          </div>
          
          <!-- Assessments Table -->
          <AssessmentTable 
            title="All Assessments" 
            :assessments="assessments" 
            :total-count="assessmentsCount"
            :current-page="currentPage"
            :page-size="pageSize"
            @view-assessment="viewAssessment"
            @add-assessment="addAssessment"
            @page-change="handlePageChange"
          />
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
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

// Import components
import Sidebar from '@/components/layout/Sidebar.vue';
import StatCard from '@/components/shared/StatCard.vue';
import DashboardChart from '@/components/shared/DashboardChart.vue';
import AssessmentTable from '@/components/shared/AssessmentTable.vue';
import UserManagement from '@/components/admin/UserManagement.vue';

// Icons for stat cards
const AssessmentIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  `
};

const PendingIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
};

const CompletedIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export default {
  name: 'AdminDashboardView',
  components: {
    Sidebar,
    StatCard,
    DashboardChart,
    AssessmentTable,
    UserManagement,
    AssessmentIcon,
    PendingIcon,
    CompletedIcon,
    ModeratorIcon
  },
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const functions = getFunctions();
    const toast = useToast();
    
    // State
    const user = ref(null);
    const loading = ref(true);
    const mobileMenuOpen = ref(false);
    const activeSection = ref('dashboard');
    const currentPage = ref(1);
    const pageSize = ref(10);
    
    // Data
    const users = ref([]);
    const pendingUsers = ref([]);
    const activeUsers = ref([]);
    const assessments = ref([]);
    const recentAssessments = ref([]);

    // Computed values
    const pendingUsersCount = computed(() => pendingUsers.value.length);
    const activeUsersCount = computed(() => activeUsers.value.length);
    const assessmentsCount = computed(() => assessments.value.length);
    const totalUsersCount = computed(() => users.value.length);
    const pendingModerationCount = computed(() => 10); // This would come from the backend
    const completedReviewsCount = computed(() => 40); // This would come from the backend
    const activeModeratorsCount = computed(() => 12); // This would come from the backend
    
    // Chart data
    const chartLabels = ref(['Total Assessments', 'Pending Moderation', 'Completed Reviews', 'Active Moderators']);
    const chartDatasets = ref([
      {
        label: '2023',
        backgroundColor: '#8B5CF6', // Purple color
        data: [66, 10, 40, 12]
      }
    ]);

    // Initialize Firebase auth persistence to LOCAL to keep the user logged in
    onMounted(async () => {
      // Set persistence to LOCAL (persists even when browser is closed)
      try {
        const { setPersistence, browserLocalPersistence } = await import('firebase/auth');
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('Error setting persistence:', error);
      }

      // Check if user is authenticated and is an admin
      loading.value = true;
      
      // Use a promise to handle the initial auth state
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          // In a real app, we would check if the user is an admin here
          // by fetching their custom claims or checking their role in Firestore
          user.value = {
            ...firebaseUser,
            role: 'admin' // Hardcoded for now, would come from custom claims or Firestore
          };
          await loadData();
        } else {
          // Only redirect to login if we're sure the user is not authenticated
          // This prevents flashing to login during the initial auth check
          const currentUser = auth.currentUser;
          if (!currentUser) {
            router.push('/login');
          }
        }
        loading.value = false;
      });

      // Clean up the listener when component is unmounted
      return () => unsubscribe();
    });

    const loadData = async () => {
      loading.value = true;
      try {
        // Load all users
        const getUsers = httpsCallable(functions, 'getUsers');
        const usersResult = await getUsers({});
        users.value = usersResult.data?.users || [];
        
        // Filter users by approval status
        pendingUsers.value = users.value.filter(user => !user.approved);
        activeUsers.value = users.value.filter(user => user.approved);

        // Load all assessments
        const getAssessments = httpsCallable(functions, 'getAssessments');
        const assessmentsResult = await getAssessments({});
        assessments.value = assessmentsResult.data?.assessments || [];
        
        // Get recent assessments for the dashboard
        recentAssessments.value = [...assessments.value]
          .sort((a, b) => {
            // Sort by creation date, newest first
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
            return dateB - dateA;
          })
          .slice(0, 5); // Get top 5 most recent
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        loading.value = false;
      }
    };

    const approveUser = async (userId) => {
      try {
        loading.value = true;
        const approveUserFunc = httpsCallable(functions, 'approveUser');
        await approveUserFunc({ userId, approved: true });
        
        // Refresh the user lists
        await loadData();
        toast.success('User approved successfully');
      } catch (error) {
        console.error('Error approving user:', error);
        toast.error('Failed to approve user. Please try again.');
      } finally {
        loading.value = false;
      }
    };
    
    const rejectUser = async (userId) => {
      try {
        loading.value = true;
        const approveUserFunc = httpsCallable(functions, 'approveUser');
        await approveUserFunc({ userId, approved: false });
        
        // Refresh the user lists
        await loadData();
        toast.success('User rejected successfully');
      } catch (error) {
        console.error('Error rejecting user:', error);
        toast.error('Failed to reject user. Please try again.');
      } finally {
        loading.value = false;
      }
    };
    
    const updateUserRole = async ({ userId, role }) => {
      try {
        loading.value = true;
        const updateRoleFunc = httpsCallable(functions, 'updateUserRole');
        await updateRoleFunc({ userId, role });
        
        // Refresh the user lists
        await loadData();
        toast.success(`User role updated to ${role}`);
      } catch (error) {
        console.error('Error updating user role:', error);
        toast.error('Failed to update user role. Please try again.');
      } finally {
        loading.value = false;
      }
    };

    const logout = async () => {
      try {
        await signOut(auth);
        // Navigate to the root path which is mapped to the login view
        router.push('/');
        toast.info('You have been logged out');
      } catch (error) {
        console.error('Error signing out:', error);
        toast.error('Failed to log out. Please try again.');
      }
    };
    
    const handleNavChange = (sectionId) => {
      activeSection.value = sectionId;
    };
    
    const handlePageChange = (page) => {
      currentPage.value = page;
      // In a real app, we would fetch the data for the new page here
    };
    
    const viewAssessment = (assessmentId) => {
      router.push(`/assessment/${assessmentId}`);
    };
    
    const addAssessment = () => {
      router.push('/assessment/new');
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      // Handle Firestore timestamps
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    return {
      user,
      loading,
      mobileMenuOpen,
      activeSection,
      users,
      pendingUsers,
      activeUsers,
      assessments,
      recentAssessments,
      pendingUsersCount,
      activeUsersCount,
      assessmentsCount,
      totalUsersCount,
      pendingModerationCount,
      completedReviewsCount,
      activeModeratorsCount,
      chartLabels,
      chartDatasets,
      currentPage,
      pageSize,
      approveUser,
      rejectUser,
      updateUserRole,
      logout,
      formatDate,
      handleNavChange,
      handlePageChange,
      viewAssessment,
      addAssessment,
      // Icons
      AssessmentIcon,
      PendingIcon,
      CompletedIcon,
      ModeratorIcon
    };
  }
};
</script>
