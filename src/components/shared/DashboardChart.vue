<template>
  <div class="bg-gray-900 rounded-xl shadow-sm p-4">
    <h3 class="text-white text-sm font-medium mb-4">{{ title }}</h3>
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
    title: {
      type: String,
      default: 'Statistics'
    },
    labels: {
      type: Array,
      required: true
    },
    datasets: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: props.labels,
      datasets: props.datasets
    }));

    const defaultOptions = {
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

    const chartOptions = computed(() => {
      return { ...defaultOptions, ...props.options };
    });

    return {
      chartData,
      chartOptions
    };
  }
});
</script>
