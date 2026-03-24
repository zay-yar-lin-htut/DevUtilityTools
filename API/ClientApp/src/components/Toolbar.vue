<template>
    <div class="flex items-center gap-3 mb-5">
    <div class="flex items-center gap-2">
      <button
        v-if="showPrimary && primaryLabel"
        @click="$emit('primary')"
        :class="primaryClass"
      >
        {{ primaryLabel }}
      </button>

      <button v-if="showSecondary && secondaryLabel" @click="$emit('secondary')" class="btn btn-secondary">
        {{ secondaryLabel }}
      </button>

      <button 
        v-if="showFix && fixLabel" 
        @click="$emit('fix')"
        :disabled="fixDisabled || isFixing"
        :class="[
          'btn',
          fixDisabled || isFixing 
            ? 'bg-gray-400 text-white cursor-not-allowed opacity-70' 
            : 'bg-amber-500 text-white hover:bg-amber-600'
        ]"
      >
        <span v-if="isFixing" class="animate-spin">⏳</span>
        <span v-else-if="fixDisabled">✓ Auto Fix</span>
        <span v-else>🔧 Auto Fix</span>
      </button>

      <button v-if="showClear" @click="$emit('clear')" class="btn btn-danger">
        Clear
      </button>

      <button v-if="showSave" @click="$emit('save')" class="btn btn-primary">
        Save
      </button>
    </div>

    <div class="flex-1"></div>

    <div class="flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  showPrimary: { type: Boolean, default: true },
  primaryLabel: { type: String, default: 'Run' },
  primaryClass: { type: String, default: 'btn btn-primary' },
  showSecondary: { type: Boolean, default: false },
  secondaryLabel: { type: String, default: '' },
  showFix: { type: Boolean, default: false },
  fixLabel: { type: String, default: 'Auto Fix' },
  fixDisabled: { type: Boolean, default: false },
  isFixing: { type: Boolean, default: false },
  showClear: { type: Boolean, default: true },
  showSave: { type: Boolean, default: false }
})
</script>
