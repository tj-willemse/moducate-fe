<script setup>
import SidebarNavigation from './components/SidebarNavigation.vue'
import DashboardHeader from './components/DashboardHeader.vue'
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar Navigation -->
    <SidebarNavigation />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Dashboard Header -->
      <DashboardHeader />
      
      <!-- Main Dashboard Content -->
      <main class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-2xl font-semibold text-gray-800 mb-6">Assessment Oversight</h1>
          
          <!-- Dashboard Content Placeholder -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Assessment Cards will go here -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-medium text-gray-800 mb-2">Total Assessments</h2>
              <div class="flex items-center">
                <span class="text-3xl font-bold text-blue-600">24</span>
                <span class="ml-2 text-sm text-gray-500">This month</span>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-medium text-gray-800 mb-2">Pending Moderation</h2>
              <div class="flex items-center">
                <span class="text-3xl font-bold text-yellow-500">8</span>
                <span class="ml-2 text-sm text-gray-500">Requires attention</span>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-medium text-gray-800 mb-2">Completed</h2>
              <div class="flex items-center">
                <span class="text-3xl font-bold text-green-500">16</span>
                <span class="ml-2 text-sm text-gray-500">Processed</span>
              </div>
            </div>
          </div>
          
          <!-- Recent Assessments Table -->
          <div class="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-800">Recent Assessments</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment Title</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">Final Year Project</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">University of Cape Town</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-05-15</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-blue-600 hover:text-blue-900">View</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">Business Ethics</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">Stellenbosch University</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-05-10</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-blue-600 hover:text-blue-900">View</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
