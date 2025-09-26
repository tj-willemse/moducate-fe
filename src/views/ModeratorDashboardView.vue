<script>
import { useHead } from '@vueuse/head'
import Dashboard from '../components/moderator/Dashboard.vue'
import Review from '../components/moderator/Review.vue'
import Settings from '../components/moderator/Settings.vue' 
import Sidebar from '../components/moderator/Sidebar.vue'
</script>


<template>
  <div class="villa-page bg-[#202020] min-h-screen">
    <Sidebar />
    <Dashboard />
    <Review />
    <Settings />
  </div> 
</template> 


