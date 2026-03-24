<template>
  <div class="w-full p-6 sm:p-8 lg:p-10">
    <div class="w-full">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Diff Checker</h1>
      <p class="text-base text-gray-500 mb-5">Paste two texts to compare them side-by-side and highlight the differences.</p>
      
      <!-- INPUT VIEW: Two textareas -->
      <div v-if="viewMode === 'input'">
        <!-- Mobile: Tabs for switching panels -->
        <div class="lg:hidden mb-4">
          <div class="flex border-b border-gray-300">
            <button
              @click="activePanel = 'original'"
              :class="['flex-1 px-4 py-2 text-sm font-medium', activePanel === 'original' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500']"
            >
              Original
            </button>
            <button
              @click="activePanel = 'modified'"
              :class="['flex-1 px-4 py-2 text-sm font-medium', activePanel === 'modified' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500']"
            >
              Modified
            </button>
          </div>
        </div>

        <!-- Desktop: 2-panel layout -->
        <div class="hidden lg:grid lg:grid-cols-2 gap-6 mb-6">
          <!-- Original -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="tool-label">Original Text</label>
              <button
                @click="copyOriginal"
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
                  v-for="n in originalLineCount" 
                  :key="n" 
                  class="tool-gutter-line"
                >{{ n }}</div>
              </div>
              <textarea
                ref="originalTextarea"
                v-model="originalText"
                @scroll="syncScrollOriginal"
                class="tool-textarea"
                placeholder="Line 1&#10;Line 2"
              ></textarea>
            </div>
          </div>
          
          <!-- Modified -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="tool-label">Modified Text</label>
              <button
                @click="copyModified"
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
                  v-for="n in modifiedLineCount" 
                  :key="n" 
                  class="tool-gutter-line"
                >{{ n }}</div>
              </div>
              <textarea
                ref="modifiedTextarea"
                v-model="modifiedText"
                @scroll="syncScrollModified"
                class="tool-textarea"
                placeholder="Line 1&#10;Line 2 modified"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Mobile: Individual panels -->
        <div class="lg:hidden">
          <!-- Mobile Original Panel -->
          <div v-show="activePanel === 'original'" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label class="tool-label">Original Text</label>
              <button
                @click="copyOriginal"
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
                  v-for="n in originalLineCount" 
                  :key="n" 
                  class="tool-gutter-line"
                >{{ n }}</div>
              </div>
              <textarea
                v-model="originalText"
                class="tool-textarea"
                placeholder="Line 1&#10;Line 2"
              ></textarea>
            </div>
          </div>

          <!-- Mobile Modified Panel -->
          <div v-show="activePanel === 'modified'" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label class="tool-label">Modified Text</label>
              <button
                @click="copyModified"
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
                  v-for="n in modifiedLineCount" 
                  :key="n" 
                  class="tool-gutter-line"
                >{{ n }}</div>
              </div>
              <textarea
                v-model="modifiedText"
                class="tool-textarea"
                placeholder="Line 1&#10;Line 2 modified"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Row 3: Compare, Clear, Save buttons -->
        <Toolbar 
          :showPrimary="true" 
          primaryLabel="Compare" 
          @primary="compareDiff" 
          :showClear="false" 
          :showSave="false"
        >
          <button @click="clearAll" class="btn btn-danger">Clear</button>
          <button v-if="authStore.isAuthenticated" @click="saveResult" class="btn btn-primary">Save</button>
        </Toolbar>

        <!-- ── Example ──────────────────────────────────────────────────────── -->
        <details class="mt-3">
          <summary class="cursor-pointer text-sm text-gray-400 select-none hover:text-gray-600">Show example</summary>
          <pre @click="loadExample" class="mt-2 bg-gray-100 p-3 rounded text-sm cursor-pointer hover:bg-gray-200 transition-colors whitespace-pre-wrap">Original:
Line 1
Line 2

Modified:
Line 1
Line 2 modified</pre>
        </details>
      </div>

      <!-- COMPARE VIEW: Side-by-side diff -->
      <div v-if="viewMode === 'compare'">
        <!-- Top bar with back button and controls -->
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="backToEdit"
            class="btn btn-secondary"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Edit
          </button>
          
          <!-- Conflict Count -->
          <div class="flex items-center gap-4">
            <div v-if="conflictCount > 0" class="px-4 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <span class="text-yellow-800 font-medium">{{ conflictCount }}</span>
              <span class="text-yellow-700"> conflict(s) remaining</span>
            </div>
            <div v-if="conflictCount === 0" class="px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <span class="text-green-800 font-medium">All conflicts resolved!</span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button @click="copyResult" class="btn btn-primary">
              Copy Result
            </button>
            <button v-if="authStore.isAuthenticated" @click="saveResult" class="btn btn-primary">
              Save
            </button>
          </div>
        </div>

        <!-- Side-by-side comparison panels -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Original Panel -->
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-3 border-b border-gray-300">
              <span class="font-bold text-gray-700 text-base">Original Text</span>
              <span class="text-gray-500 text-base ml-2">({{ originalLineCount }} lines)</span>
            </div>
            <div 
              class="overflow-auto font-mono text-base"
              style="height: 40rem; line-height: 1.5rem;"
              ref="compareOriginalPanel"
              @scroll="syncCompareScrollOriginal"
            >
              <template v-for="block in originalBlocks" :key="block.startIndex">
                <!-- Normal block -->
                <div 
                  v-if="block.type === 'normal'"
                  v-for="(line, idx) in block.lines" 
                  :key="block.startIndex + idx"
                  :class="(block.startIndex + idx) % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                >
                  <div class="flex">
                    <span class="w-12 flex-shrink-0 text-right pr-2 text-gray-400 select-none bg-gray-100">{{ block.startIndex + idx + 1 }}</span>
                    <span class="flex-1 p-1" style="white-space: pre;">{{ line }}</span>
                  </div>
                </div>
                
                <!-- Conflict block with full border -->
                <div 
                  v-if="block.type === 'conflict'"
                  :class="[
                    getConflictBlockClass(block.conflictId!, 'orig'),
                    'border-2 border-red-500 rounded-md mb-2',
                    !isConflictResolved(block.conflictId!) && selectedConflict === block.conflictId ? 'cursor-pointer' : ''
                  ]"
                  @click="!isConflictResolved(block.conflictId!) ? toggleConflict(block.conflictId!) : null"
                >
                <div 
                  v-for="(line, idx) in block.lines" 
                  :key="block.startIndex + idx"
                  :class="getConflictLineClass(block.conflictId!, 'orig')"
                >
                  <div class="flex">
                    <span class="w-12 flex-shrink-0 text-right pr-2 text-gray-400 select-none bg-gray-100">{{ block.startIndex + idx + 1 }}</span>
                    <span class="flex-1 p-1" style="white-space: pre;">
                      <template v-if="isConflictResolved(block.conflictId!)">{{ line }}</template>
                      <template v-else v-for="(seg, segIdx) in getCharDiff(line, getCorrespondingLine(block.startIndex + idx, 'orig'), 'orig')" :key="segIdx">
                        <span :class="seg.isDiff ? 'bg-red-300 font-semibold' : ''" style="white-space: pre;">{{ seg.text }}</span>
                      </template>
                    </span>
                    <span v-if="idx === 0 && !isConflictResolved(block.conflictId!)" class="text-sm text-blue-600 mr-2 self-center">click</span>
                  </div>
                </div>
                  
                  <!-- Buttons below the block -->
                  <div 
                    v-if="selectedConflict === block.conflictId && !isConflictResolved(block.conflictId!)"
                    class="p-2 bg-red-50 rounded-b-md"
                  >
                    <button 
                      @click.stop="acceptOriginal(block.conflictId!)"
                      class="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Accept Original
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Modified Panel -->
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-3 border-b border-gray-300">
              <span class="font-bold text-gray-700 text-base">Modified Text</span>
              <span class="text-gray-500 text-base ml-2">({{ modifiedLineCount }} lines)</span>
            </div>
            <div 
              class="overflow-auto font-mono text-base"
              style="height: 40rem; line-height: 1.5rem;"
              ref="compareModifiedPanel"
              @scroll="syncCompareScrollModified"
            >
              <template v-for="block in modifiedBlocks" :key="block.startIndex">
                <!-- Normal block -->
                <div 
                  v-if="block.type === 'normal'"
                  v-for="(line, idx) in block.lines" 
                  :key="block.startIndex + idx"
                  :class="(block.startIndex + idx) % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                >
                  <div class="flex">
                    <span class="w-12 flex-shrink-0 text-right pr-2 text-gray-400 select-none bg-gray-100">{{ block.startIndex + idx + 1 }}</span>
                    <span class="flex-1 p-1" style="white-space: pre;">{{ line }}</span>
                  </div>
                </div>
                
                <!-- Conflict block with full border -->
                <div 
                  v-if="block.type === 'conflict'"
                  :class="[
                    getConflictBlockClass(block.conflictId!, 'mod'),
                    'border-2 border-green-500 rounded-md mb-2',
                    !isConflictResolved(block.conflictId!) && selectedConflict === block.conflictId ? 'cursor-pointer' : ''
                  ]"
                  @click="!isConflictResolved(block.conflictId!) ? toggleConflict(block.conflictId!) : null"
                >
                  <div 
                    v-for="(line, idx) in block.lines" 
                    :key="block.startIndex + idx"
                    :class="getConflictLineClass(block.conflictId!, 'mod')"
                  >
                    <div class="flex">
                      <span class="w-12 flex-shrink-0 text-right pr-2 text-gray-400 select-none bg-gray-100">{{ block.startIndex + idx + 1 }}</span>
                      <span class="flex-1 p-1" style="white-space: pre;">
                        <template v-if="isConflictResolved(block.conflictId!)">{{ line }}</template>
                        <template v-else v-for="(seg, segIdx) in getCharDiff(getCorrespondingLine(block.startIndex + idx, 'mod'), line, 'mod')" :key="segIdx">
                          <span :class="seg.isDiff ? 'bg-green-300 font-semibold' : ''" style="white-space: pre;">{{ seg.text }}</span>
                        </template>
                      </span>
                      <span v-if="idx === 0 && !isConflictResolved(block.conflictId!)" class="text-sm text-blue-600 mr-2 self-center">click</span>
                    </div>
                  </div>
                  
                  <!-- Buttons below the block -->
                  <div 
                    v-if="selectedConflict === block.conflictId && !isConflictResolved(block.conflictId!)"
                    class="p-2 bg-green-50 rounded-b-md"
                  >
                    <button 
                      @click.stop="acceptModified(block.conflictId!)"
                      class="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Accept Modified
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Result preview at bottom -->
        <div class="mt-6">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-gray-700 text-base font-bold">Result Preview</label>
          </div>
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <span class="font-bold text-gray-700">Merged Result</span>
            </div>
            <div 
              class="overflow-auto font-mono text-base p-4 bg-gray-50"
              style="height: 18rem; line-height: 1.5rem; white-space: pre-wrap; word-break: break-all;"
            >
              <div v-if="mergedResult.length === 0" class="text-gray-400 italic">
                No result yet. Resolve conflicts to see merged result.
              </div>
              <template v-else>
                <span v-for="(line, index) in mergedResult" :key="index">{{ line }}<br v-if="index < mergedResult.length - 1"></span>
              </template>
            </div>
          </div>
        </div>
      </div>
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

// View mode: 'input' or 'compare'
const viewMode = ref<'input' | 'compare'>('input')

// Input texts
const originalText = ref('')
const modifiedText = ref('')
const activePanel = ref<'original' | 'modified'>('original')

// Textarea refs for scrolling
const originalTextarea = ref<HTMLTextAreaElement | null>(null)
const modifiedTextarea = ref<HTMLTextAreaElement | null>(null)

// Compare panel refs for scrolling
const compareOriginalPanel = ref<HTMLElement | null>(null)
const compareModifiedPanel = ref<HTMLElement | null>(null)

// Line counts for input view
const originalLineCount = computed(() => {
  const count = originalText.value.split('\n').length
  return count > 0 ? count : 1
})

const modifiedLineCount = computed(() => {
  const count = modifiedText.value.split('\n').length
  return count > 0 ? count : 1
})

// Arrays for compare view
const originalLinesArr = computed(() => originalText.value.split('\n'))
const modifiedLinesArr = computed(() => modifiedText.value.split('\n'))

// Compute original blocks for rendering
interface LineBlock {
  type: 'normal' | 'conflict'
  startIndex: number
  endIndex: number
  conflictId?: number
  lines: string[]
}

// Conflict tracking
interface Conflict {
  id: number
  origStartIndex: number
  origEndIndex: number
  modStartIndex: number
  modEndIndex: number
  resolved: boolean
  resolvedWith: 'original' | 'modified' | null
}

const conflicts = ref<Conflict[]>([])
const selectedConflict = ref<number | null>(null)
let conflictIdCounter = 0

// Computed blocks for original - shows accepted text when resolved
const originalBlocks = computed((): LineBlock[] => {
  const blocks: LineBlock[] = []
  const lines = originalLinesArr.value
  const sortedConflicts = [...conflicts.value]
    .filter(c => c.origStartIndex !== -1 && c.origEndIndex !== -1)
    .sort((a, b) => a.origStartIndex - b.origStartIndex)
  
  let prevEnd = -1
  
  for (const conflict of sortedConflicts) {
    if (conflict.origStartIndex > prevEnd + 1) {
      blocks.push({
        type: 'normal',
        startIndex: prevEnd + 1,
        endIndex: conflict.origStartIndex - 1,
        lines: lines.slice(prevEnd + 1, conflict.origStartIndex)
      })
    }
    
    let displayLines: string[]
    if (conflict.resolved && conflict.resolvedWith === 'modified') {
      displayLines = modifiedLinesArr.value.slice(conflict.modStartIndex, conflict.modEndIndex + 1)
    } else {
      displayLines = lines.slice(conflict.origStartIndex, conflict.origEndIndex + 1)
    }
    
    blocks.push({
      type: conflict.resolved ? 'normal' : 'conflict',
      startIndex: conflict.origStartIndex,
      endIndex: conflict.origEndIndex,
      conflictId: conflict.id,
      lines: displayLines
    })
    prevEnd = conflict.origEndIndex
  }
  
  if (prevEnd < lines.length - 1) {
    blocks.push({
      type: 'normal',
      startIndex: prevEnd + 1,
      endIndex: lines.length - 1,
      lines: lines.slice(prevEnd + 1)
    })
  }
  
  return blocks
})

// Computed blocks for modified - shows accepted text when resolved
const modifiedBlocks = computed((): LineBlock[] => {
  const blocks: LineBlock[] = []
  const lines = modifiedLinesArr.value
  const sortedConflicts = [...conflicts.value]
    .filter(c => c.modStartIndex !== -1 && c.modEndIndex !== -1)
    .sort((a, b) => a.modStartIndex - b.modStartIndex)
  
  let prevEnd = -1
  
  for (const conflict of sortedConflicts) {
    if (conflict.modStartIndex > prevEnd + 1) {
      blocks.push({
        type: 'normal',
        startIndex: prevEnd + 1,
        endIndex: conflict.modStartIndex - 1,
        lines: lines.slice(prevEnd + 1, conflict.modStartIndex)
      })
    }
    
    let displayLines: string[]
    if (conflict.resolved && conflict.resolvedWith === 'original') {
      displayLines = originalLinesArr.value.slice(conflict.origStartIndex, conflict.origEndIndex + 1)
    } else {
      displayLines = lines.slice(conflict.modStartIndex, conflict.modEndIndex + 1)
    }
    
    blocks.push({
      type: conflict.resolved ? 'normal' : 'conflict',
      startIndex: conflict.modStartIndex,
      endIndex: conflict.modEndIndex,
      conflictId: conflict.id,
      lines: displayLines
    })
    prevEnd = conflict.modEndIndex
  }
  
  if (prevEnd < lines.length - 1) {
    blocks.push({
      type: 'normal',
      startIndex: prevEnd + 1,
      endIndex: lines.length - 1,
      lines: lines.slice(prevEnd + 1)
    })
  }
  
  return blocks
})

const conflictCount = computed(() => conflicts.value.filter(c => !c.resolved).length)

// Merge results based on resolved conflicts
const mergedResult = computed(() => {
  const result: string[] = []
  const origLines = originalLinesArr.value
  const modLines = modifiedLinesArr.value
  const maxLength = Math.max(origLines.length, modLines.length)
  
  let i = 0
  while (i < maxLength) {
    // Check if this line is in a conflict block
    const conflict = conflicts.value.find(c => 
      (c.origStartIndex !== -1 && i >= c.origStartIndex && i <= c.origEndIndex) ||
      (c.modStartIndex !== -1 && i >= c.modStartIndex && i <= c.modEndIndex)
    )
    
    if (conflict) {
      if (conflict.resolved) {
        // Add all lines from the resolved side
        if (conflict.resolvedWith === 'original' && conflict.origStartIndex !== -1) {
          for (let j = conflict.origStartIndex; j <= conflict.origEndIndex; j++) {
            result.push(origLines[j] ?? '')
          }
        } else if (conflict.resolvedWith === 'modified' && conflict.modStartIndex !== -1) {
          for (let j = conflict.modStartIndex; j <= conflict.modEndIndex; j++) {
            result.push(modLines[j] ?? '')
          }
        }
      }
      // Skip to end of block
      const blockEnd = Math.max(conflict.origEndIndex, conflict.modEndIndex)
      i = blockEnd + 1
    } else {
      // No conflict - lines are the same
      if (origLines[i] !== undefined && modLines[i] !== undefined) {
        result.push(origLines[i])
      } else if (origLines[i] !== undefined) {
        result.push(origLines[i])
      } else if (modLines[i] !== undefined) {
        result.push(modLines[i])
      }
      i++
    }
  }
  
  return result
})

// Character-level diff segments
interface DiffSegment {
  text: string
  isDiff: boolean
}

// Compute character-level diff for a line
const getCharDiff = (origLine: string, modLine: string, side: 'orig' | 'mod'): DiffSegment[] => {
  const segments: DiffSegment[] = []
  const maxLen = Math.max(origLine.length, modLine.length)
  
  let i = 0
  let currentSegment = ''
  let isCurrentDiff = false
  
  while (i < maxLen) {
    const origChar = origLine[i] ?? ''
    const modChar = modLine[i] ?? ''
    const isDiff = origChar !== modChar
    
    if (i === 0) {
      isCurrentDiff = isDiff
      currentSegment = side === 'orig' ? origChar : modChar
    } else if (isDiff === isCurrentDiff) {
      currentSegment += side === 'orig' ? origChar : modChar
    } else {
      segments.push({ text: currentSegment, isDiff: isCurrentDiff })
      isCurrentDiff = isDiff
      currentSegment = side === 'orig' ? origChar : modChar
    }
    i++
  }
  
  if (currentSegment) {
    segments.push({ text: currentSegment, isDiff: isCurrentDiff })
  }
  
  return segments
}

// Get corresponding line from opposite side
const getCorrespondingLine = (index: number, side: 'orig' | 'mod'): string => {
  const conflict = conflicts.value.find(c => 
    side === 'orig' ? 
      (c.origStartIndex !== -1 && index >= c.origStartIndex && index <= c.origEndIndex) :
      (c.modStartIndex !== -1 && index >= c.modStartIndex && index <= c.modEndIndex)
  )
  
  if (conflict) {
    if (side === 'orig' && conflict.modStartIndex !== -1) {
      const modIndex = conflict.modStartIndex + (index - conflict.origStartIndex)
      return modifiedLinesArr.value[modIndex] ?? ''
    } else if (side === 'mod' && conflict.origStartIndex !== -1) {
      const origIndex = conflict.origStartIndex + (index - conflict.modStartIndex)
      return originalLinesArr.value[origIndex] ?? ''
    }
  }
  return ''
}

// Toggle conflict selection
const toggleConflict = (conflictId: number) => {
  if (selectedConflict.value === conflictId) {
    selectedConflict.value = null
  } else {
    selectedConflict.value = conflictId
  }
}

// Accept original for a conflict block
const acceptOriginal = (conflictId: number) => {
  const conflict = conflicts.value.find(c => c.id === conflictId)
  if (conflict) {
    conflict.resolved = true
    conflict.resolvedWith = 'original'
    selectedConflict.value = null
    alert.showSuccess('Accepted original text')
  }
}

// Accept modified for a conflict block
const acceptModified = (conflictId: number) => {
  const conflict = conflicts.value.find(c => c.id === conflictId)
  if (conflict) {
    conflict.resolved = true
    conflict.resolvedWith = 'modified'
    selectedConflict.value = null
    alert.showSuccess('Accepted modified text')
  }
}

// Check if conflict is resolved
const isConflictResolved = (conflictId: number) => {
  const conflict = conflicts.value.find(c => c.id === conflictId)
  return conflict?.resolved || false
}

// Get class for conflict block container
const getConflictBlockClass = (conflictId: number, side: 'orig' | 'mod') => {
  const conflict = conflicts.value.find(c => c.id === conflictId)
  if (!conflict) return ''
  
  if (conflict.resolved) {
    if ((side === 'orig' && conflict.resolvedWith === 'original') ||
        (side === 'mod' && conflict.resolvedWith === 'modified')) {
      return 'border-blue-500'
    }
    return 'border-gray-300 opacity-50'
  }
  return ''
}

// Get class for lines inside conflict block
const getConflictLineClass = (conflictId: number, side: 'orig' | 'mod') => {
  const conflict = conflicts.value.find(c => c.id === conflictId)
  if (!conflict) return ''
  
  if (conflict.resolved) {
    return '' // Normal styling when resolved
  }
  return side === 'orig' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
}

// Sync scroll for input view
const syncScrollOriginal = () => {
  if (originalTextarea.value) {
    const container = originalTextarea.value.parentElement as HTMLElement
    const lineNumbers = container?.querySelector('.tool-gutter') as HTMLElement
    if (lineNumbers) {
      lineNumbers.scrollTop = originalTextarea.value.scrollTop
    }
  }
}

const syncScrollModified = () => {
  if (modifiedTextarea.value) {
    const container = modifiedTextarea.value.parentElement as HTMLElement
    const lineNumbers = container?.querySelector('.tool-gutter') as HTMLElement
    if (lineNumbers) {
      lineNumbers.scrollTop = modifiedTextarea.value.scrollTop
    }
  }
}

// Sync scroll for compare view
const syncCompareScrollOriginal = () => {
  if (compareOriginalPanel.value && compareModifiedPanel.value) {
    compareModifiedPanel.value.scrollTop = compareOriginalPanel.value.scrollTop
  }
}

const syncCompareScrollModified = () => {
  if (compareOriginalPanel.value && compareModifiedPanel.value) {
    compareOriginalPanel.value.scrollTop = compareModifiedPanel.value.scrollTop
  }
}

// Compare diff
const compareDiff = () => {
  if (!originalText.value.trim() && !modifiedText.value.trim()) {
    alert.showError('Please enter text in at least one field')
    return
  }
  
  // Detect conflicts as blocks
  conflicts.value = []
  conflictIdCounter = 0
  
  const origLines = originalText.value.split('\n')
  const modLines = modifiedText.value.split('\n')
  
  const maxLength = Math.max(origLines.length, modLines.length)
  
  let currentBlockStart = -1
  let currentBlockOrigStart = -1
  let currentBlockModStart = -1
  
  for (let i = 0; i < maxLength; i++) {
    const origLine = origLines[i]
    const modLine = modLines[i]
    
    // Check if lines differ
    if (origLine !== modLine) {
      // Start a new block if not already in one
      if (currentBlockStart === -1) {
        currentBlockStart = i
        currentBlockOrigStart = origLines[i] !== undefined ? i : -1
        currentBlockModStart = modLines[i] !== undefined ? i : -1
      }
    } else {
      // Lines are the same - close block if open
      if (currentBlockStart !== -1) {
        conflictIdCounter++
        conflicts.value.push({
          id: conflictIdCounter,
          origStartIndex: currentBlockOrigStart,
          origEndIndex: i - 1,
          modStartIndex: currentBlockModStart,
          modEndIndex: i - 1,
          resolved: false,
          resolvedWith: null
        })
        currentBlockStart = -1
        currentBlockOrigStart = -1
        currentBlockModStart = -1
      }
    }
  }
  
  // Close any remaining block at end
  if (currentBlockStart !== -1) {
    conflictIdCounter++
    conflicts.value.push({
      id: conflictIdCounter,
      origStartIndex: currentBlockOrigStart,
      origEndIndex: origLines.length - 1,
      modStartIndex: currentBlockModStart,
      modEndIndex: modLines.length - 1,
      resolved: false,
      resolvedWith: null
    })
  }
  
  // Switch to compare view
  viewMode.value = 'compare'
}

// Back to edit
const backToEdit = () => {
  selectedConflict.value = null
  viewMode.value = 'input'
}

// Copy functions
const copyOriginal = () => {
  if (originalText.value) {
    navigator.clipboard.writeText(originalText.value)
    alert.showSuccess('Original text copied to clipboard!')
  }
}

const copyModified = () => {
  if (modifiedText.value) {
    navigator.clipboard.writeText(modifiedText.value)
    alert.showSuccess('Modified text copied to clipboard!')
  }
}

const copyResult = () => {
  if (mergedResult.value.length > 0) {
    navigator.clipboard.writeText(mergedResult.value.join('\n'))
    alert.showSuccess('Result copied to clipboard!')
  }
}

const loadExample = () => {
  originalText.value = `Line 1\nLine 2`
  modifiedText.value = `Line 1\nLine 2 modified`
}

// Clear all
const clearAll = async () => {
  const confirmed = await confirm.confirm('Are you sure you want to clear all text?')
  if (!confirmed) return
  
  originalText.value = ''
  modifiedText.value = ''
  conflicts.value = []
  selectedConflict.value = null
  viewMode.value = 'input'
}

// Save result
const saveResult = async () => {
  if (!authStore.isAuthenticated) {
    alert.showError('Please login to save results')
    return
  }
  
  if (!originalText.value.trim() && !modifiedText.value.trim()) {
    alert.showError('Please enter text in at least one field')
    return
  }
  
  try {
    await savedResultsApi.create({
      toolType: 4,
      input: `Original:\n${originalText.value}\n\nModified:\n${modifiedText.value}`,
      output: mergedResult.value.join('\n')
    })
    alert.showSuccess('Saved successfully!')
  } catch (err: any) {
    alert.showError(err.response?.data?.message || 'Failed to save')
  }
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
</style>
