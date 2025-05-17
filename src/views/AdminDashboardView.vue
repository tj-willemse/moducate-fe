<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Moducate Admin Dashboard</h1>
        <div class="flex items-center space-x-4">
          <span class="text-gray-700">{{ user?.displayName || 'Admin' }}</span>
          <button 
            @click="logout" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Pending Users</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ pendingUsersCount }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ activeUsersCount }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Assessments</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ assessmentsCount }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            @click="activeTab = 'users'"
            :class="[
              activeTab === 'users' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Users
          </button>
          <button 
            @click="activeTab = 'assessments'"
            :class="[
              activeTab === 'assessments' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Assessments
          </button>
        </nav>
      </div>

      <!-- Users Tab Content -->
      <div v-if="activeTab === 'users'" class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Pending User Approvals</h3>
          
          <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
          
          <div v-else-if="pendingUsers.length === 0" class="text-center py-4 text-gray-500">
            No pending users to approve
          </div>
          
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="user in pendingUsers" :key="user.id" class="py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ user.displayName }}</h4>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                  <p class="text-xs text-gray-400">Role: {{ user.role }}</p>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="approveUser(user.id, true)"
                    class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Approve
                  </button>
                  <button 
                    @click="approveUser(user.id, false)"
                    class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Assessments Tab Content -->
      <div v-if="activeTab === 'assessments'" class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Assessments</h3>
          
          <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
          
          <div v-else-if="assessments.length === 0" class="text-center py-4 text-gray-500">
            No assessments found
          </div>
          
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="assessment in assessments" :key="assessment.id" class="py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ assessment.title }}</h4>
                  <p class="text-sm text-gray-500">Status: {{ assessment.status }}</p>
                  <p class="text-xs text-gray-400">Created: {{ formatDate(assessment.createdAt) }}</p>
                </div>
                <div>
                  <button 
                    class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useRouter } from 'vue-router';

export default {
  name: 'AdminDashboardView',
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const functions = getFunctions();
    
    const user = ref(null);
    const loading = ref(true);
    const activeTab = ref('users');
    const pendingUsers = ref([]);
    const activeUsers = ref([]);
    const assessments = ref([]);

    const pendingUsersCount = computed(() => pendingUsers.value.length);
    const activeUsersCount = computed(() => activeUsers.value.length);
    const assessmentsCount = computed(() => assessments.value.length);

    onMounted(async () => {
      // Check if user is authenticated and is an admin
      auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser;
          await loadData();
        } else {
          // Redirect to login if not authenticated
          router.push('/login');
        }
      });
    });

    const loadData = async () => {
      loading.value = true;
      try {
        // Load pending users
        const getUsers = httpsCallable(functions, 'getUsers');
        const pendingResult = await getUsers({ approved: false });
        pendingUsers.value = pendingResult.data.users || [];

        // Load active users
        const activeResult = await getUsers({ approved: true });
        activeUsers.value = activeResult.data.users || [];

        // Load assessments
        const getAssessments = httpsCallable(functions, 'getAssessments');
        const assessmentsResult = await getAssessments({});
        assessments.value = assessmentsResult.data.assessments || [];
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        loading.value = false;
      }
    };

    const approveUser = async (userId, approved) => {
      try {
        loading.value = true;
        const approveUserFunc = httpsCallable(functions, 'approveUser');
        await approveUserFunc({ userId, approved });
        
        // Refresh the user lists
        await loadData();
      } catch (error) {
        console.error('Error approving user:', error);
      } finally {
        loading.value = false;
      }
    };

    const logout = async () => {
      try {
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      // Handle Firestore timestamps
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    };

    return {
      user,
      loading,
      activeTab,
      pendingUsers,
      activeUsers,
      assessments,
      pendingUsersCount,
      activeUsersCount,
      assessmentsCount,
      approveUser,
      logout,
      formatDate
    };
  }
};
</script>
