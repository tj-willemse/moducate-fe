<template>
  <div class="bg-white rounded-lg shadow-md p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-xl font-semibold text-gray-900">Subject Management</h2>
      <div class="mt-2 sm:mt-0">
        <span class="text-sm text-gray-500">{{ subjects.length }} subjects</span>
      </div>
    </div>

    <!-- Add Subject Form -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-medium text-gray-900 mb-3">Add New Subject</h3>
      <form @submit.prevent="addSubject" class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div class="flex-grow">
          <input 
            type="text" 
            v-model="newSubject.name" 
            placeholder="Subject Name" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div class="flex-grow">
          <input 
            type="text" 
            v-model="newSubject.code" 
            placeholder="Subject Code (e.g. CS101)" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <button 
            type="submit" 
            class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
            <span v-else>Add Subject</span>
          </button>
        </div>
      </form>
      <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
    </div>

    <!-- Subjects List -->
    <div class="overflow-hidden">
      <div v-if="loading && !subjects.length" class="flex justify-center p-6">
        <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="!subjects.length" class="text-center py-6 text-gray-500">
        No subjects added yet. Add your first subject above.
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Code</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="subject in subjects" :key="subject.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ subject.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ subject.code }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(subject.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="confirmDeleteSubject(subject)" 
                  class="text-red-600 hover:text-red-900 focus:outline-none"
                  :disabled="deleteLoading === subject.id"
                >
                  <span v-if="deleteLoading === subject.id" class="flex items-center justify-end">
                    <svg class="animate-spin -ml-1 mr-1 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                  <span v-else>Delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-sm text-gray-500 mb-6">
          Are you sure you want to delete the subject <span class="font-semibold">{{ subjectToDelete?.name }}</span>? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false" 
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button 
            @click="deleteSubject" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useToast } from 'vue-toastification';

export default {
  name: 'Subjects',
  setup() {
    const toast = useToast();
    const subjects = ref([]);
    const loading = ref(true);
    const error = ref('');
    const deleteLoading = ref(null);
    const showDeleteModal = ref(false);
    const subjectToDelete = ref(null);
    
    // New subject form data
    const newSubject = ref({
      name: '',
      code: ''
    });

    // Load subjects from Firestore
    const loadSubjects = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const subjectsCollection = collection(db, 'subjects');
        const subjectsQuery = query(subjectsCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(subjectsQuery);
        
        subjects.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        console.error('Error loading subjects:', err);
        error.value = 'Failed to load subjects. Please try again.';
        toast.error('Failed to load subjects');
      } finally {
        loading.value = false;
      }
    };

    // Add a new subject
    const addSubject = async () => {
      if (!newSubject.value.name || !newSubject.value.code) {
        error.value = 'Subject name and code are required';
        return;
      }

      loading.value = true;
      error.value = '';
      
      try {
        // Check if subject with same code already exists
        const existingSubject = subjects.value.find(
          subject => subject.code.toLowerCase() === newSubject.value.code.toLowerCase()
        );
        
        if (existingSubject) {
          error.value = `Subject with code ${newSubject.value.code} already exists`;
          loading.value = false;
          return;
        }
        
        const subjectData = {
          name: newSubject.value.name.trim(),
          code: newSubject.value.code.trim(),
          createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'subjects'), subjectData);
        
        // Add the new subject to the local array with a temporary timestamp
        subjects.value.unshift({
          id: docRef.id,
          ...subjectData,
          createdAt: new Date() // Temporary date until we refresh
        });
        
        // Reset form
        newSubject.value.name = '';
        newSubject.value.code = '';
        
        toast.success('Subject added successfully');
        
        // Reload to get the server timestamp
        await loadSubjects();
      } catch (err) {
        console.error('Error adding subject:', err);
        error.value = 'Failed to add subject. Please try again.';
        toast.error('Failed to add subject');
      } finally {
        loading.value = false;
      }
    };

    // Confirm delete subject
    const confirmDeleteSubject = (subject) => {
      subjectToDelete.value = subject;
      showDeleteModal.value = true;
    };

    // Delete a subject
    const deleteSubject = async () => {
      if (!subjectToDelete.value) return;
      
      showDeleteModal.value = false;
      deleteLoading.value = subjectToDelete.value.id;
      
      try {
        const subjectRef = doc(db, 'subjects', subjectToDelete.value.id);
        await deleteDoc(subjectRef);
        
        // Remove from local array
        subjects.value = subjects.value.filter(s => s.id !== subjectToDelete.value.id);
        
        toast.success('Subject deleted successfully');
      } catch (err) {
        console.error('Error deleting subject:', err);
        toast.error('Failed to delete subject');
      } finally {
        deleteLoading.value = null;
        subjectToDelete.value = null;
      }
    };

    // Format date for display
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

    // Load subjects on component mount
    onMounted(() => {
      loadSubjects();
    });

    return {
      subjects,
      loading,
      error,
      newSubject,
      addSubject,
      deleteLoading,
      showDeleteModal,
      subjectToDelete,
      confirmDeleteSubject,
      deleteSubject,
      formatDate
    };
  }
};
</script>