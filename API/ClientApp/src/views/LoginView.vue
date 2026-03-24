<template>
  <div class="w-full py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <!-- Branding -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 accent-gradient">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Welcome back</h1>
        <p class="text-sm text-gray-500 mt-1">Sign in to your DevTools account</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10">
        <form @submit.prevent="handleLogin">
          <div class="mb-6">
            <label class="block text-gray-700 text-base font-semibold mb-2" for="username">
              Username
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-shadow"
              placeholder="Enter your username"
              required
            />
          </div>

          <div class="mb-7">
            <label class="block text-gray-700 text-base font-semibold mb-2" for="password">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-shadow"
              placeholder="Enter your password"
              required
            />
          </div>

          <div v-if="authStore.error" class="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-base">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ authStore.error }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full btn btn-primary"
          >
            {{ authStore.loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="mt-6 text-center text-gray-500 text-base">
          Don't have an account?
          <router-link to="/register" class="text-blue-600 font-medium hover:underline">
            Register
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');

const handleLogin = async () => {
  const result = await authStore.login(username.value, password.value);
  
  if (result.success) {
    const redirect = route.query.redirect as string || '/';
    router.push(redirect);
  }
};
</script>
