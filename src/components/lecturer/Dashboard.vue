<template>
  <div class="space-y-6">
    <!-- Dashboard Header with Semester Selector -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-semibold text-gray-900">My Dashboard</h1>
      
      <!-- Semester Selector -->
      <div class="relative">
        <select 
          v-model="selectedSemester" 
          @change="handleSemesterChange"
          class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
        >
          <option v-for="semester in semesters" :key="semester.value" :value="semester.value">
            {{ semester.label }}
          </option>
        </select>
        <!-- Dropdown Icon -->
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
    
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
    
    <!-- Quick Upload Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Upload</h2>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Subject Selector -->
        <div class="flex-1">
          <label class="block text-xs font-medium text-white bg-cyan-400 px-4 py-2 rounded-t-lg">Subject</label>
          <select 
            v-model="selectedSubject"
            class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-cyan-50"
          >
            <option value="">Select subject</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        
        <!-- Type Selector -->
        <div class="flex-1">
          <label class="block text-xs font-medium text-white bg-pink-400 px-4 py-2 rounded-t-lg">Type</label>
          <select 
            v-model="selectedType"
            class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-pink-50"
          >
            <option value="">Select Type</option>
            <option value="exam">Exam</option>
            <option value="test">Test</option>
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>
        
        <!-- Upload Document -->
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-700 px-4 py-2">Upload document</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer">
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileSelect"
              accept=".pdf"
              class="hidden"
            />
            <button 
              @click="$refs.fileInput.click()"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="text-sm">{{ selectedFile ? selectedFile.name : 'Choose file' }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Submit Button -->
      <div class="mt-4">
        <button 
          @click="handleSubmitAssessment"
          :disabled="!canSubmit || uploading"
          class="px-6 py-2 bg-green-400 hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors flex items-center gap-2"
        >
          <svg v-if="uploading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ uploading ? 'Uploading...' : 'Submit Assessment' }}</span>
        </button>
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
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default {
  name: 'LecturerDashboard',
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
  setup(props, { emit }) {
    const toast = useToast();
    const auth = getAuth();
    const storage = getStorage();
    
    // Semester state
    const selectedSemester = ref('2025-1');
    const semesters = ref([
      { value: '2025-1', label: '2025 - Semester 1' },
      { value: '2024-2', label: '2024 - Semester 2' },
      { value: '2024-1', label: '2024 - Semester 1' }
    ]);
    
    // Quick Upload state
    const selectedSubject = ref('');
    const selectedType = ref('');
    const selectedFile = ref(null);
    const fileInput = ref(null);
    
    const canSubmit = computed(() => {
      return selectedSubject.value && selectedType.value && selectedFile.value;
    });
    
    const handleSemesterChange = () => {
      const semester = semesters.value.find(s => s.value === selectedSemester.value);
      toast.info(`Switched to ${semester?.label}`);
    };
    
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error('File size must be less than 10MB');
          return;
        }
        selectedFile.value = file;
      }
    };
    
    const uploading = ref(false);
    
    const handleSubmitAssessment = async () => {
      if (!canSubmit.value) {
        toast.error('Please fill in all fields');
        return;
      }
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error('You must be logged in to upload assessments');
        return;
      }
      
      uploading.value = true;
      
      try {
        // Get user's full name from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : null;
        const lecturerName = userData?.fullName || userData?.displayName || currentUser.displayName || currentUser.email;
        
        // Get subject name
        const subject = props.subjects.find(s => s.id === selectedSubject.value);
        const subjectName = subject?.name || 'Unknown Subject';
        
        // Create unique filename
        const timestamp = Date.now();
        const fileName = `${subjectName}_${selectedType.value}_${timestamp}.pdf`;
        const filePath = `assessments/${currentUser.uid}/${fileName}`;
        
        // Upload file to Firebase Storage
        const fileRef = storageRef(storage, filePath);
        await uploadBytes(fileRef, selectedFile.value);
        
        // Get download URL
        const downloadURL = await getDownloadURL(fileRef);
        
        // Create assessment document in Firestore
        const assessmentsCollection = collection(db, 'assessments');
        await addDoc(assessmentsCollection, {
          title: `${subjectName} - ${selectedType.value}`,
          subject: subjectName,
          subjectId: selectedSubject.value,
          type: selectedType.value,
          fileName: selectedFile.value.name,
          fileUrl: downloadURL,
          filePath: filePath,
          fileSize: selectedFile.value.size,
          status: 'pending',
          createdBy: currentUser.uid,
          createdByName: lecturerName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          semester: selectedSemester.value,
          approved: false,
          moderatorId: null,
          moderatorName: null,
          comments: []
        });
        
        toast.success('Assessment uploaded successfully!');
        
        // Emit event to refresh assessments list
        emit('assessment-uploaded');
        
        // Reset form
        selectedSubject.value = '';
        selectedType.value = '';
        selectedFile.value = null;
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      } catch (error) {
        console.error('Error uploading assessment:', error);
        toast.error('Failed to upload assessment. Please try again.');
      } finally {
        uploading.value = false;
      }
    };
    
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
      selectedSemester,
      semesters,
      selectedSubject,
      selectedType,
      selectedFile,
      fileInput,
      canSubmit,
      uploading,
      handleSemesterChange,
      handleFileSelect,
      handleSubmitAssessment,
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