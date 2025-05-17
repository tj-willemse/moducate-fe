<script setup>
import { ref } from 'vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'

const isFlipped = ref(false)

const flipToRegister = () => {
  isFlipped.value = true
}

const flipToLogin = () => {
  isFlipped.value = false
}
</script>

<template>
  <div class="flex min-h-screen bg-white">
    <!-- Left side - Auth Forms with Flip Animation -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
      <div class="flip-container" :class="{ 'flipped': isFlipped }">
        <div class="flipper">
          <!-- Front side - Login Form -->
          <div class="front">
            <LoginForm @switch-to-register="flipToRegister" />
          </div>
          
          <!-- Back side - Register Form -->
          <div class="back">
            <RegisterForm @switch-to-login="flipToLogin" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right side - Logo/Branding -->
    <div class="hidden md:flex md:w-1/2  items-center justify-center">
      <img src="/login/logo.svg" alt="Moducate Logo" class="w-4/5 max-w-lg" />
    </div>
  </div>
</template>

<style scoped>
/* Flip animation styles */
.flip-container {
  perspective: 1000px;
  width: 100%;
  min-height: 700px; /* Fixed height to prevent layout shifts */
  overflow: hidden; /* Prevent scrollbar from appearing during animation */
}

.flip-container.flipped .flipper {
  transform: rotateY(180deg);
}

.flipper {
  transition: 0.8s;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
}

.front, .back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.front {
  z-index: 2;
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}
</style>
