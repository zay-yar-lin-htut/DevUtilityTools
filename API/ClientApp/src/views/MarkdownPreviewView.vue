<template>
  <div class="w-full p-6 sm:p-8 lg:p-10">
    <div class="w-full">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Markdown Preview</h1>
      <p class="text-base text-gray-500 mb-6">Write Markdown on the left and see the live rendered preview on the right.</p>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Input -->
        <div>
          <div class="mb-2">
            <label class="tool-label">Markdown Input</label>
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
              @input="renderMarkdown"
              @scroll="syncScroll"
              class="tool-textarea"
              placeholder="# Heading&#10;**bold text**&#10;- list item"
            ></textarea>
          </div>
        </div>

        <!-- Output -->
        <div>
          <div class="mb-2">
            <label class="tool-label">Preview</label>
          </div>
          <div class="tool-input-output-container" style="background:#f9fafb;">
            <div
              class="flex-1 p-4 overflow-auto prose prose-sm max-w-none markdown-preview"
              v-html="output"
            ></div>
          </div>
        </div>
      </div>
      <Toolbar
        :showPrimary="true"
        primaryLabel="Copy HTML"
        @primary="copyHtml"
        :showClear="false"
      >
        <button @click="clearAll" class="btn btn-danger">Clear</button>
        <button v-if="authStore.isAuthenticated" @click="saveResult" class="btn btn-primary btn-sm">Save</button>
      </Toolbar>

      <!-- ── Example ─────────────────────────────────────────────────────────── -->
      <details class="mt-3">
        <summary class="cursor-pointer text-sm text-gray-400 select-none hover:text-gray-600">Show example</summary>
        <pre @click="loadExample" class="mt-2 bg-gray-100 p-3 rounded text-sm cursor-pointer hover:bg-gray-200 transition-colors whitespace-pre-wrap">{{ mdExample }}</pre>
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

const inputLineCount = computed(() => {
  const count = input.value.split('\n').length
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

const renderMarkdown = () => {
  if (!input.value.trim()) {
    output.value = ''
    return
  }
  
  let lines = input.value.split('\n')
  let htmlLines = lines.map(line => {
    let processed = line
    
    // Escape HTML first
    processed = processed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    
    // Headers (must check more # first)
    if (processed.startsWith('######')) {
      processed = `<h6>${processed.substring(7)}</h6>`
    } else if (processed.startsWith('#####')) {
      processed = `<h5>${processed.substring(6)}</h5>`
    } else if (processed.startsWith('####')) {
      processed = `<h4>${processed.substring(5)}</h4>`
    } else if (processed.startsWith('###')) {
      processed = `<h3>${processed.substring(4)}</h3>`
    } else if (processed.startsWith('##')) {
      processed = `<h2>${processed.substring(3)}</h2>`
    } else if (processed.startsWith('#')) {
      processed = `<h1>${processed.substring(2)}</h1>`
    }
    // Blockquote
    else if (processed.startsWith('>')) {
      processed = `<blockquote class="border-l-4 border-gray-300 pl-4 italic">${processed.substring(1)}</blockquote>`
    }
    // Unordered list
    else if (processed.match(/^[\-\*]\s/)) {
      processed = `<li class="ml-4">${processed.substring(2)}</li>`
    }
    // Ordered list
    else if (processed.match(/^\d+\.\s/)) {
      processed = `<li class="ml-4 list-decimal">${processed.replace(/^\d+\.\s/, '')}</li>`
    }
    // Horizontal rule
    else if (processed.match(/^[\-\*_]{3,}$/)) {
      processed = `<hr class="my-4 border-gray-300">`
    }
    // Regular text - apply inline formatting
    else {
      // Inline code
      processed = processed.replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 rounded">$1</code>')
      // Bold
      processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Links
      processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="text-blue-600 underline" href="$2" target="_blank">$1</a>')
    }
    
    return processed
  })
  
  output.value = htmlLines.join('')
}

const mdExample = `# Example Title
**Bold text**
- List item 1
- List item 2
[Link](https://example.com)`

const loadExample = () => {
  input.value = mdExample
}

const copyHtml = () => {
  if (!output.value) {
    alert.showError('Output is empty. Please enter some markdown first.')
    return
  }
  navigator.clipboard.writeText(output.value)
}

const clearAll = async () => {
  const confirmed = await confirm.confirm('Are you sure you want to clear all text?')
  if (!confirmed) return
  
  input.value = ''
  output.value = ''
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
      toolType: 3,
      input: input.value,
      output: output.value
    })
    alert.showSuccess('Saved successfully!')
  } catch (err: any) {
    alert.showError(err.response?.data?.message || 'Failed to save')
  }
}
</script>

<style scoped>
.markdown-preview :deep(h1) {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
}
.markdown-preview :deep(h2) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #374151;
}
.markdown-preview :deep(h3) {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #4b5563;
}
.markdown-preview :deep(h4) {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #4b5563;
}
.markdown-preview :deep(h5) {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #4b5563;
}
.markdown-preview :deep(h6) {
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #4b5563;
}
.markdown-preview :deep(code) {
  background-color: #e5e7eb;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
}
.markdown-preview :deep(strong) {
  font-weight: bold;
}
.markdown-preview :deep(em) {
  font-style: italic;
}
.markdown-preview :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
}
.markdown-preview :deep(li) {
  margin-left: 1rem;
  list-style-type: disc;
}
.markdown-preview :deep(ol li) {
  list-style-type: decimal;
}
.markdown-preview :deep(hr) {
  border-top: 1px solid #d1d5db;
  margin: 1rem 0;
}
</style>
