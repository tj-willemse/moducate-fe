<template>
    <div class="space-y-6">
      <!-- Actions Bar -->
      <div class="flex justify-between items-center">
        <div class="flex-1">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search assessments..." 
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div class="ml-4">
          <button 
            @click="showCreateModal = true" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Assessment
          </button>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div class="flex items-center space-x-4">
            <div>
              <label for="status-filter" class="block text-sm font-medium text-gray-700">Status</label>
              <select 
                id="status-filter" 
                v-model="filters.status" 
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label for="date-filter" class="block text-sm font-medium text-gray-700">Date Range</label>
              <select 
                id="date-filter" 
                v-model="filters.dateRange" 
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <label for="subject-filter" class="block text-sm font-medium text-gray-700">Subject</label>
              <select 
                id="subject-filter" 
                v-model="filters.subject" 
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Subjects</option>
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredAssessments.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No assessments found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new assessment.</p>
        <div class="mt-6">
          <button 
            @click="showCreateModal = true" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Assessment
          </button>
        </div>
      </div>
      
      <!-- Assessment List -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="assessment in filteredAssessments" :key="assessment.id">
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">{{ assessment.title }}</h3>
                    <div class="text-sm text-gray-500">
                      <span class="font-medium">Subject:</span> {{ getSubjectName(assessment.subjectId) }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <span 
                    :class="{
                      'bg-yellow-100 text-yellow-800': assessment.status === 'pending',
                      'bg-green-100 text-green-800': assessment.status === 'approved',
                      'bg-red-100 text-red-800': assessment.status === 'rejected'
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ formatStatus(assessment.status) }}
                  </span>
                  <div class="ml-4">
                    <button 
                      @click="viewAssessment(assessment.id)" 
                      class="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-2 text-sm text-gray-500">
                <p class="line-clamp-2">{{ assessment.description }}</p>
              </div>
              <div class="mt-2 text-sm text-gray-500">
                <p>Created: {{ formatDate(assessment.createdAt) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Create Assessment Modal Placeholder -->
      <!-- In a real implementation, this would be a full modal with form fields -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-lg w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Assessment</h3>
          <p class="text-sm text-gray-500 mb-4">This is a placeholder for the assessment creation form.</p>
          <div class="flex justify-end">
            <button 
              @click="showCreateModal = false" 
              class="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button 
              @click="showCreateModal = false" 
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'LecturerAssessments',
    props: {
      assessments: {
        type: Array,
        default: () => []
      },
      subjects: {
        type: Array,
        default: () => []
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const router = useRouter();
      
      // State
      const searchQuery = ref('');
      const showCreateModal = ref(false);
      
      // Filters
      const filters = ref({
        status: 'all',
        dateRange: 'all',
        subject: 'all'
      });
      
      // Filtered assessments
      const filteredAssessments = computed(() => {
        let result = [...props.assessments];
        
        // Search filter
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          result = result.filter(a => {
            return (
              (a.title && a.title.toLowerCase().includes(query)) ||
              (a.description && a.description.toLowerCase().includes(query))
            );
          });
        }
        
        // Status filter
        if (filters.value.status !== 'all') {
          result = result.filter(a => a.status === filters.value.status);
        }
        
        // Subject filter
        if (filters.value.subject !== 'all') {
          result = result.filter(a => a.subjectId === filters.value.subject);
        }
        
        // Date range filter
        if (filters.value.dateRange !== 'all') {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const thisWeek = new Date(today);
          thisWeek.setDate(today.getDate() - today.getDay());
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          
          result = result.filter(a => {
            const createdAt = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
            
            if (filters.value.dateRange === 'today') {
              return createdAt >= today;
            } else if (filters.value.dateRange === 'week') {
              return createdAt >= thisWeek;
            } else if (filters.value.dateRange === 'month') {
              return createdAt >= thisMonth;
            }
            return true;
          });
        }
        
        // Sort by creation date, newest first
        return result.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      });
      
      // View assessment details
      const viewAssessment = (assessmentId) => {
        router.push(`/assessment/${assessmentId}`);
      };
      
      // Format date
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
      
      // Format status
      const formatStatus = (status) => {
        if (status === 'pending') return 'Pending';
        if (status === 'approved') return 'Approved';
        if (status === 'rejected') return 'Rejected';
        return status;
      };
      
      // Get subject name by ID
      const getSubjectName = (subjectId) => {
        const subject = props.subjects.find(s => s.id === subjectId);
        return subject ? subject.name : 'Unknown';
      };
      
      return {
        searchQuery,
        filters,
        filteredAssessments,
        showCreateModal,
        viewAssessment,
        formatDate,
        formatStatus,
        getSubjectName
      };
    }
  };
  </script>
  