<template>
  <div class="bg-gray-900 rounded-xl shadow-sm p-4">
    <h3 class="text-white text-sm font-medium mb-4">Assessment Statistics</h3>
    <div class="h-64">
      <Bar 
        :data="chartData" 
        :options="chartOptions" 
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: 'DashboardChart',
  components: { Bar },
  props: {
    totalAssessments: {
      type: Number,
      default: 0
    },
    pendingModeration: {
      type: Number,
      default: 0
    },
    completedReviews: {
      type: Number,
      default: 0
    },
    activeModerators: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: ['Total Assessments', 'Pending Moderation', 'Completed Reviews', 'Active Moderators'],
      datasets: [
        {
          label: '2023',
          backgroundColor: '#8B5CF6', // Purple color
          data: [
            props.totalAssessments,
            props.pendingModeration,
            props.completedReviews,
            props.activeModerators
          ]
        }
      ]
    }));

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: 'white',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1F2937',
          bodyColor: '#1F2937',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          padding: 10,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 10
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 10
            },
            stepSize: 20
          }
        }
      }
    };

    return {
      chartData,
      chartOptions
    };
  }
});
</script>
