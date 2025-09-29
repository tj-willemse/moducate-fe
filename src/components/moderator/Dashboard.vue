<template>
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
  
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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
</template>

<script>
import { ref, computed, defineComponent, h } from 'vue';
import { useRouter } from 'vue-router';

// Import components
import StatCard from '@/components/shared/StatCard.vue';
import DashboardChart from '@/components/shared/DashboardChart.vue';
import AssessmentTable from '@/components/shared/AssessmentTable.vue';

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
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
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
  name: 'ModeratorDashboard',
  components: {
    StatCard,
    DashboardChart,
    AssessmentTable,
    AssessmentIcon,
    PendingIcon,
    CompletedIcon,
    ModeratorIcon
  },
  props: {
    assessments: {
      type: Array,
      default: () => []
    },
    pendingAssessments: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const router = useRouter();
    
    // Computed values
    const assessmentsCount = computed(() => props.assessments.length);
    const pendingModerationCount = computed(() => props.pendingAssessments.length);
    const completedReviewsCount = computed(() => {
      return props.assessments.filter(a => a.status === 'approved' || a.status === 'rejected').length;
    });
    const activeModeratorsCount = ref(12); // This would come from the backend
    
    // Chart data
    const chartLabels = ref(['Total Assessments', 'Pending Moderation', 'Completed Reviews', 'Active Moderators']);
    const chartDatasets = ref([
      {
        label: '2023',
        backgroundColor: '#8B5CF6', // Purple color
        data: [assessmentsCount.value, pendingModerationCount.value, completedReviewsCount.value, activeModeratorsCount.value]
      }
    ]);

    // Recent assessments
    const recentAssessments = computed(() => {
      return [...props.assessments]
        .sort((a, b) => {
          // Sort by creation date, newest first
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 5); // Get top 5 most recent
    });
    
    const viewAssessment = (assessmentId) => {
      router.push(`/assessment/${assessmentId}`);
    };

    return {
      assessmentsCount,
      pendingModerationCount,
      completedReviewsCount,
      activeModeratorsCount,
      chartLabels,
      chartDatasets,
      recentAssessments,
      viewAssessment,
      // Icons
      AssessmentIcon,
      PendingIcon,
      CompletedIcon,
      ModeratorIcon
    };
  }
};
</script>