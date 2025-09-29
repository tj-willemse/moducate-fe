<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-blue-100 p-3 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 font-medium">Total Assessments</div>
          <div class="text-2xl font-bold">{{ assessmentsCount }}</div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-green-100 p-3 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 font-medium">Approved</div>
          <div class="text-2xl font-bold">{{ approvedCount }}</div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-amber-100 p-3 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 font-medium">Pending</div>
          <div class="text-2xl font-bold">{{ pendingCount }}</div>
        </div>
      </div>
    </div>
    
    <!-- Recent Assessments -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Recent Assessments</h3>
      </div>
      
      <div v-if="loading" class="flex justify-center p-6">
        <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="recentAssessments.length === 0" class="p-6 text-center text-gray-500">
        No assessments created yet.
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="assessment in recentAssessments" :key="assessment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ assessment.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ assessment.subject }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    assessment.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    assessment.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-amber-100 text-amber-800'
                  ]"
                >
                  {{ capitalizeFirstLetter(assessment.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(assessment.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'LecturerDashboard',
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
  setup(props) {
    const assessmentsCount = computed(() => props.assessments.length);
    
    const approvedCount = computed(() => 
      props.assessments.filter(a => a.status === 'approved').length
    );
    
    const pendingCount = computed(() => 
      props.assessments.filter(a => a.status === 'pending').length
    );
    
    const recentAssessments = computed(() => {
      return [...props.assessments]
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 5); // Get top 5 most recent
    });
    
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
    
    const capitalizeFirstLetter = (string) => {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    
    return {
      assessmentsCount,
      approvedCount,
      pendingCount,
      recentAssessments,
      formatDate,
      capitalizeFirstLetter
    };
  }
};
</script>