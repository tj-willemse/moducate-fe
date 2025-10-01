<template>
  <Transition name="modal-backdrop">
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 overflow-hidden"
      @click.self="handleClose"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
      
      <!-- Modal Panel -->
      <Transition name="slide">
        <div 
          v-if="show"
          class="absolute inset-y-0 right-0 max-w-md w-full"
        >
          <div class="h-full bg-white shadow-xl">
            <!-- Modal Content -->
            <div class="h-full flex flex-col">
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
                <button 
                  @click="handleClose"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- Body (Slot for custom content) -->
              <div class="flex-1 overflow-y-auto p-6">
                <slot></slot>
              </div>
              
              <!-- Footer (Optional slot) -->
              <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200">
                <slot name="footer"></slot>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'SlideModal',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      required: true,
      default: 'Modal Title'
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const handleClose = () => {
      emit('close');
    };

    return {
      handleClose
    };
  }
};
</script>

<style scoped>
/* Backdrop fade transition */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

/* Slide transition from right */
.slide-enter-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
