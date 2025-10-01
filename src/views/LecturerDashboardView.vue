<template>
  <DashboardLayout 
    :user="user" 
    :loading="loading"
    :initial-active-section="activeSection"
    @nav-change="handleNavChange"
    @logout="logout"
  >
    <!-- Sidebar Slot -->
    <template #sidebar="{ user, activeSection, handleNavChange, logout }">
      <Sidebar 
        :user="user" 
        :active-item="activeSection" 
        @nav-change="handleNavChange" 
        @logout="logout"
      />
    </template>
    
    <!-- Content Slot -->
    <template #content="{ activeSection }">
      <!-- Dashboard Section -->
      <div v-if="activeSection === 'dashboard'" class="space-y-6">
        <h1 class="text-2xl font-semibold text-gray-900">Lecturer Dashboard</h1>
        <Dashboard />
      </div>
      
      <!-- Assessments Section -->
      <div v-if="activeSection === 'assessments'" class="space-y-6">
        <h1 class="text-2xl font-semibold text-gray-900">Assessments</h1>
        <Assessments 
          :assessments="assessments" 
          :subjects="subjects" 
          :loading="loading" 
        />
      </div>
      
      <!-- Subjects Section -->
      <div v-if="activeSection === 'subjects'" class="space-y-6">
        <h1 class="text-2xl font-semibold text-gray-900">Subjects</h1>
        <Subjects 
          :subjects="subjects" 
          :assessments="assessments" 
          :loading="loading" 
        />
      </div>
      
      <!-- Settings Section -->
      <div v-if="activeSection === 'settings'" class="space-y-6">
        <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
        <Settings :user="user" />
      </div>
    </template>
  </DashboardLayout>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

// Import layout component
import DashboardLayout from '@/components/layout/DashboardLayout.vue';

// Import lecturer components
import Sidebar from '@/components/lecturer/Sidebar.vue';
import Dashboard from '@/components/lecturer/Dashboard.vue';
import Assessments from '@/components/lecturer/Assessments.vue';
import Subjects from '@/components/lecturer/Subjects.vue';
import Settings from '@/components/lecturer/Settings.vue';

export default {
  name: 'LecturerDashboardView',
  components: {
    DashboardLayout,
    Sidebar,
    Dashboard,
    Assessments,
    Subjects,
    Settings
  },
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const toast = useToast();
    
    // State
    const user = ref(null);
    const loading = ref(true);
    const activeSection = ref('dashboard');
    
    // Data
    const assessments = ref([]);
    const subjects = ref([]);
    
    // Initialize Firebase auth and check user
    onMounted(async () => {
      loading.value = true;
      
      // Use a promise to handle the initial auth state
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get the ID token with force refresh to ensure we have the latest token
            await firebaseUser.getIdToken(true);
            
            // Get the user's custom claims
            const idTokenResult = await firebaseUser.getIdTokenResult();
            console.log('User claims:', idTokenResult.claims);
            
            // Get user data from Firestore
            try {
              const userDocRef = doc(db, 'users', firebaseUser.uid);
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log('User data from Firestore:', userData);
                
                // Set the user object with role information from Firestore
                user.value = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: userData.fullName || firebaseUser.displayName || 'User',
                  photoURL: userData.profileImageUrl || firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.fullName || firebaseUser.displayName || 'User') + '&background=6366f1&color=fff',
                  profileImageUrl: userData.profileImageUrl || firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.fullName || firebaseUser.displayName || 'User') + '&background=6366f1&color=fff',
                  role: userData.role || (userData.lecturer ? 'lecturer' : userData.moderator ? 'moderator' : 'user'),
                  approved: userData.approved || false,
                  active: userData.active || false
                };
                
                // Check if user is a lecturer and is approved
                if ((user.value.role === 'lecturer' || userData.lecturer === true) && user.value.approved) {
                  await loadData();
                } else {
                  toast.error('You do not have permission to access this page');
                  router.push('/login');
                }
              } else {
                console.error('User document does not exist in Firestore');
                toast.error('User profile not found. Please contact support.');
                router.push('/login');
              }
            } catch (error) {
              console.error('Error fetching user data from Firestore:', error);
              toast.error('Error loading user profile. Please try again.');
              router.push('/login');
            }
          } catch (error) {
            console.error('Error getting user claims:', error);
            toast.error('Authentication error. Please log in again.');
            router.push('/login');
          }
        } else {
          // User is not authenticated, redirect to login
          router.push('/login');
        }
        loading.value = false;
      });

      // Clean up the listener when component is unmounted
      return () => unsubscribe();
    });

    const loadData = async () => {
      if (!user.value || !user.value.uid) {
        console.error('Cannot load data: User not authenticated');
        return;
      }
      
      loading.value = true;
      try {
        console.log('Loading lecturer dashboard data');
        
        // Load subjects
        try {
          const subjectsCollection = collection(db, 'subjects');
          const subjectsQuery = query(subjectsCollection, orderBy('name', 'asc'));
          const subjectsSnapshot = await getDocs(subjectsQuery);
          
          subjects.value = subjectsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (error) {
          console.error('Error loading subjects:', error);
          toast.error('Failed to load subjects. Please try again.');
        }
        
        // Load assessments created by this lecturer
        try {
          const assessmentsCollection = collection(db, 'assessments');
          const assessmentsQuery = query(
            assessmentsCollection,
            where('createdBy', '==', user.value.uid),
            orderBy('createdAt', 'desc')
          );
          
          const assessmentsSnapshot = await getDocs(assessmentsQuery);
          assessments.value = assessmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (error) {
          console.error('Error loading assessments:', error);
          toast.error('Failed to load assessments. Please try again.');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        loading.value = false;
      }
    };
    
    const handleNavChange = (sectionId) => {
      activeSection.value = sectionId;
    };
    
    const logout = async () => {
      // Logout is handled by the DashboardLayout component
    };

    return {
      user,
      loading,
      activeSection,
      assessments,
      subjects,
      handleNavChange,
      logout
    };
  }
};
</script>