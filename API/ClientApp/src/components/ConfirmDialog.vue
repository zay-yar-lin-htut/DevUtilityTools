<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleCancel"></div>
        <div class="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
          <button 
            @click="handleCancel"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 text-yellow-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800 mb-1">Confirm Action</h3>
              <p class="text-gray-600">{{ message }}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button 
              @click="handleCancel"
              class="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="handleConfirm"
              class="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  message: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
