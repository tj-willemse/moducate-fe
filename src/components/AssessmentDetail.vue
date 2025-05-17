<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- Assessment Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Assessment Overview</h2>
        <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Pending Moderation
        </span>
      </div>
    </div>
    
    <!-- Assessment Information -->
    <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 class="text-sm font-medium text-gray-500">Assessment Title</h3>
        <p class="mt-1 text-sm text-gray-900">Final Year Project</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">Institution</h3>
        <p class="mt-1 text-sm text-gray-900">University of Cape Town</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">Submission Date</h3>
        <p class="mt-1 text-sm text-gray-900">2025-05-15</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">Assessor</h3>
        <p class="mt-1 text-sm text-gray-900">Dr. James Smith</p>
      </div>
    </div>
    
    <!-- Moderation Tabs -->
    <div class="border-b border-gray-200">
      <nav class="flex -mb-px">
        <a href="#" class="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
          Overview
        </a>
        <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
          Student Work
        </a>
        <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
          Assessment Criteria
        </a>
        <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
          Moderation Notes
        </a>
      </nav>
    </div>
    
    <!-- Assessment Content -->
    <div class="p-6">
      <!-- Assessment Summary -->
      <div class="mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Assessment Summary</h3>
        <p class="text-sm text-gray-600">
          This assessment evaluates the student's final year project on sustainable urban development. 
          The project demonstrates understanding of key concepts, research methodology, and practical application.
        </p>
      </div>
      
      <!-- Grading Summary -->
      <div class="mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Grading Summary</h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-500">Original Grade</span>
            <span class="text-sm font-medium text-gray-900">78%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-green-600 h-2.5 rounded-full" style="width: 78%"></div>
          </div>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 class="text-xs font-medium text-gray-500">Research Methodology</h4>
              <div class="flex items-center mt-1">
                <span class="text-sm font-medium text-gray-900 mr-2">25/30</span>
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div class="bg-blue-600 h-1.5 rounded-full" style="width: 83%"></div>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-xs font-medium text-gray-500">Content Quality</h4>
              <div class="flex items-center mt-1">
                <span class="text-sm font-medium text-gray-900 mr-2">32/40</span>
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div class="bg-blue-600 h-1.5 rounded-full" style="width: 80%"></div>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-xs font-medium text-gray-500">Presentation</h4>
              <div class="flex items-center mt-1">
                <span class="text-sm font-medium text-gray-900 mr-2">21/30</span>
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div class="bg-blue-600 h-1.5 rounded-full" style="width: 70%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Moderation Actions -->
      <div class="border-t border-gray-200 pt-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Moderation Actions</h3>
        <div class="space-y-4">
          <div>
            <label for="moderation-notes" class="block text-sm font-medium text-gray-700">Moderation Notes</label>
            <textarea id="moderation-notes" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Add your moderation notes here..."></textarea>
          </div>
          <div>
            <label for="moderated-grade" class="block text-sm font-medium text-gray-700">Moderated Grade (%)</label>
            <input type="number" id="moderated-grade" class="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value="78">
          </div>
          <div class="flex space-x-4">
            <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Approve Assessment
            </button>
            <button type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Request Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
