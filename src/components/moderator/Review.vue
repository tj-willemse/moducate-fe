<template>
    <div class="space-y-6">
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
          </div>
          <div class="relative">
            <input 
              type="text" 
              v-model="filters.search" 
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
      </div>
      
      <!-- Pending Assessments Section -->
      <div v-if="filteredAssessments.length > 0" class="space-y-6">
        <div v-for="assessment in filteredAssessments" :key="assessment.id" class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">{{ assessment.title }}</h3>
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
            </div>
            
            <div class="mt-2 text-sm text-gray-500">
              <p><span class="font-medium">Subject:</span> {{ assessment.subject || 'Not specified' }}</p>
              <p><span class="font-medium">Created by:</span> {{ assessment.createdByName || 'Unknown' }}</p>
              <p><span class="font-medium">Submission date:</span> {{ formatDate(assessment.createdAt) }}</p>
            </div>
            
            <div class="mt-4 border-t border-gray-200 pt-4">
              <p class="text-sm text-gray-700">{{ truncateDescription(assessment.description) }}</p>
            </div>
            
            <div class="mt-6 flex items-center justify-between">
              <button 
                @click="viewAssessment(assessment.id)" 
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Details
              </button>
              
              <div v-if="assessment.status === 'pending'" class="flex space-x-3">
                <button 
                  @click="moderateAssessment(assessment.id, 'approved')" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Approve
                </button>
                <button 
                  @click="moderateAssessment(assessment.id, 'rejected')" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg shadow">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No assessments found</h3>
        <p class="mt-1 text-sm text-gray-500">No assessments match your current filters.</p>
      </div>
      
      <!-- Pagination -->
      <div v-if="filteredAssessments.length > 0" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
        <div class="flex flex-1 justify-between sm:hidden">
          <button 
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(endIndex, filteredAssessments.length) }}</span>
              of
              <span class="font-medium">{{ filteredAssessments.length }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                :disabled="currentPage === 1"
                @click="currentPage = 1"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">First</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                :disabled="currentPage === 1"
                @click="currentPage--"
                class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </button>
              <!-- Page numbers -->
              <template v-for="page in displayedPages" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="currentPage = page"
                  :class="[
                    currentPage === page ? 'bg-indigo-600 text-white' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  ]"
                >
                  {{ page }}
                </button>
                <span
                  v-else
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                >
                  ...
                </span>
              </template>
              <button
                :disabled="currentPage === totalPages"
                @click="currentPage++"
                class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                :disabled="currentPage === totalPages"
                @click="currentPage = totalPages"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Last</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { doc, updateDoc } from 'firebase/firestore';
  import { db } from '@/firebase/config';
  import { useToast } from 'vue-toastification';
  
  export default {
    name: 'ModeratorReview',
    props: {
      assessments: {
        type: Array,
        default: () => []
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      const router = useRouter();
      const toast = useToast();
      
      // Pagination
      const currentPage = ref(1);
      const pageSize = ref(5);
      
      // Filters
      const filters = ref({
        status: 'pending',
        dateRange: 'all',
        search: ''
      });
      
      // Reset to page 1 when filters change
      watch(filters, () => {
        currentPage.value = 1;
      }, { deep: true });
      
      // Filter assessments based on filters
      const filteredAssessments = computed(() => {
        let result = [...props.assessments];
        
        // Filter by status
        if (filters.value.status !== 'all') {
          result = result.filter(a => a.status === filters.value.status);
        }
        
        // Filter by date range
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
        
        // Filter by search term
        if (filters.value.search) {
          const searchTerm = filters.value.search.toLowerCase();
          result = result.filter(a => {
            return (
              (a.title && a.title.toLowerCase().includes(searchTerm)) ||
              (a.description && a.description.toLowerCase().includes(searchTerm)) ||
              (a.subject && a.subject.toLowerCase().includes(searchTerm)) ||
              (a.createdByName && a.createdByName.toLowerCase().includes(searchTerm))
            );
          });
        }
        
        // Sort by creation date, newest first
        return result.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      });
      
      // Pagination calculations
      const totalPages = computed(() => {
        return Math.max(1, Math.ceil(filteredAssessments.value.length / pageSize.value));
      });
      
      const startIndex = computed(() => {
        return (currentPage.value - 1) * pageSize.value;
      });
      
      const endIndex = computed(() => {
        return startIndex.value + pageSize.value;
      });
      
      const paginatedAssessments = computed(() => {
        return filteredAssessments.value.slice(startIndex.value, endIndex.value);
      });
      
      // Generate array of page numbers to display
      const displayedPages = computed(() => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages.value <= maxPagesToShow) {
          // Show all pages
          for (let i = 1; i <= totalPages.value; i++) {
            pages.push(i);
          }
        } else {
          // Always show first page
          pages.push(1);
          
          // Calculate start and end of middle pages
          let startPage = Math.max(2, currentPage.value - 1);
          let endPage = Math.min(totalPages.value - 1, currentPage.value + 1);
          
          // Adjust if at the beginning
          if (currentPage.value <= 3) {
            endPage = 4;
          }
          
          // Adjust if at the end
          if (currentPage.value >= totalPages.value - 2) {
            startPage = totalPages.value - 3;
          }
          
          // Add ellipsis after first page if needed
          if (startPage > 2) {
            pages.push('...');
          }
          
          // Add middle pages
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }
          
          // Add ellipsis before last page if needed
          if (endPage < totalPages.value - 1) {
            pages.push('...');
          }
          
          // Always show last page
          pages.push(totalPages.value);
        }
        
        return pages;
      });
      
      // View assessment details
      const viewAssessment = (assessmentId) => {
        router.push(`/assessment/${assessmentId}`);
      };
      
      // Moderate assessment (approve/reject)
      const moderateAssessment = async (assessmentId, status) => {
        try {
          // Update assessment in Firestore
          const assessmentRef = doc(db, 'assessments', assessmentId);
          await updateDoc(assessmentRef, {
            status: status,
            moderatedAt: new Date(),
            moderatedBy: 'currentUserId', // This should be replaced with the actual user ID
            updatedAt: new Date()
          });
          
          // Show success message
          toast.success(`Assessment ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
          
          // Emit event to parent component to refresh data
          emit('assessment-moderated', { id: assessmentId, status });
        } catch (error) {
          console.error('Error moderating assessment:', error);
          toast.error('Failed to moderate assessment. Please try again.');
        }
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
      
      // Truncate description
      const truncateDescription = (text) => {
        if (!text) return '';
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
      };
      
      return {
        filters,
        currentPage,
        pageSize,
        filteredAssessments,
        paginatedAssessments,
        totalPages,
        startIndex,
        endIndex,
        displayedPages,
        viewAssessment,
        moderateAssessment,
        formatDate,
        formatStatus,
        truncateDescription
      };
    }
  };
  </script>