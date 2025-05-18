<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <div class="flex justify-between items-center p-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <button 
        v-if="showAddButton"
        @click="$emit('add-assessment')" 
        class="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Add
      </button>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assessment Title
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uploaded By
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Upload Date
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
          <tr v-else-if="assessments.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              No assessments found
            </td>
          </tr>
          <tr v-for="assessment in assessments" :key="assessment.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 bg-gray-100 rounded-full px-3 py-1 inline-block">
                {{ assessment.subject }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ assessment.title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ assessment.uploadedBy }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatDate(assessment.uploadDate) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="$emit('view-assessment', assessment.id)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-500 hover:bg-indigo-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div v-if="showPagination" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'AssessmentTable',
  props: {
    title: {
      type: String,
      default: 'Assessment Oversight'
    },
    assessments: {
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
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    }
  },
  emits: ['view-assessment', 'add-assessment', 'page-change'],
  setup(props) {
    const formatDate = (date) => {
      if (!date) return 'N/A';
      
      // Handle different date formats
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Format as "Apr 20, 2023"
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

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

    return {
      formatDate,
      totalPages,
      startItem,
      endItem,
      paginationRange
    };
  }
};
</script>
