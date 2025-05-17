<script setup>
// Login form component
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left side: Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
      <div class="max-w-md w-full">
        <!-- Logo and Header -->
        <div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Welcome to Moducate</h2>
          <p class="mt-2 text-sm text-gray-600">
            Sign in to access your assessment moderation dashboard
          </p>
        </div>
        
        <!-- Login Form -->
        <form class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email-address" name="email" type="email" autocomplete="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="you@example.com">
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••">
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Sign in
            </button>
          </div>
          
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Register here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Right side: SVG Illustration -->
    <div class="hidden lg:block lg:w-1/2 bg-blue-50">
      <div class="h-full flex items-center justify-center p-8">
        <img src="/login/logo.svg" alt="Moducate Illustration" class="max-w-full max-h-full object-contain">
      </div>
    </div>
  </div>
</template>
