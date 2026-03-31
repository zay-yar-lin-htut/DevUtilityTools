<template>
  <div class="w-full p-6 sm:p-8 lg:p-10">
    <div class="w-full">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">JSON Stringify</h1>
      <p class="text-base text-gray-500 mb-6">Convert any plain text or multi-line string into a JSON-safe escaped string.</p>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Input -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="tool-label">Plain Text</label>
            <button
              @click="copyInput"
              class="tool-copy-btn"
              title="Copy"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div class="tool-input-output-container">
            <div class="tool-gutter">
              <div 
                v-for="n in inputLineCount" 
                :key="n" 
                class="tool-gutter-line"
              >{{ n }}</div>
            </div>
            <textarea
              ref="inputTextarea"
              v-model="input"
              @scroll="syncScroll"
              class="tool-textarea"
              placeholder="Enter text to convert..."
            ></textarea>
          </div>
        </div>

        <!-- Output -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="tool-label">JSON String Output</label>
            <button
              @click="copyOutput"
              class="tool-copy-btn"
              title="Copy"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div class="tool-input-output-container">
            <div class="tool-gutter">
              <div 
                v-for="n in outputLineCount" 
                :key="n" 
                class="tool-gutter-line"
              >{{ n }}</div>
            </div>
            <textarea
              ref="outputTextarea"
              :value="output"
              readonly
              @scroll="syncScrollOutput"
              class="tool-textarea"
              placeholder="Result will appear here..."
            ></textarea>
          </div>
        </div>
      </div>

      <Toolbar
        :showPrimary="true"
        primaryLabel="Stringify"
        @primary="stringifyText"
        :showClear="false"
        :showSave="false"
      >
        <button @click="clearAll" class="btn btn-danger">Clear</button>
        <button v-if="authStore.isAuthenticated" @click="saveResult" class="btn btn-primary btn-sm">Save</button>
      </Toolbar>

      <!-- ── Example ─────────────────────────────────────────────────────────── -->
      <details class="mt-3">
        <summary class="cursor-pointer text-sm text-gray-400 select-none hover:text-gray-600">Show example</summary>
        <pre @click="loadExample" class="mt-2 bg-gray-100 p-3 rounded text-sm cursor-pointer hover:bg-gray-200 transition-colors whitespace-pre-wrap">{{ stringifyExample }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { savedResultsApi } from '../api/saved'
import { useAlert } from '../composables/useAlert'
import { useConfirm } from '../composables/useConfirm'
import Toolbar from '../components/Toolbar.vue'

const authStore = useAuthStore()
const alert = useAlert()
const confirm = useConfirm()

const input = ref('')
const output = ref('')

const inputTextarea = ref<HTMLTextAreaElement | null>(null)
const outputTextarea = ref<HTMLTextAreaElement | null>(null)

const inputLineCount = computed(() => {
  const count = input.value.split('\n').length
  return count > 0 ? Array.from({ length: count }, (_, i) => i + 1) : [1]
})

const outputLineCount = computed(() => {
  const count = output.value.split('\n').length
  return count > 0 ? Array.from({ length: count }, (_, i) => i + 1) : [1]
})

const syncScroll = () => {
  if (inputTextarea.value) {
    const container = inputTextarea.value.parentElement as HTMLElement
    const lineNumbers = container?.querySelector('.tool-gutter') as HTMLElement
    if (lineNumbers) {
      lineNumbers.scrollTop = inputTextarea.value.scrollTop
    }
  }
}

const syncScrollOutput = () => {
  if (outputTextarea.value) {
    const container = outputTextarea.value.parentElement as HTMLElement
    const lineNumbers = container?.querySelector('.tool-gutter') as HTMLElement
    if (lineNumbers) {
      lineNumbers.scrollTop = outputTextarea.value.scrollTop
    }
  }
}

const stringifyText = () => {
  if (!input.value.trim()) {
    alert.showError('Input cannot be empty')
    return
  }
  output.value = JSON.stringify(input.value)
}

const copyInput = () => {
  if (input.value) {
    navigator.clipboard.writeText(input.value)
  }
}

const copyOutput = () => {
  if (output.value) {
    navigator.clipboard.writeText(output.value)
  }
}

const clearAll = async () => {
  const confirmed = await confirm.confirm('Are you sure you want to clear all text?')
  if (!confirmed) return
  
  input.value = ''
  output.value = ''
}

const stringifyExample = `Hello World`

const loadExample = () => {
  input.value = stringifyExample
}

const saveResult = async () => {
  if (!authStore.isAuthenticated) {
    alert.showError('Please login to save results')
    return
  }
  
  if (!input.value.trim()) {
    alert.showError('Input cannot be empty')
    return
  }
  
  try {
    await savedResultsApi.create({
      toolType: 2,
      input: input.value,
      output: output.value
    })
    alert.showSuccess('Saved successfully!')
  } catch (err: any) {
    alert.showError(err.response?.data?.message || 'Failed to save')
  }
}
</script>
