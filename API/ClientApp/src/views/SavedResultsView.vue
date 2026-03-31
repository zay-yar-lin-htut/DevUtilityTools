<template>
  <div class="w-full p-6 sm:p-8 lg:p-10">
    <div class="w-full">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Saved Results</h1>
      
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-gray-400 text-base">Loading saved results…</p>
      </div>
      
      <div v-else-if="savedResults.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <p class="font-medium text-gray-700 mb-1 text-lg">No saved results yet</p>
        <p class="text-base text-gray-400">Use any tool and click Save to store your work.</p>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="result in savedResults" 
          :key="result.id"
          class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all"
        >
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold px-3 py-1 rounded-full"
                :class="getToolTypeClass(result.toolType)"
              >
                {{ getToolTypeName(result.toolType) }}
              </span>
              <span class="text-sm text-gray-400">
                {{ formatDate(result.createdAt) }}
              </span>
            </div>
            <button
              @click="deleteResult(result.id)"
              class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <!-- Diff Checker: Show detail view -->
          <div v-if="result.toolType === 4">
            <button
              @click="showDiffDetail(result)"
              class="mt-2 text-blue-600 hover:text-blue-800 text-base underline"
            >
              View Detail
            </button>
          </div>
          
          <!-- Other tools: Original layout -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Input</label>
              <div class="bg-gray-50 p-2 rounded text-sm font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                {{ result.input }}
              </div>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Output</label>
              <!-- Markdown Preview: Show rendered HTML -->
              <div v-if="result.toolType === 3" class="border border-gray-300 rounded-lg p-4 bg-white max-h-40 overflow-auto markdown-preview">
                <div v-html="result.output"></div>
              </div>
              <!-- Other tools: Show raw text -->
              <div v-else class="bg-gray-50 p-2 rounded text-sm font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                {{ result.output }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Diff Checker Detail Modal -->
      <div v-if="showDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-auto">
          <div class="flex justify-between items-center mb-5">
            <h2 class="text-2xl font-bold">Diff Checker Detail</h2>
            <div class="flex items-center gap-3">
              <button
                @click="editPreviousInputs"
                class="px-4 py-2 text-sm font-medium bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                title="Open original & modified inputs in Diff Checker"
              >
                Edit Previous Inputs
              </button>
              <button
                @click="editSolvedInputs"
                class="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg border border-blue-600 hover:bg-blue-700 transition-colors"
                title="Open the resolved outputs as new inputs in Diff Checker"
              >
                Edit Solved Inputs
              </button>
              <button @click="closeDetail" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Original -->
            <div>
              <label class="block text-gray-700 text-base font-bold mb-2">Original</label>
              <div class="relative flex border border-gray-300 rounded-lg overflow-hidden" style="height: 18rem;">
                <div 
                  class="w-12 text-gray-400 text-sm font-mono p-2 overflow-hidden text-right select-none"
                  style="line-height: 1.5rem;"
                >
                  <div 
                    v-for="n in detailOriginalLines" 
                    :key="n" 
                    :class="n % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'"
                    :style="{ height: '1.5rem' }"
                  >{{ n }}</div>
                </div>
                <div 
                  class="flex-1 p-2 border-0 bg-gray-50 overflow-auto font-mono text-base whitespace-pre"
                  style="line-height: 1.5rem;"
                >{{ detailOriginal }}</div>
              </div>
            </div>
            
            <!-- Modified -->
            <div>
              <label class="block text-gray-700 text-base font-bold mb-2">Modified</label>
              <div class="relative flex border border-gray-300 rounded-lg overflow-hidden" style="height: 18rem;">
                <div 
                  class="w-12 text-gray-400 text-sm font-mono p-2 overflow-hidden text-right select-none"
                  style="line-height: 1.5rem;"
                >
                  <div 
                    v-for="n in detailModifiedLines" 
                    :key="n" 
                    :class="n % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'"
                    :style="{ height: '1.5rem' }"
                  >{{ n }}</div>
                </div>
                <div 
                  class="flex-1 p-2 border-0 bg-gray-50 overflow-auto font-mono text-base whitespace-pre"
                  style="line-height: 1.5rem;"
                >{{ detailModified }}</div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Original Result -->
            <div>
              <label class="block text-gray-700 text-base font-bold mb-2">Original Result</label>
              <div class="relative flex border border-gray-300 rounded-lg overflow-hidden" style="height: 18rem;">
                <div 
                  class="w-12 text-gray-400 text-sm font-mono p-2 overflow-hidden text-right select-none"
                  style="line-height: 1.5rem;"
                >
                  <div 
                    v-for="n in detailOriginalResultLines" 
                    :key="n" 
                    :class="n % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'"
                    :style="{ height: '1.5rem' }"
                  >{{ n }}</div>
                </div>
                <div 
                  class="flex-1 p-2 border-0 bg-gray-50 overflow-auto font-mono text-base whitespace-pre"
                  style="line-height: 1.5rem;"
                >{{ detailOriginalResult }}</div>
              </div>
            </div>

            <!-- Modified Result -->
            <div>
              <label class="block text-gray-700 text-base font-bold mb-2">Modified Result</label>
              <div class="relative flex border border-gray-300 rounded-lg overflow-hidden" style="height: 18rem;">
                <div 
                  class="w-12 text-gray-400 text-sm font-mono p-2 overflow-hidden text-right select-none"
                  style="line-height: 1.5rem;"
                >
                  <div 
                    v-for="n in detailModifiedResultLines" 
                    :key="n" 
                    :class="n % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'"
                    :style="{ height: '1.5rem' }"
                  >{{ n }}</div>
                </div>
                <div 
                  class="flex-1 p-2 border-0 bg-gray-50 overflow-auto font-mono text-base whitespace-pre"
                  style="line-height: 1.5rem;"
                >{{ detailModifiedResult }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDiffCheckerStore } from '../stores/diffChecker'
import { savedResultsApi } from '../api/saved'
import { useAlert } from '../composables/useAlert'
import { useConfirm } from '../composables/useConfirm'

const router = useRouter()
const authStore = useAuthStore()
const diffCheckerStore = useDiffCheckerStore()
const alert = useAlert()
const confirm = useConfirm()

interface SavedResult {
  id: number
  userId: number
  toolType: number
  input: string
  output: string
  createdAt: string
}

const savedResults = ref<SavedResult[]>([])
const loading = ref(false)
const showDetail = ref(false)
const selectedResult = ref<SavedResult | null>(null)

const detailOriginal = ref('')
const detailModified = ref('')
const detailOriginalResult = ref('')
const detailModifiedResult = ref('')

const toolTypeNames: Record<number, string> = {
  1: 'JSON Formatter',
  2: 'JSON Stringify',
  3: 'Markdown Preview',
  4: 'Diff Checker'
}

const toolTypeClasses: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-green-100 text-green-800',
  3: 'bg-purple-100 text-purple-800',
  4: 'bg-yellow-100 text-yellow-800'
}

const getToolTypeName = (type: number) => toolTypeNames[type] || 'Unknown'
const getToolTypeClass = (type: number) => toolTypeClasses[type] || 'bg-gray-100 text-gray-800'

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const getDiffOriginal = (input: string) => {
  const match = input.match(/^Original(?: Input)?:\n([\s\S]*?)(?=\nModified(?: Input)?:|$)/)
  return match ? match[1].trim() : input
}

const getDiffModified = (input: string) => {
  const match = input.match(/\nModified(?: Input)?:\n([\s\S]*)$/)
  return match ? match[1].trim() : ''
}

const getDiffOriginalResult = (output: string) => {
  const match = output.match(/^Original Result:\n([\s\S]*?)(?=\nModified Result:|$)/)
  return match ? match[1].trim() : output.trim()
}

const getDiffModifiedResult = (output: string) => {
  const match = output.match(/\nModified Result:\n([\s\S]*)$/)
  return match ? match[1].trim() : output.trim()
}

const detailOriginalLines = computed(() => {
  const count = detailOriginal.value.split('\n').length
  return count > 0 ? Array.from({ length: count }, (_, i) => i + 1) : [1]
})

const detailModifiedLines = computed(() => {
  const count = detailModified.value.split('\n').length
  return count > 0 ? Array.from({ length: count }, (_, i) => i + 1) : [1]
})

const detailOriginalResultLines = computed(() => {
  const count = detailOriginalResult.value.split('\n').length
  return count > 0 ? Array.from({ length: count }, (_, i) => i + 1) : [1]
})

const detailModifiedResultLines = computed(() => {
  const count = detailModifiedResult.value.split('\n').length
  return count > 0 ? Array.from({ length: count }, (_, i) => i + 1) : [1]
})

const showDiffDetail = (result: SavedResult) => {
  selectedResult.value = result
  detailOriginal.value = getDiffOriginal(result.input)
  detailModified.value = getDiffModified(result.input)
  detailOriginalResult.value = getDiffOriginalResult(result.output)
  detailModifiedResult.value = getDiffModifiedResult(result.output)
  showDetail.value = true
}

const editPreviousInputs = () => {
  diffCheckerStore.setInputs(detailOriginal.value, detailModified.value)
  router.push({ name: 'diff-checker' })
}

const editSolvedInputs = () => {
  diffCheckerStore.setInputs(detailOriginalResult.value, detailModifiedResult.value)
  router.push({ name: 'diff-checker' })
}

const closeDetail = () => {
  showDetail.value = false
  selectedResult.value = null
}

const loadResults = async () => {
  loading.value = true
  try {
    const response = await savedResultsApi.getAll()
    savedResults.value = response.data
  } catch (err: any) {
    console.error('Failed to load saved results:', err)
  } finally {
    loading.value = false
  }
}

const deleteResult = async (id: number) => {
  const confirmed = await confirm.confirm('Are you sure you want to delete this saved result?')
  if (!confirmed) {
    return
  }
  
  try {
    await savedResultsApi.delete(id)
    await loadResults()
    alert.showSuccess('Deleted successfully!')
  } catch (err: any) {
    alert.showError(err.response?.data?.message || 'Failed to delete')
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadResults()
  }
})
</script>

<style scoped>
.markdown-preview :deep(h1) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1f2937;
}
.markdown-preview :deep(h2) {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #374151;
}
.markdown-preview :deep(h3) {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #4b5563;
}
.markdown-preview :deep(h4),
.markdown-preview :deep(h5),
.markdown-preview :deep(h6) {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #4b5563;
}
.markdown-preview :deep(code) {
  background-color: #e5e7eb;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
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
.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
}
.markdown-preview :deep(li) {
  margin-bottom: 0.25rem;
}
.markdown-preview :deep(hr) {
  border-top: 1px solid #d1d5db;
  margin: 0.75rem 0;
}
.markdown-preview :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}
.markdown-preview :deep(p) {
  margin-bottom: 0.5rem;
}

/* Dark mode */
:global(.dark) .markdown-preview :deep(h1)                          { color: #f1f5f9; }
:global(.dark) .markdown-preview :deep(h2)                          { color: #e2e8f0; }
:global(.dark) .markdown-preview :deep(h3),
:global(.dark) .markdown-preview :deep(h4),
:global(.dark) .markdown-preview :deep(h5),
:global(.dark) .markdown-preview :deep(h6)                          { color: #cbd5e1; }
:global(.dark) .markdown-preview :deep(code)                        { background-color: #1c2a3a; color: #e2e8f0; }
:global(.dark) .markdown-preview :deep(blockquote)                  { border-left-color: #374151; color: #94a3b8; }
:global(.dark) .markdown-preview :deep(hr)                          { border-top-color: #374151; }
</style>
