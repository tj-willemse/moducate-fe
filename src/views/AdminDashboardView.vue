<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Mobile menu button -->
    <div class="fixed top-0 left-0 p-4 z-20 md:hidden">
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen" 
        class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Sidebar for mobile -->
    <div 
      v-if="mobileMenuOpen" 
      class="fixed inset-0 z-10 bg-gray-600 bg-opacity-75 md:hidden"
      @click="mobileMenuOpen = false"
    ></div>

    <div 
      :class="[mobileMenuOpen ? 'translate-x-0' : '-translate-x-full', 'fixed inset-y-0 left-0 z-10 w-72 transition duration-300 transform bg-white md:hidden']"
    >
      <Sidebar 
        :user="user" 
        :active-item="activeSection" 
        @nav-change="handleNavChange" 
        @logout="logout"
      />
    </div>

    <!-- Sidebar for desktop -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="w-72">
        <Sidebar 
          :user="user" 
          :active-item="activeSection" 
          @nav-change="handleNavChange" 
          @logout="logout"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <div class="py-6 px-4 sm:px-6 lg:px-8">
        <!-- Dashboard Section -->
        <div v-if="activeSection === 'dashboard'" class="space-y-6">
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Assessments" 
              :count="assessmentsCount" 
              change="+12" 
              bg-color="bg-indigo-500"
              :icon="AssessmentIcon"
            />
            <StatCard 
              title="Pending Moderation" 
              :count="pendingModerationCount" 
              change="+3" 
              bg-color="bg-amber-500"
              :icon="PendingIcon"
            />
            <StatCard 
              title="Completed Reviews" 
              :count="completedReviewsCount" 
              change="+8" 
              bg-color="bg-emerald-500"
              :icon="CompletedIcon"
            />
            <StatCard 
              title="Active Moderators" 
              :count="activeModeratorsCount" 
              change="+2" 
              bg-color="bg-blue-500"
              :icon="ModeratorIcon"
            />
          </div>
          
          <!-- Assessments Needing Moderators Section -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-gray-900">
                Assessments needing moderators
                <span class="ml-2 text-sm font-normal text-gray-500">({{ assessmentsNeedingModerators.length }})</span>
              </h2>
            </div>
            
            <!-- Carousel Container -->
            <div class="relative">
              <!-- Left Arrow -->
              <button 
                v-if="currentCarouselIndex > 0"
                @click="previousCarouselSlide"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <!-- Assessments Carousel -->
              <div class="overflow-hidden">
                <div 
                  class="flex transition-transform duration-300 ease-in-out gap-4"
                  :style="{ transform: `translateX(-${currentCarouselIndex * (100 / itemsPerView)}%)` }"
                >
                  <div 
                    v-for="assessment in assessmentsNeedingModerators" 
                    :key="assessment.id"
                    class="flex-shrink-0"
                    :style="{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }"
                  >
                    <!-- Assessment Card - All Sections Horizontal -->
                    <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div class="flex">
                        <!-- Subject Section (Cyan) -->
                        <div class="bg-cyan-400 text-white p-4 w-1/4 flex items-center justify-center min-h-[100px]">
                          <div class="text-center">
                            <div class="text-xs font-medium mb-1">Subject</div>
                            <div class="font-semibold">{{ assessment.subject }}</div>
                          </div>
                        </div>
                        
                        <!-- Assessment Name Section (Pink) -->
                        <div class="bg-pink-400 text-white p-4 w-1/4 flex items-center justify-center min-h-[100px]">
                          <div class="text-center">
                            <div class="text-xs font-medium mb-1">Assessment name</div>
                            <div class="font-semibold text-sm">{{ assessment.name }}</div>
                          </div>
                        </div>
                        
                        <!-- Semester Section (Light Green) -->
                        <div class="bg-green-50 p-4 w-1/4 flex items-center justify-center min-h-[100px]">
                          <div class="text-center">
                            <div class="text-xs font-medium text-gray-600 mb-1">Semester</div>
                            <div class="font-semibold text-gray-900 text-sm">{{ assessment.semester }}</div>
                          </div>
                        </div>
                        
                        <!-- Uploaded By Section (Light) -->
                        <div class="bg-gray-50 p-4 w-1/4 flex items-center justify-center min-h-[100px]">
                          <div class="text-center">
                            <div class="text-xs font-medium text-gray-600 mb-1">Uploaded by</div>
                            <div class="font-semibold text-gray-900 text-sm">{{ assessment.uploadedBy }}</div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Arrow Button -->
                      <button 
                        @click="viewAssessment(assessment.id)"
                        class="w-full bg-gray-50 p-3 hover:bg-gray-100 transition-colors border-t border-gray-200 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Assign Moderator Button -->
                    <div class="flex justify-center mt-3">
                      <button 
                        @click="openAssignModerator(assessment.id)"
                        class="px-6 py-2 bg-green-400 hover:bg-green-500 text-white text-sm font-medium rounded-full transition-colors"
                      >
                        Assign Moderator
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right Arrow -->
              <button 
                v-if="currentCarouselIndex < maxCarouselIndex"
                @click="nextCarouselSlide"
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <!-- Empty State -->
            <div v-if="assessmentsNeedingModerators.length === 0" class="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500">No assessments need moderators at this time</p>
            </div>
          </div>
          
          <!-- Reviews by Subject Section -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <h2 class="text-lg font-semibold text-gray-900">Reviews by subject</h2>
                <span class="text-sm text-gray-500">({{ subjectReviews.length }})</span>
              </div>
              
              <!-- Semester Filter -->
              <select 
                v-model="selectedReviewSemester"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option v-for="semester in semesters" :key="semester.value" :value="semester.value">
                  {{ semester.label }}
                </option>
              </select>
            </div>
            
            <!-- Subject Reviews Carousel -->
            <div class="relative">
              <!-- Left Arrow -->
              <button 
                v-if="currentReviewIndex > 0"
                @click="previousReviewSlide"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <!-- Reviews Grid -->
              <div class="overflow-hidden">
                <div 
                  class="flex transition-transform duration-300 ease-in-out gap-4"
                  :style="{ transform: `translateX(-${currentReviewIndex * (100 / reviewsPerView)}%)` }"
                >
                  <div 
                    v-for="review in subjectReviews" 
                    :key="review.subject"
                    class="flex-shrink-0"
                    :style="{ width: `calc(${100 / reviewsPerView}% - ${(reviewsPerView - 1) * 16 / reviewsPerView}px)` }"
                  >
                    <!-- Subject Review Card -->
                    <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white h-[70px]">
                      <div class="flex h-full">
                        <!-- Subject -->
                        <div class="bg-gray-50 border-r border-gray-200 p-3 w-1/4 flex items-center justify-center">
                          <div class="text-center">
                            <div class="text-xs font-medium text-gray-600 mb-1">Subject</div>
                            <div class="font-semibold text-sm text-gray-900 line-clamp-2">{{ review.subject }}</div>
                          </div>
                        </div>
                        
                        <!-- Pending -->
                        <div class="bg-orange-50 border-r border-gray-200 p-3 w-1/4 flex items-center justify-center">
                          <div class="text-center">
                            <div class="text-xs font-medium text-gray-600 mb-1">Pending</div>
                            <div class="font-bold text-xl text-orange-600">{{ review.pending }}</div>
                          </div>
                        </div>
                        
                        <!-- In Review -->
                        <div class="bg-blue-50 border-r border-gray-200 p-3 w-1/4 flex items-center justify-center">
                          <div class="text-center">
                            <div class="text-xs font-medium text-gray-600 mb-1">In Review</div>
                            <div class="font-bold text-xl text-blue-600">{{ review.inReview }}</div>
                          </div>
                        </div>
                        
                        <!-- Completed -->
                        <div class="bg-teal-50 p-3 w-1/4 flex items-center justify-center">
                          <div class="text-center">
                            <div class="text-xs font-medium text-gray-600 mb-1">Completed</div>
                            <div class="font-bold text-xl text-teal-600">{{ review.completed }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right Arrow -->
              <button 
                v-if="currentReviewIndex < maxReviewIndex"
                @click="nextReviewSlide"
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <!-- Empty State -->
            <div v-if="subjectReviews.length === 0" class="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500">No subject reviews available</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column (Chart) -->
            <div class="lg:col-span-2 space-y-6">
              <DashboardChart 
                title="Assessment Statistics" 
                :labels="chartLabels" 
                :datasets="chartDatasets"
              />
            </div>
            
            <!-- Right Column (Recent Assessments) -->
            <div class="space-y-6">
              <AssessmentTable 
                title="Recent Assessments" 
                :assessments="recentAssessments" 
                :show-pagination="false"
                :show-add-button="false"
                @view-assessment="viewAssessment"
              />
            </div>
          </div>
        </div>
        
        <!-- User Management Section -->
        <div v-if="activeSection === 'users'" class="space-y-6">
          <h1 class="text-2xl font-semibold text-gray-900">User Management</h1>
          
          <!-- User Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Users" 
              :count="totalUsersCount" 
              change="+5" 
              bg-color="bg-indigo-500"
              :icon="ModeratorIcon"
            />
            <StatCard 
              title="Active Users" 
              :count="activeUsersCount" 
              change="+3" 
              bg-color="bg-emerald-500"
              :icon="CompletedIcon"
            />
            <StatCard 
              title="Pending Approval" 
              :count="pendingUsersCount" 
              change="+2" 
              bg-color="bg-amber-500"
              :icon="PendingIcon"
            />
          </div>
          
          <!-- User Management Component -->
          <UserManagement 
            :users="users" 
            :pending-users="pendingUsers" 
            :active-users="activeUsers" 
            :current-page="currentPage"
            :page-size="pageSize"
            @approve-user="approveUser"
            @reject-user="rejectUser"
            @update-role="updateUserRole"
            @page-change="handlePageChange"
          />
        </div>
        
        <!-- Subjects Section -->
        <div v-if="activeSection === 'subjects'" class="space-y-6">
          <h1 class="text-2xl font-semibold text-gray-900">Subject Management</h1>
          <Subjects />
        </div>

        <!-- Assessments Section -->
        <div v-if="activeSection === 'assessments'" class="space-y-6">
          <h1 class="text-2xl font-semibold text-gray-900">Assessments</h1>
          
          <!-- Assessment Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Assessments" 
              :count="assessmentsCount" 
              change="+12" 
              bg-color="bg-indigo-500"
              :icon="AssessmentIcon"
            />
            <StatCard 
              title="Pending Moderation" 
              :count="pendingModerationCount" 
              change="+3" 
              bg-color="bg-amber-500"
              :icon="PendingIcon"
            />
            <StatCard 
              title="Completed Reviews" 
              :count="completedReviewsCount" 
              change="+8" 
              bg-color="bg-emerald-500"
              :icon="CompletedIcon"
            />
          </div>
          
          <!-- Assessments Table -->
          <AssessmentTable 
            title="All Assessments" 
            :assessments="assessments" 
            :total-count="assessmentsCount"
            :current-page="currentPage"
            :page-size="pageSize"
            @view-assessment="viewAssessment"
            @add-assessment="addAssessment"
            @page-change="handlePageChange"
          />
        </div>
        
        <!-- Loading Overlay -->
        <div v-if="loading" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-700">Loading...</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- View Assessment Modal -->
    <SlideModal 
      :show="showViewModal" 
      title="View Assessment"
      @close="closeViewModal"
    >
      <div v-if="selectedViewAssessment" class="space-y-4">
        <!-- Subject Title -->
        <div class="bg-cyan-400 text-white p-4 rounded-lg">
          <div class="text-xs font-medium mb-1">Subject Title</div>
          <div class="font-semibold">{{ selectedViewAssessment.subject }}</div>
        </div>
        
        <!-- Assessment Title -->
        <div class="bg-pink-400 text-white p-4 rounded-lg">
          <div class="text-xs font-medium mb-1">Assessment Title</div>
          <div class="font-semibold">{{ selectedViewAssessment.name }}</div>
        </div>
        
        <!-- Semester and Uploaded By -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Semester -->
          <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div class="text-xs font-medium text-gray-600 mb-1">Semester</div>
            <div class="font-semibold text-gray-900">{{ selectedViewAssessment.semester }}</div>
          </div>
          
          <!-- Uploaded By -->
          <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <div class="text-xs font-medium text-gray-600 mb-1">Uploaded by</div>
            <div class="font-semibold text-gray-900">{{ selectedViewAssessment.uploadedBy }}</div>
          </div>
        </div>
        
        <!-- Assessment Document Preview -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-gray-700 mb-3">Assessment Document preview</div>
          <div class="border-2 border-gray-300 rounded-lg overflow-hidden bg-white" style="height: 600px;">
            <iframe 
              v-if="selectedViewAssessment.fileUrl"
              :src="`https://docs.google.com/viewer?url=${encodeURIComponent(selectedViewAssessment.fileUrl)}&embedded=true`"
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
        
        <!-- Download Button -->
        <div class="flex justify-center">
          <a 
            v-if="selectedViewAssessment.fileUrl"
            :href="selectedViewAssessment.fileUrl"
            target="_blank"
            download
            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Download PDF
          </a>
        </div>
      </div>
    </SlideModal>
    
    <!-- Assign Moderator Modal -->
    <SlideModal 
      :show="showAssignModal" 
      title="Assign Moderator"
      @close="closeAssignModal"
    >
      <!-- Modal Body Content -->
      <div class="space-y-4">
        <!-- Subject Title -->
        <div class="bg-cyan-400 text-white rounded-lg p-4">
          <div class="text-xs font-medium mb-1">Subject Title</div>
          <div class="font-semibold">{{ selectedAssessment?.subject || 'Math 101' }}</div>
        </div>
        
        <!-- Assessment Title -->
        <div class="bg-pink-400 text-white rounded-lg p-4">
          <div class="text-xs font-medium mb-1">Assessment Title</div>
          <div class="font-semibold">{{ selectedAssessment?.name || 'Final Exam 2024' }}</div>
        </div>
        
        <!-- Select a Moderator -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select a Moderator</label>
          <select 
            v-model="selectedModerator"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select a Moderator</option>
            <option 
              v-for="moderator in moderators" 
              :key="moderator.uid" 
              :value="moderator.uid"
            >
              {{ moderator.displayName || moderator.fullName || moderator.email }}
            </option>
          </select>
          <p v-if="moderators.length === 0" class="mt-2 text-sm text-gray-500">
            No approved moderators available
          </p>
        </div>
        
        <!-- Select a Priority Level -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select a Priority Level</label>
          <select 
            v-model="selectedPriority"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-green-50"
          >
            <option value="">Select a Priority Level</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
        
        <!-- Workload Preview -->
        <div class="bg-pink-500 text-white rounded-lg p-4">
          <div class="font-semibold mb-3">Workload Preview</div>
          <div v-if="selectedModerator && moderatorWorkload" class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Current Reviews:</span>
              <span class="font-semibold">{{ moderatorWorkload.currentReviews }}</span>
            </div>
            <div class="flex justify-between">
              <span>Pending Reviews:</span>
              <span class="font-semibold">{{ moderatorWorkload.pendingReviews }}</span>
            </div>
            <div class="flex justify-between">
              <span>Due This Week:</span>
              <span class="font-semibold">{{ moderatorWorkload.dueThisWeek }}</span>
            </div>
          </div>
          <div v-else class="text-sm text-white/80">
            Select a moderator to view workload
          </div>
        </div>
      </div>
      
      <!-- Modal Footer -->
      <template #footer>
        <div class="flex gap-3">
          <button 
            @click="closeAssignModal"
            class="flex-1 px-6 py-3 bg-red-300 hover:bg-red-400 text-gray-900 font-medium rounded-full transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmAssignModerator"
            class="flex-1 px-6 py-3 bg-green-400 hover:bg-green-500 text-white font-medium rounded-full transition-colors"
          >
            Assign Moderator
          </button>
        </div>
      </template>
    </SlideModal>
  </div>
</template>

<script>
import { ref, onMounted, computed, defineComponent, h, watch } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import VuePdfEmbed from 'vue-pdf-embed';

// Import components
import Sidebar from '@/components/layout/Sidebar.vue';
import StatCard from '@/components/shared/StatCard.vue';
import DashboardChart from '@/components/shared/DashboardChart.vue';
import AssessmentTable from '@/components/shared/AssessmentTable.vue';
import UserManagement from '@/components/admin/UserManagement.vue';
import Subjects from '@/components/admin/Subjects.vue';
import SlideModal from '@/components/shared/SlideModal.vue';

// Icons for stat cards
const AssessmentIcon = defineComponent({
  name: 'AssessmentIcon',
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      class: this.$attrs.class
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      })
    ]);
  }
});

const PendingIcon = defineComponent({
  name: 'PendingIcon',
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      class: this.$attrs.class
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]);
  }
});

const CompletedIcon = defineComponent({
  name: 'CompletedIcon',
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      class: this.$attrs.class
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]);
  }
});

const ModeratorIcon = defineComponent({
  name: 'ModeratorIcon',
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      class: this.$attrs.class
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
      })
    ]);
  }
});

export default {
  name: 'AdminDashboardView',
  components: {
    Sidebar,
    StatCard,
    DashboardChart,
    AssessmentTable,
    UserManagement,
    Subjects,
    SlideModal,
    VuePdfEmbed,
    AssessmentIcon,
    PendingIcon,
    CompletedIcon,
    ModeratorIcon
  },
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const functions = getFunctions();
    const toast = useToast();
    
    // State
    const user = ref(null);
    const loading = ref(false);
    const mobileMenuOpen = ref(false);
    const activeSection = ref('dashboard');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const selectedSemester = ref('2025-1');
    
    // Carousel state
    const currentCarouselIndex = ref(0);
    const itemsPerView = ref(3); // Show 3 items on desktop
    
    // Reviews carousel state
    const currentReviewIndex = ref(0);
    const reviewsPerView = ref(3); // Show 3 reviews at a time
    const selectedReviewSemester = ref('2025-1');
    
    // Modal state
    const showAssignModal = ref(false);
    const showViewModal = ref(false);
    const selectedAssessment = ref(null);
    const selectedViewAssessment = ref(null);
    const selectedModerator = ref('');
    const selectedPriority = ref('');
    const moderatorWorkload = ref(null);
    
    // Moderators list
    const moderators = ref([]);
    
    // Subject reviews data
    const subjectReviews = ref([]);
    
    // Semester options
    const semesters = ref([
      { value: '2025-1', label: '2025 - Semester 1' },
      { value: '2024-2', label: '2024 - Semester 2' },
      { value: '2024-1', label: '2024 - Semester 1' },
      { value: '2023-2', label: '2023 - Semester 2' },
      { value: '2023-1', label: '2023 - Semester 1' }
    ]);
    
    // Data
    const users = ref([]);
    const pendingUsers = ref([]);
    const activeUsers = ref([]);
    const assessments = ref([]);
    const recentAssessments = ref([]);
    
    // Assessments needing moderators (fetched from Firestore)
    const assessmentsNeedingModerators = ref([]);

    // Computed values
    const pendingUsersCount = computed(() => pendingUsers.value.length);
    const activeUsersCount = computed(() => activeUsers.value.length);
    const assessmentsCount = computed(() => assessments.value.length);
    const totalUsersCount = computed(() => users.value.length);
    const pendingModerationCount = computed(() => 10); // This would come from the backend
    const completedReviewsCount = computed(() => 40); // This would come from the backend
    const activeModeratorsCount = computed(() => 12); // This would come from the backend
    
    // Carousel computed
    const maxCarouselIndex = computed(() => {
      return Math.max(0, assessmentsNeedingModerators.value.length - itemsPerView.value);
    });
    
    // Reviews carousel computed
    const maxReviewIndex = computed(() => {
      return Math.max(0, subjectReviews.value.length - reviewsPerView.value);
    });
    
    // Chart data
    const chartLabels = ref(['Total Assessments', 'Pending Moderation', 'Completed Reviews', 'Active Moderators']);
    const chartDatasets = ref([
      {
        label: '2023',
        backgroundColor: '#8B5CF6', // Purple color
        data: [66, 10, 40, 12]
      }
    ]);

    // Initialize Firebase auth persistence to LOCAL to keep the user logged in
    onMounted(async () => {
      // Router guard already verified auth, so we can directly get current user
      const firebaseUser = auth.currentUser;
      
      if (firebaseUser) {
        try {
          // Get the user's custom claims
          const idTokenResult = await firebaseUser.getIdTokenResult();
          console.log('User claims:', idTokenResult.claims);
          
          // Set the user object with role information from claims
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'User',
            // Add a mock profile image URL if none exists
            photoURL: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(firebaseUser.displayName || 'User') + '&background=6366f1&color=fff',
            profileImageUrl: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(firebaseUser.displayName || 'User') + '&background=6366f1&color=fff',
            role: idTokenResult.claims.admin ? 'admin' : 
                  idTokenResult.claims.moderator ? 'moderator' : 
                  idTokenResult.claims.lecturer ? 'lecturer' : 'user',
            approved: idTokenResult.claims.approved || false
          };
          
          // Load data in the background without blocking UI
          loadData();
        } catch (error) {
          console.error('Error getting user claims:', error);
          toast.error('Authentication error. Please log in again.');
          await signOut(auth);
          router.push('/login');
        }
      } else {
        // User is not authenticated, redirect to login
        router.push('/login');
      }
    });

    const loadData = async () => {
      if (!user.value || !user.value.uid) {
        console.error('Cannot load data: User not authenticated');
        return;
      }
      
      loading.value = true;
      try {
        console.log('Loading live data for dashboard');
        
        // Make sure we have a fresh token before making API calls
        const currentUser = auth.currentUser;
        if (currentUser) {
          await currentUser.getIdToken(true);
        }
        
        // Load all users - only if user is admin
        if (user.value.role === 'admin') {
          try {
            // Use Firestore directly to get users
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            
            users.value = usersSnapshot.docs.map(doc => ({
              id: doc.id,
              uid: doc.id,
              fullName: doc.data().displayName || doc.data().fullName,
              displayName: doc.data().displayName || doc.data().fullName,
              email: doc.data().email,
              role: doc.data().role,
              approved: doc.data().approved || false,
              createdAt: doc.data().createdAt
            }));
            
            // Filter users by approval status
            pendingUsers.value = users.value.filter(u => !u.approved);
            activeUsers.value = users.value.filter(u => u.approved);
            
            // Filter moderators (approved users with moderator role)
            moderators.value = users.value.filter(u => 
              u.approved && (u.role === 'moderator' || u.moderator === true)
            );
            console.log('Loaded moderators:', moderators.value);
          } catch (userError) {
            console.error('Error loading users:', userError);
            toast.error('Failed to load users. Please try again.');
          }
        }

        // Load all assessments
        try {
          // Use Firestore directly to get assessments
          const assessmentsCollection = collection(db, 'assessments');
          const assessmentsSnapshot = await getDocs(assessmentsCollection);
          
          assessments.value = assessmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Get recent assessments for the dashboard
          recentAssessments.value = [...assessments.value]
            .sort((a, b) => {
              // Sort by creation date, newest first
              const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
              const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
              return dateB - dateA;
            })
            .slice(0, 5); // Get top 5 most recent
          
          // Filter assessments needing moderators (status: pending and no moderator assigned)
          assessmentsNeedingModerators.value = assessments.value
            .filter(a => a.status === 'pending' && !a.moderatorId)
            .map(a => ({
              id: a.id,
              subject: a.subject || 'Unknown Subject',
              name: a.title || a.fileName || 'Untitled',
              semester: a.semester || 'N/A',
              uploadedBy: a.createdByName || 'Unknown',
              type: a.type || 'assessment',
              fileUrl: a.fileUrl,
              createdAt: a.createdAt
            }));
          
          console.log('Assessments needing moderators:', assessmentsNeedingModerators.value);
        } catch (assessmentError) {
          console.error('Error loading assessments:', assessmentError);
          toast.error('Failed to load assessments. Please try again.');
        }
        
        // Load subjects and create review data
        try {
          // Fetch subjects from Firestore
          const subjectsCollection = collection(db, 'subjects');
          const subjectsSnapshot = await getDocs(subjectsCollection);
          
          const subjects = subjectsSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || doc.data().title || 'Unknown Subject',
            ...doc.data()
          }));
          
          console.log('Loaded subjects:', subjects);
          
          // Create review data with real subjects and mock stats
          subjectReviews.value = subjects.map(subject => ({
            subject: subject.name,
            pending: Math.floor(Math.random() * 10),
            inReview: Math.floor(Math.random() * 8),
            completed: Math.floor(Math.random() * 15) + 5
          }));
        } catch (subjectError) {
          console.error('Error loading subjects:', subjectError);
          toast.error('Failed to load subjects. Please try again.');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        loading.value = false;
      }
    };

    const approveUser = async (userId) => {
      try {
        loading.value = true;
        console.log('Approving user with ID:', userId);
        
        // Get current user data first
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updateData = {
            approved: true,
            updatedAt: new Date()
          };
          
          // Update user in Firestore
          await updateDoc(userRef, updateData);
        } else {
          console.error('User document not found');
          toast.error('User document not found');
        }
        
        // Update the local user list
        const userIndex = users.value.findIndex(u => u.uid === userId);
        if (userIndex !== -1) {
          users.value[userIndex].approved = true;
          // Update the pending and active users lists
          pendingUsers.value = users.value.filter(u => !u.approved);
          activeUsers.value = users.value.filter(u => u.approved);
        }
        
        toast.success('User approved successfully');
      } catch (error) {
        console.error('Error approving user:', error);
        toast.error('Failed to approve user. Please try again.');
      } finally {
        loading.value = false;
      }
    };
    
    const rejectUser = async (userId) => {
      try {
        loading.value = true;
        console.log('Rejecting user with ID:', userId);
        
        // Delete user from Firestore
        const userRef = doc(db, 'users', userId);
        await deleteDoc(userRef);
        
        // Remove from local array
        users.value = users.value.filter(u => u.uid !== userId);
        // Update the pending and active users lists
        pendingUsers.value = users.value.filter(u => !u.approved);
        activeUsers.value = users.value.filter(u => u.approved);
        
        toast.success('User rejected successfully');
      } catch (error) {
        console.error('Error rejecting user:', error);
        toast.error('Failed to reject user. Please try again.');
      } finally {
        loading.value = false;
      }
    };
    
    const updateUserRole = async ({ userId, role }) => {
      try {
        loading.value = true;
        console.log('Updating user role:', userId, role);
        
        // Update user role in Firestore
        const userRef = doc(db, 'users', userId);
        
        // Prepare update data with both role string and boolean flags
        const updateData = {
          role: role,
          updatedAt: new Date(),
          // Reset all role booleans
          moderator: false,
          lecturer: false
        };
        
        // Set the appropriate boolean flag based on the role
        if (role === 'moderator') {
          updateData.moderator = true;
        } else if (role === 'lecturer') {
          updateData.lecturer = true;
        }
        
        await updateDoc(userRef, updateData);
        
        // Update the local user list
        const userIndex = users.value.findIndex(u => u.uid === userId);
        if (userIndex !== -1) {
          users.value[userIndex].role = role;
        }
        
        toast.success(`User role updated to ${role}`);
      } catch (error) {
        console.error('Error updating user role:', error);
        toast.error('Failed to update user role. Please try again.');
      } finally {
        loading.value = false;
      }
    };

    const logout = async () => {
      try {
        await signOut(auth);
        // Navigate to the root path which is mapped to the login view
        router.push('/');
        toast.info('You have been logged out');
      } catch (error) {
        console.error('Error signing out:', error);
        toast.error('Failed to log out. Please try again.');
      }
    };
    
    const handleNavChange = (sectionId) => {
      activeSection.value = sectionId;
    };
    
    const handlePageChange = (page) => {
      currentPage.value = page;
      // In a real app, we would fetch the data for the new page here
    };
    
    const viewAssessment = (assessmentId) => {
      // Find the assessment in the list
      const assessment = assessmentsNeedingModerators.value.find(a => a.id === assessmentId);
      if (assessment) {
        selectedViewAssessment.value = assessment;
        showViewModal.value = true;
      }
    };
    
    const closeViewModal = () => {
      showViewModal.value = false;
      selectedViewAssessment.value = null;
    };
    
    const addAssessment = () => {
      router.push('/assessment/new');
    };

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
    
    const handleSemesterChange = () => {
      console.log('Selected semester:', selectedSemester.value);
      toast.info(`Switched to ${semesters.value.find(s => s.value === selectedSemester.value)?.label}`);
      // TODO: Filter assessments and data by selected semester
      // This would typically reload data with semester filter
    };
    
    const fetchModeratorWorkload = async (moderatorId) => {
      if (!moderatorId) {
        moderatorWorkload.value = null;
        return;
      }
      
      try {
        // Query assessments assigned to this moderator
        const assessmentsCollection = collection(db, 'assessments');
        const moderatorQuery = query(
          assessmentsCollection,
          where('moderatorId', '==', moderatorId)
        );
        
        const snapshot = await getDocs(moderatorQuery);
        const moderatorAssessments = snapshot.docs.map(doc => doc.data());
        
        // Calculate workload
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const currentReviews = moderatorAssessments.filter(a => 
          a.reviewStatus === 'in_progress'
        ).length;
        
        const pendingReviews = moderatorAssessments.filter(a => 
          !a.reviewStatus || a.reviewStatus === 'not_started'
        ).length;
        
        const dueThisWeek = moderatorAssessments.filter(a => {
          const dueDate = a.dueDate ? new Date(a.dueDate) : null;
          return dueDate && dueDate <= oneWeekFromNow && dueDate >= now;
        }).length;
        
        moderatorWorkload.value = {
          currentReviews,
          pendingReviews,
          dueThisWeek
        };
      } catch (error) {
        console.error('Error fetching moderator workload:', error);
        moderatorWorkload.value = {
          currentReviews: 0,
          pendingReviews: 0,
          dueThisWeek: 0
        };
      }
    };
    
    // Watch for moderator selection changes
    watch(selectedModerator, (newModeratorId) => {
      if (newModeratorId) {
        fetchModeratorWorkload(newModeratorId);
      } else {
        moderatorWorkload.value = null;
      }
    });
    
    const openAssignModerator = (assessmentId) => {
      console.log('Opening assign moderator for assessment:', assessmentId);
      // Find the assessment
      const assessment = assessmentsNeedingModerators.value.find(a => a.id === assessmentId);
      if (assessment) {
        selectedAssessment.value = assessment;
        selectedModerator.value = ''; // Reset moderator selection
        moderatorWorkload.value = null; // Reset workload
        showAssignModal.value = true;
      }
    };
    const closeAssignModal = () => {
      showAssignModal.value = false;
      selectedAssessment.value = null;
      selectedModerator.value = '';
      selectedPriority.value = '';
      moderatorWorkload.value = null;
    };
    
    const confirmAssignModerator = async () => {
      if (!selectedModerator.value) {
        toast.error('Please select a moderator');
        return;
      }
      if (!selectedPriority.value) {
        toast.error('Please select a priority level');
        return;
      }
      
      loading.value = true;
      
      try {
        // Get moderator details
        const moderator = moderators.value.find(m => m.uid === selectedModerator.value);
        
        // Update assessment in Firestore
        const assessmentRef = doc(db, 'assessments', selectedAssessment.value.id);
        await updateDoc(assessmentRef, {
          moderatorId: selectedModerator.value,
          moderatorName: moderator?.fullName || moderator?.displayName || 'Unknown',
          priority: selectedPriority.value,
          assignedAt: new Date(),
          reviewStatus: 'not_started',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          updatedAt: new Date()
        });
        
        toast.success('Moderator assigned successfully!');
        
        // Reload data to refresh the list
        await loadData();
        
        closeAssignModal();
      } catch (error) {
        console.error('Error assigning moderator:', error);
        toast.error('Failed to assign moderator. Please try again.');
      } finally {
        loading.value = false;
      }
    };
    
    const nextCarouselSlide = () => {
      if (currentCarouselIndex.value < maxCarouselIndex.value) {
        currentCarouselIndex.value++;
      }
    };
    
    const previousCarouselSlide = () => {
      if (currentCarouselIndex.value > 0) {
        currentCarouselIndex.value--;
      }
    };
    
    const nextReviewSlide = () => {
      if (currentReviewIndex.value < maxReviewIndex.value) {
        currentReviewIndex.value++;
      }
    };
    
    const previousReviewSlide = () => {
      if (currentReviewIndex.value > 0) {
        currentReviewIndex.value--;
      }
    };

    return {
      user,
      loading,
      mobileMenuOpen,
      activeSection,
      selectedSemester,
      semesters,
      currentCarouselIndex,
      itemsPerView,
      maxCarouselIndex,
      currentReviewIndex,
      reviewsPerView,
      maxReviewIndex,
      selectedReviewSemester,
      subjectReviews,
      showAssignModal,
      showViewModal,
      selectedAssessment,
      selectedViewAssessment,
      selectedModerator,
      selectedPriority,
      moderatorWorkload,
      moderators,
      users,
      pendingUsers,
      activeUsers,
      assessments,
      recentAssessments,
      assessmentsNeedingModerators,
      pendingUsersCount,
      activeUsersCount,
      assessmentsCount,
      totalUsersCount,
      pendingModerationCount,
      completedReviewsCount,
      activeModeratorsCount,
      chartLabels,
      chartDatasets,
      currentPage,
      pageSize,
      approveUser,
      rejectUser,
      updateUserRole,
      logout,
      formatDate,
      handleNavChange,
      handlePageChange,
      handleSemesterChange,
      openAssignModerator,
      closeAssignModal,
      closeViewModal,
      confirmAssignModerator,
      nextCarouselSlide,
      previousCarouselSlide,
      nextReviewSlide,
      previousReviewSlide,
      viewAssessment,
      addAssessment,
      // Icons
      AssessmentIcon,
      PendingIcon,
      CompletedIcon,
      ModeratorIcon
    };
  }
};
</script>
