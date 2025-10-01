<template>
  <div class="space-y-6">
    <!-- Header with Semester Selector -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900">My Dashboard</h1>
      
      <!-- Semester Selector -->
      <div class="relative">
        <select 
          v-model="selectedSemester"
          class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="2025-1">2025 - Semester 1</option>
          <option value="2024-2">2024 - Semester 2</option>
          <option value="2024-1">2024 - Semester 1</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Reviews due this week -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Reviews due this week <span class="text-gray-500 text-sm">({{ reviewsDueThisWeek.length }})</span></h2>
      
      <div v-if="reviewsDueThisWeek.length === 0" class="text-center py-8 text-gray-500">
        No reviews due this week
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="review in reviewsDueThisWeek" :key="review.id" class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="flex">
            <div class="bg-cyan-400 text-white p-4 w-1/3 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium mb-1">Subject</div>
                <div class="font-semibold text-sm">{{ review.subject }}</div>
              </div>
            </div>
            <div class="bg-pink-400 text-white p-4 w-1/3 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium mb-1">Assessment name</div>
                <div class="font-semibold text-sm">{{ review.name }}</div>
              </div>
            </div>
            <div class="bg-green-50 p-4 w-1/6 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium text-gray-600 mb-1">Due Date</div>
                <div class="font-semibold text-gray-900 text-xs">{{ review.dueDate }}</div>
              </div>
            </div>
            <div class="bg-gray-50 p-4 w-1/6 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium text-gray-600 mb-1">Status</div>
                <div class="font-semibold text-gray-900 text-xs">{{ review.status }}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-center p-3 bg-gray-50">
            <button 
              @click="startReview(review.id)"
              class="px-6 py-2 bg-green-400 hover:bg-green-500 text-white text-sm font-medium rounded-full transition-colors"
            >
              {{ review.status === 'Not Started' ? 'Start Review now' : 'Continue Review' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Reviews in progress -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Reviews in progress <span class="text-gray-500 text-sm">({{ reviewsInProgress.length }})</span></h2>
      
      <div v-if="reviewsInProgress.length === 0" class="text-center py-8 text-gray-500">
        No reviews in progress
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="review in reviewsInProgress" :key="review.id" class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="flex">
            <div class="bg-cyan-400 text-white p-4 w-1/3 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium mb-1">Subject</div>
                <div class="font-semibold text-sm">{{ review.subject }}</div>
              </div>
            </div>
            <div class="bg-pink-400 text-white p-4 w-1/3 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium mb-1">Assessment name</div>
                <div class="font-semibold text-sm">{{ review.name }}</div>
              </div>
            </div>
            <div class="bg-green-50 p-4 w-1/6 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium text-gray-600 mb-1">Due Date</div>
                <div class="font-semibold text-gray-900 text-xs">{{ review.dueDate }}</div>
              </div>
            </div>
            <div class="bg-gray-50 p-4 w-1/6 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium text-gray-600 mb-1">Last Edited</div>
                <div class="font-semibold text-gray-900 text-xs">{{ review.lastEdited }}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-center p-3 bg-gray-50">
            <button 
              @click="startReview(review.id)"
              class="px-6 py-2 bg-green-400 hover:bg-green-500 text-white text-sm font-medium rounded-full transition-colors"
            >
              Continue Review
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recently assigned reviews -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Recently assigned reviews <span class="text-gray-500 text-sm">({{ recentlyAssigned.length }})</span></h2>
      
      <div v-if="recentlyAssigned.length === 0" class="text-center py-8 text-gray-500">
        No recently assigned reviews
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="review in recentlyAssigned" :key="review.id" class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="flex">
            <div class="bg-cyan-400 text-white p-4 w-1/3 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium mb-1">Subject</div>
                <div class="font-semibold text-sm">{{ review.subject }}</div>
              </div>
            </div>
            <div class="bg-pink-400 text-white p-4 w-1/3 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium mb-1">Assessment name</div>
                <div class="font-semibold text-sm">{{ review.name }}</div>
              </div>
            </div>
            <div class="bg-green-50 p-4 w-1/6 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium text-gray-600 mb-1">Due Date</div>
                <div class="font-semibold text-gray-900 text-xs">{{ review.dueDate }}</div>
              </div>
            </div>
            <div class="bg-gray-50 p-4 w-1/6 flex items-center justify-center">
              <div class="text-center">
                <div class="text-xs font-medium text-gray-600 mb-1">Last Edited</div>
                <div class="font-semibold text-gray-900 text-xs">{{ review.lastEdited }}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-center p-3 bg-gray-50">
            <button 
              @click="startReview(review.id)"
              class="px-6 py-2 bg-green-400 hover:bg-green-500 text-white text-sm font-medium rounded-full transition-colors"
            >
              Start Review
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Review Assessment Modal -->
    <SlideModal :show="showReviewModal" title="View Assessment" @close="closeReviewModal">
      <div v-if="selectedReview" class="space-y-4">
        <!-- Subject Title -->
        <div class="bg-cyan-400 text-white p-4 rounded-lg">
          <div class="text-xs font-medium mb-1">Subject Title</div>
          <div class="font-semibold">{{ selectedReview.subject }}</div>
        </div>
        
        <!-- Assessment Title -->
        <div class="bg-pink-400 text-white p-4 rounded-lg">
          <div class="text-xs font-medium mb-1">Assessment Title</div>
          <div class="font-semibold">{{ selectedReview.name }}</div>
        </div>
        
        <!-- Assessment Document Preview -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-gray-700 mb-3">Assessment Document preview</div>
          <div class="border-2 border-gray-300 rounded-lg overflow-hidden bg-white" style="height: 600px;">
            <iframe 
              v-if="selectedReview.fileUrl"
              :src="`https://docs.google.com/viewer?url=${encodeURIComponent(selectedReview.fileUrl)}&embedded=true`"
              class="w-full h-full"
              frameborder="0"
              allow="autoplay"
            ></iframe>
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No document available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal Footer -->
      <template #footer>
        <div class="flex gap-3">
          <button 
            @click="closeReviewModal"
            class="flex-1 px-6 py-3 bg-red-300 hover:bg-red-400 text-gray-900 font-medium rounded-full transition-colors"
          >
            Close
          </button>
        </div>
      </template>
    </SlideModal>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import SlideModal from '@/components/shared/SlideModal.vue';

export default {
  name: 'ModeratorDashboard',
  components: {
    SlideModal
  },
  props: {
    assessments: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const router = useRouter();
    const selectedSemester = ref('2025-1');
    const showReviewModal = ref(false);
    const selectedReview = ref(null);
    
    // Computed: Reviews due this week (assigned but not started or in progress, with due date within 7 days)
    const reviewsDueThisWeek = computed(() => {
      const now = new Date();
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      return props.assessments
        .filter(a => {
          const dueDate = a.dueDate ? new Date(a.dueDate) : null;
          return dueDate && dueDate <= oneWeekFromNow && dueDate >= now && 
                 (a.reviewStatus === 'not_started' || !a.reviewStatus);
        })
        .map(a => ({
          id: a.id,
          subject: a.subject || 'Unknown Subject',
          name: a.title || a.fileName || 'Untitled',
          dueDate: formatDate(a.dueDate),
          status: a.reviewStatus === 'in_progress' ? 'In Progress' : 'Not Started'
        }));
    });
    
    // Computed: Reviews in progress (assessments being actively reviewed)
    const reviewsInProgress = computed(() => {
      return props.assessments
        .filter(a => a.reviewStatus === 'in_progress')
        .map(a => ({
          id: a.id,
          subject: a.subject || 'Unknown Subject',
          name: a.title || a.fileName || 'Untitled',
          dueDate: formatDate(a.dueDate),
          lastEdited: formatDate(a.lastEditedAt || a.updatedAt)
        }));
    });
    
    // Computed: Recently assigned reviews (newest assignments, not yet started)
    const recentlyAssigned = computed(() => {
      return props.assessments
        .filter(a => !a.reviewStatus || a.reviewStatus === 'not_started')
        .sort((a, b) => {
          const dateA = a.assignedAt?.toDate?.() || new Date(a.assignedAt || 0);
          const dateB = b.assignedAt?.toDate?.() || new Date(b.assignedAt || 0);
          return dateB - dateA;
        })
        .slice(0, 10)
        .map(a => ({
          id: a.id,
          subject: a.subject || 'Unknown Subject',
          name: a.title || a.fileName || 'Untitled',
          dueDate: formatDate(a.dueDate),
          lastEdited: formatDate(a.assignedAt || a.createdAt)
        }));
    });
    
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    };
    
    const startReview = (reviewId) => {
      // Find the assessment in props.assessments
      const assessment = props.assessments.find(a => a.id === reviewId);
      if (assessment) {
        selectedReview.value = {
          id: assessment.id,
          subject: assessment.subject || 'Unknown Subject',
          name: assessment.title || assessment.fileName || 'Untitled',
          fileUrl: assessment.fileUrl
        };
        showReviewModal.value = true;
      }
    };
    
    const closeReviewModal = () => {
      showReviewModal.value = false;
      selectedReview.value = null;
    };

    return {
      selectedSemester,
      reviewsDueThisWeek,
      reviewsInProgress,
      recentlyAssigned,
      showReviewModal,
      selectedReview,
      startReview,
      closeReviewModal
    };
  }
};
</script>