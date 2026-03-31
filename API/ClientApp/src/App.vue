<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useDarkMode } from './composables/useDarkMode'
import AlertMessage from './components/AlertMessage.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import { useAlert } from './composables/useAlert'
import { useConfirm } from './composables/useConfirm'

const authStore = useAuthStore()
const { isDark, toggle: toggleDark, init: initDark } = useDarkMode()
const isMobileMenuOpen = ref(false)

const alert   = useAlert()
const confirm = useConfirm()

// ── Scroll-reactive navbar ───────────────────────────────────────────
const navHidden = ref(false)
let lastY = 0
const onScroll = () => {
  const y = window.scrollY
  navHidden.value = y > 80 && y > lastY
  lastY = y
}

onMounted(() => {
  initDark()
  authStore.init()
  window.addEventListener('scroll', onScroll, { passive: true })
})

const handleLogout = async () => {
  await authStore.logout()
  isMobileMenuOpen.value = false
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav :class="['relative z-10 glass-card border-b border-gray-100 flex-shrink-0 nav-bar', navHidden ? 'nav-hidden' : '']">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center gap-2.5" @click="closeMobileMenu">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 accent-gradient" style="display:flex;align-items:center;justify-content:center;">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span class="text-2xl font-bold text-gray-800">DevTools</span>
            </router-link>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-1">
            <router-link 
              to="/json-formatter" 
              active-class="bg-blue-50 text-blue-600 font-semibold"
              class="text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-lg font-medium transition-colors"
            >
              JSON Formatter
            </router-link>
            <router-link 
              to="/json-stringify" 
              active-class="bg-blue-50 text-blue-600 font-semibold"
              class="text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-lg font-medium transition-colors"
            >
              JSON Stringify
            </router-link>
            <router-link 
              to="/markdown-preview" 
              active-class="bg-blue-50 text-blue-600 font-semibold"
              class="text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-lg font-medium transition-colors"
            >
              Markdown
            </router-link>
            <router-link 
              to="/diff-checker" 
              active-class="bg-blue-50 text-blue-600 font-semibold"
              class="text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-lg font-medium transition-colors"
            >
              Diff Checker
            </router-link>
          </div>

          <!-- Desktop Auth Buttons -->
          <div class="hidden md:flex items-center gap-2">
            <!-- Dark mode toggle -->
            <button
              @click="toggleDark"
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            <template v-if="authStore.isAuthenticated">
              <!-- Avatar circle -->
              <div class="flex items-center gap-3 pl-1 pr-2">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base select-none flex-shrink-0 accent-gradient ring-2 ring-indigo-200" :title="authStore.user?.username">
                  {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                </div>
                <!-- <span class="text-gray-700 font-semibold text-base">{{ authStore.user?.username }}</span> -->
              </div>
              <!-- History button -->
              <router-link
                to="/saved"
                class="btn btn-secondary text-base"
              >
                History
              </router-link>
              <!-- Logout button -->
              <button
                @click="handleLogout"
                class="btn btn-danger text-base"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <router-link 
                to="/login"
                active-class="bg-blue-50 text-blue-600"
                class="text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-lg font-medium transition-colors"
              >
                Login
              </router-link>
              <router-link 
                to="/register"
                  active-class="bg-gradient-to-r from-indigo-600 to-pink-500"
                  class="btn-gradient px-5 py-2 rounded-lg text-lg font-medium hover:opacity-95 transition-all"
                >
                  Register
                </router-link>
            </template>
          </div>

          <!-- Mobile Menu Button -->
          <div class="flex items-center gap-2 md:hidden">
            <!-- Dark toggle (mobile) -->
            <button
              @click="toggleDark"
              class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              :title="isDark ? 'Light mode' : 'Dark mode'"
            >
              <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="text-gray-600 hover:text-gray-900 p-2 rounded-md"
            >
              <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-100">
        <div class="px-4 pt-2 pb-4 space-y-1">
          <router-link 
            to="/json-formatter" 
            active-class="bg-blue-50 text-blue-600 font-semibold"
            class="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            @click="closeMobileMenu"
          >
            JSON Formatter
          </router-link>
          <router-link 
            to="/json-stringify" 
            active-class="bg-blue-50 text-blue-600 font-semibold"
            class="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            @click="closeMobileMenu"
          >
            JSON Stringify
          </router-link>
          <router-link 
            to="/markdown-preview" 
            active-class="bg-blue-50 text-blue-600 font-semibold"
            class="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            @click="closeMobileMenu"
          >
            Markdown
          </router-link>
          <router-link 
            to="/diff-checker" 
            active-class="bg-blue-50 text-blue-600 font-semibold"
            class="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            @click="closeMobileMenu"
          >
            Diff Checker
          </router-link>
          
          <div class="border-t border-gray-100 pt-2 mt-2">
            <template v-if="authStore.isAuthenticated">
              <!-- Mobile avatar row -->
              <div class="flex items-center gap-3 px-3 py-2">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base select-none flex-shrink-0 accent-gradient ring-2 ring-indigo-200">
                  {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                </div>
                <span class="font-semibold text-gray-700 text-sm">{{ authStore.user?.username }}</span>
              </div>
              <router-link
                to="/saved"
                class="btn btn-secondary w-full text-sm mt-1"
                @click="closeMobileMenu"
              >
                History
              </router-link>
              <button
                @click="handleLogout"
                class="btn btn-danger w-full text-sm mt-1"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <router-link 
                to="/login"
                active-class="bg-blue-50 text-blue-600 font-semibold"
                class="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                @click="closeMobileMenu"
              >
                Login
              </router-link>
              <router-link 
                to="/register"
                active-class="bg-blue-700"
                class="block bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium text-center mt-1 hover:bg-blue-700 transition-colors"
                @click="closeMobileMenu"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main class="flex-grow w-full px-4 sm:px-6 lg:px-8">
      <RouterView />
    </main>

    <!-- Global Alert -->
    <AlertMessage
      :visible="alert.visible.value"
      :type="alert.type.value"
      :message="alert.message.value"
      @close="alert.hide"
    />

    <!-- Global Confirm Dialog -->
    <ConfirmDialog
      :visible="confirm.visible.value"
      :message="confirm.message.value"
      @confirm="confirm.handleConfirm"
      @cancel="confirm.handleCancel"
    />

    <!-- Footer -->
    <footer class="bg-white/60 glass-card border-t border-gray-100 py-4 flex-shrink-0 mt-8">
      <div class="w-full px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
        &copy; 2026 DevTools &mdash; Developer Utilities Platform
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Scroll-reactive nav: uses only transform so the browser keeps it composited */
.nav-bar {
  position: sticky;
  top: 0;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
.nav-hidden { transform: translateY(-100%); }
</style>
