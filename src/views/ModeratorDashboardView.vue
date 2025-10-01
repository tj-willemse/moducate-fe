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
    
        <div v-if="activeSection === 'dashboard'" class="space-y-6">
          <Dashboard :assessments="assignedAssessments" />
        </div>
  
        <div v-if="activeSection === 'review'" class="space-y-6">
          <Review />
        </div>
        
        <div v-if="activeSection === 'settings'" class="space-y-6">
          <Settings />
        </div>
      </template>
    </DashboardLayout>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { getAuth } from 'firebase/auth';
  import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
  import { db } from '@/firebase/config';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  
  // Import layout component
  import DashboardLayout from '@/components/layout/DashboardLayout.vue';
  
  // Import moderator components
  import Sidebar from '@/components/moderator/Sidebar.vue';
  import Dashboard from '@/components/moderator/Dashboard.vue';
  import Review from '@/components/moderator/Review.vue';
  import Settings from '@/components/moderator/Settings.vue';
  
  export default {
    name: 'ModeratorDashboardView',
    components: {
      DashboardLayout,
      Sidebar,
      Dashboard,
      Review,
      Settings
    },
    setup() {
      const router = useRouter();
      const auth = getAuth();
      const toast = useToast();
      
      // State
      const user = ref({
        uid: '',
        email: '',
        displayName: 'User',
        photoURL: 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff',
        profileImageUrl: 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff',
        role: 'moderator',
        approved: true
      });
      const loading = ref(false);
      const activeSection = ref('dashboard');
      
      // Data
      const assessments = ref([]);
      const pendingAssessments = ref([]);
      const assignedAssessments = ref([]);
      
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
              
              // Initialize user object with basic info
              user.value = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'User',
                photoURL: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(firebaseUser.displayName || 'User') + '&background=6366f1&color=fff',
                profileImageUrl: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(firebaseUser.displayName || 'User') + '&background=6366f1&color=fff',
                role: 'moderator',
                approved: true
              };
              
              // Check if role is in token claims
              let isModerator = idTokenResult.claims.moderator === true || idTokenResult.claims.role === 'moderator';
              let isApproved = idTokenResult.claims.approved === true;
              
              // If no role found in claims, check Firestore directly
              if (!isModerator) {
                console.log('No moderator role found in claims, checking Firestore...');
                try {
                  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log('User data from Firestore:', userData);
                    
                    isModerator = userData.moderator === true || userData.role === 'moderator';
                    isApproved = userData.approved === true;
                    
                    // Update user object with Firestore data
                    user.value = {
                      ...user.value,
                      role: isModerator ? 'moderator' : user.value.role,
                      approved: isApproved,
                      fullName: userData.fullName || userData.displayName || user.value.displayName
                    };
                  }
                } catch (firestoreError) {
                  console.error('Error checking Firestore for role:', firestoreError);
                }
              }
              
              // Always load data since we've already verified the user in the router guard
              await loadData();
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
          console.log('Loading moderator dashboard data');
          
          // Load assessments assigned to this moderator
          try {
            const assessmentsCollection = collection(db, 'assessments');
            
            // Query assessments where moderatorId equals current user's UID
            const assignedQuery = query(
              assessmentsCollection,
              where('moderatorId', '==', user.value.uid),
              orderBy('createdAt', 'desc')
            );
            
            const assignedSnapshot = await getDocs(assignedQuery);
            assignedAssessments.value = assignedSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            console.log('Assigned assessments:', assignedAssessments.value);
            
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
   
      };
  
      return {
        user,
        loading,
        activeSection,
        assessments,
        pendingAssessments,
        assignedAssessments,
        handleNavChange,
        logout
      };
    }
  };
  </script>
  