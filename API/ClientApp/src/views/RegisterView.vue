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
        <h1 class="text-2xl font-bold text-gray-800">Create an account</h1>
        <p class="text-sm text-gray-500 mt-1">Join DevTools to save your work</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10">
        <form @submit.prevent="handleRegister">
          <div class="mb-5">
            <label class="block text-gray-700 text-base font-semibold mb-2" for="username">
              Username
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-shadow"
              placeholder="Choose a username"
              required
            />
          </div>

          <div class="mb-5">
            <label class="block text-gray-700 text-base font-semibold mb-2" for="email">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-shadow"
              placeholder="Enter your email"
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
              placeholder="Minimum 6 characters"
              required
              minlength="6"
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
            {{ authStore.loading ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

        <p class="mt-6 text-center text-gray-500 text-base">
          Already have an account?
          <router-link to="/login" class="text-blue-600 font-medium hover:underline">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  const result = await authStore.register(username.value, email.value, password.value);
  
  if (result.success) {
    router.push('/');
  }
};
</script>
