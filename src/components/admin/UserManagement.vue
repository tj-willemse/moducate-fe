<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <div class="flex justify-between items-center p-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">User Management</h3>
      <div class="flex space-x-2">
        <div class="relative">
          <input
            type="text"
            placeholder="Search users..."
            class="px-3 py-1 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            v-model="searchQuery"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
          v-model="filterRole"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="lecturer">Lecturer</option>
        </select>
        <select
          v-model="filterStatus"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredUsers.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              No users found
            </td>
          </tr>
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                  {{ getUserInitials(user.fullName) }}
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                  user.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 
                  'bg-green-100 text-green-800'
                ]"
              >
                {{ capitalizeFirstLetter(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ user.approved ? 'Approved' : 'Pending' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button 
                  v-if="!user.approved"
                  @click="approveUser(user.id)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Approve
                </button>
                <button 
                  v-if="!user.approved"
                  @click="rejectUser(user.id)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reject
                </button>
                <button 
                  v-if="user.role !== 'admin'"
                  @click="openEditRoleModal(user)"
                  class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Role
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button 
          @click="$emit('page-change', currentPage - 1)" 
          :disabled="currentPage === 1"
          :class="[
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white'
          ]"
        >
          Previous
        </button>
        <button 
          @click="$emit('page-change', currentPage + 1)" 
          :disabled="currentPage === totalPages"
          :class="[
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
            'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white'
          ]"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ startItem }}</span> to <span class="font-medium">{{ endItem }}</span> of <span class="font-medium">{{ totalCount }}</span> results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button 
              @click="$emit('page-change', currentPage - 1)" 
              :disabled="currentPage === 1"
              :class="[
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500'
              ]"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <template v-for="page in paginationRange" :key="page">
              <button 
                @click="$emit('page-change', page)" 
                :class="[
                  page === currentPage 
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ page }}
              </button>
            </template>
            
            <button 
              @click="$emit('page-change', currentPage + 1)" 
              :disabled="currentPage === totalPages"
              :class="[
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500'
              ]"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
    
    <!-- Edit Role Modal -->
    <div v-if="showEditRoleModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showEditRoleModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Edit User Role
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Change the role for {{ selectedUser?.fullName || 'User' }}
                  </p>
                  <div class="mt-4">
                    <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      id="role"
                      v-model="selectedRole"
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="moderator">Moderator</option>
                      <option value="lecturer">Lecturer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="updateUserRole"
            >
              Save
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showEditRoleModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'UserManagement',
  props: {
    users: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    totalCount: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  emits: ['approve-user', 'reject-user', 'update-role', 'page-change'],
  setup(props, { emit }) {
    const toast = useToast();
    const searchQuery = ref('');
    const filterRole = ref('all');
    const filterStatus = ref('all');
    const showEditRoleModal = ref(false);
    const selectedUser = ref(null);
    const selectedRole = ref('');

    const filteredUsers = computed(() => {
      return props.users.filter(user => {
        // Search filter
        const searchMatch = 
          searchQuery.value === '' || 
          user.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
        
        // Role filter
        const roleMatch = 
          filterRole.value === 'all' || 
          user.role === filterRole.value;
        
        // Status filter
        const statusMatch = 
          filterStatus.value === 'all' || 
          (filterStatus.value === 'approved' && user.approved) || 
          (filterStatus.value === 'pending' && !user.approved);
        
        return searchMatch && roleMatch && statusMatch;
      });
    });

    const totalPages = computed(() => {
      return Math.ceil(props.totalCount / props.pageSize);
    });

    const startItem = computed(() => {
      return (props.currentPage - 1) * props.pageSize + 1;
    });

    const endItem = computed(() => {
      return Math.min(props.currentPage * props.pageSize, props.totalCount);
    });

    // Generate pagination range with ellipsis
    const paginationRange = computed(() => {
      const range = [];
      const maxPagesToShow = 5;
      
      if (totalPages.value <= maxPagesToShow) {
        // Show all pages if there are few
        for (let i = 1; i <= totalPages.value; i++) {
          range.push(i);
        }
      } else {
        // Always show first page
        range.push(1);
        
        // Calculate start and end of range around current page
        let start = Math.max(2, props.currentPage - 1);
        let end = Math.min(totalPages.value - 1, props.currentPage + 1);
        
        // Adjust if at the beginning
        if (props.currentPage <= 3) {
          end = 4;
        }
        
        // Adjust if at the end
        if (props.currentPage >= totalPages.value - 2) {
          start = totalPages.value - 3;
        }
        
        // Add ellipsis at the beginning if needed
        if (start > 2) {
          range.push('...');
        }
        
        // Add pages in the middle
        for (let i = start; i <= end; i++) {
          range.push(i);
        }
        
        // Add ellipsis at the end if needed
        if (end < totalPages.value - 1) {
          range.push('...');
        }
        
        // Always show last page
        range.push(totalPages.value);
      }
      
      return range;
    });

    const getUserInitials = (fullName) => {
      if (!fullName) return 'U';
      return fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    };

    const formatDate = (date) => {
      if (!date) return 'N/A';
      
      // Handle different date formats
      const dateObj = date instanceof Date ? date : 
                     date.toDate ? date.toDate() : 
                     new Date(date);
      
      // Format as "Apr 20, 2023"
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const capitalizeFirstLetter = (string) => {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const approveUser = (userId) => {
      emit('approve-user', userId);
      toast.success('User approved successfully');
    };

    const rejectUser = (userId) => {
      emit('reject-user', userId);
      toast.success('User rejected successfully');
    };

    const openEditRoleModal = (user) => {
      selectedUser.value = user;
      selectedRole.value = user.role;
      showEditRoleModal.value = true;
    };

    const updateUserRole = () => {
      if (!selectedUser.value) return;
      
      emit('update-role', {
        userId: selectedUser.value.id,
        role: selectedRole.value
      });
      
      toast.success(`User role updated to ${capitalizeFirstLetter(selectedRole.value)}`);
      showEditRoleModal.value = false;
    };

    return {
      searchQuery,
      filterRole,
      filterStatus,
      filteredUsers,
      showEditRoleModal,
      selectedUser,
      selectedRole,
      totalPages,
      startItem,
      endItem,
      paginationRange,
      getUserInitials,
      formatDate,
      capitalizeFirstLetter,
      approveUser,
      rejectUser,
      openEditRoleModal,
      updateUserRole
    };
  }
};
</script>
