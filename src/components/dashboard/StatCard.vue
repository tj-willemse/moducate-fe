<template>
  <div class="rounded-xl shadow-sm bg-white overflow-hidden">
    <div class="flex items-center px-4 py-3">
      <div :class="`rounded-full p-2 ${bgColor}`">
        <component :is="icon" class="h-5 w-5 text-white" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-gray-700">{{ title }}</h3>
        <div class="flex items-center">
          <span class="text-2xl font-bold text-gray-900">{{ count }}</span>
          <span v-if="change" :class="`ml-2 text-xs ${changeColor}`">
            {{ changePrefix }}{{ change }} this week
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: [Number, String],
      required: true
    },
    change: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'success', 'warning', 'info'].includes(value)
    },
    icon: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const bgColor = computed(() => {
      switch (props.type) {
        case 'primary':
          return 'bg-indigo-500';
        case 'success':
          return 'bg-green-500';
        case 'warning':
          return 'bg-yellow-500';
        case 'info':
          return 'bg-blue-500';
        default:
          return 'bg-gray-500';
      }
    });

    const changeColor = computed(() => {
      if (!props.change) return '';
      
      // Determine if change is positive or negative
      const isPositive = props.change.startsWith('+');
      return isPositive ? 'text-green-600' : 'text-red-600';
    });

    const changePrefix = computed(() => {
      if (!props.change) return '';
      
      // Add + sign if not already present and change is positive
      if (!props.change.startsWith('+') && !props.change.startsWith('-')) {
        return '+';
      }
      return '';
    });

    return {
      bgColor,
      changeColor,
      changePrefix
    };
  }
};
</script>
