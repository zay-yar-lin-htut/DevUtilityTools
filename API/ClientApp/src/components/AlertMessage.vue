<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div
        v-if="visible"
        :class="[
          'fixed bottom-6 right-6 z-50 flex items-start gap-4 px-5 py-4 rounded-xl shadow-2xl border-l-[6px] bg-white w-96 max-w-[calc(100vw-3rem)]',
          type === 'success' ? 'border-green-500' : 'border-red-500'
        ]"
      >
        <div :class="['flex-shrink-0 mt-0.5', type === 'success' ? 'text-green-500' : 'text-red-500']">
          <svg v-if="type === 'success'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p :class="['text-base font-bold', type === 'success' ? 'text-green-800' : 'text-red-800']">
            {{ type === 'success' ? 'Success' : 'Error' }}
          </p>
          <p class="text-sm text-gray-600 mt-1 break-words leading-relaxed">{{ message }}</p>
        </div>
        <button @click="close" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  visible: boolean
  type: 'success' | 'error'
  message: string
  autoDismiss?: boolean
  dismissTime?: number
}>()

const emit = defineEmits<{
  close: []
}>()

let timeoutId: ReturnType<typeof setTimeout> | null = null

const close = () => {
  emit('close')
}

watch(() => props.visible, (newVal) => {
  if (newVal && props.autoDismiss !== false) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      close()
    }, props.dismissTime || 3000)
  }
})
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(120%);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active > div:last-child,
.fade-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.fade-enter-from > div:last-child,
.fade-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
