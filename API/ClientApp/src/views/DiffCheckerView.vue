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
              <div class="tool-gutter" ref="origDesktopGutter">
                <div class="gutter-inner" :style="{ transform: `translateY(-${origScrollTop}px)` }">
                  <div v-for="(entry, i) in originalGutterEntries" :key="i" class="tool-gutter-line">{{ entry ?? '' }}</div>
                </div>
              </div>
              <textarea
                ref="originalTextarea"
                v-model="originalText"
                @scroll="syncScrollOriginal"
                @input="recomputeOriginalLines"
                class="tool-textarea diff-textarea"
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
                <div class="gutter-inner" :style="{ transform: `translateY(-${modScrollTop}px)` }">
                  <div v-for="(entry, i) in modifiedGutterEntries" :key="i" class="tool-gutter-line">{{ entry ?? '' }}</div>
                </div>
              </div>
              <textarea
                ref="modifiedTextarea"
                v-model="modifiedText"
                @scroll="syncScrollModified"
                @input="recomputeModifiedLines"
                class="tool-textarea diff-textarea"
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
                <div class="gutter-inner" :style="{ transform: `translateY(-${origScrollTop}px)` }">
                  <div v-for="(entry, i) in originalGutterEntries" :key="i" class="tool-gutter-line">{{ entry ?? '' }}</div>
                </div>
              </div>
              <textarea
                ref="mobileOriginalTextarea"
                v-model="originalText"
                @scroll="syncScrollOriginal"
                @input="recomputeOriginalLines"
                class="tool-textarea diff-textarea"
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
                <div class="gutter-inner" :style="{ transform: `translateY(-${modScrollTop}px)` }">
                  <div v-for="(entry, i) in modifiedGutterEntries" :key="i" class="tool-gutter-line">{{ entry ?? '' }}</div>
                </div>
              </div>
              <textarea
                ref="mobileModifiedTextarea"
                v-model="modifiedText"
                @scroll="syncScrollModified"
                @input="recomputeModifiedLines"
                class="tool-textarea diff-textarea"
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
          <summary class="cursor-pointer text-sm text-gray-400 select-none hover:text-gray-600 outline-none">
            Show example
          </summary>
          
          <div @click="loadExample" class="mt-2 bg-gray-100 p-3 rounded text-sm cursor-pointer hover:bg-gray-200 transition-colors flex gap-4 overflow-hidden">
            <div class="flex-1 pr-4 border-r border-gray-300">
              <pre class="whitespace-pre-wrap">
                Original :

                Line 1
                Line 2
              </pre>
            </div>

            <div class="flex-1">
              <pre class="whitespace-pre-wrap">
                Modified :

                Line 1
                Line 2 modified
              </pre>
            </div>
          </div>
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
          <div class="flex items-center gap-3 flex-wrap">
            <div v-if="conflictCount > 0" class="px-3 py-1.5 bg-gray-100 rounded border border-gray-300 text-sm text-gray-600">
              <span class="font-medium text-gray-800">{{ conflictCount }}</span> change(s) remaining
            </div>
            <div v-if="conflictCount === 0" class="px-3 py-1.5 bg-gray-100 rounded border border-gray-300 text-sm text-gray-600">
              All changes resolved
            </div>
            <!-- Bulk-resolve buttons — only shown when multiple conflicts remain -->
            <template v-if="conflictCount > 1">
              <button
                @click="acceptAllOriginal"
                class="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                title="Resolve all remaining changes by keeping original text"
              >
                Accept All → Original
              </button>
              <button
                @click="acceptAllModified"
                class="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                title="Resolve all remaining changes by keeping modified text"
              >
                Accept All ← Modified
              </button>
            </template>
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
              style="height: 40rem; line-height: 2.25rem;"
              ref="compareOriginalPanel"
              @scroll="syncCompareScrollOriginal"
            >
              <template v-for="seg in rowSegments" :key="seg.segStartIdx">
                <!-- Equal segment -->
                <template v-if="seg.type === 'equal'">
                  <div
                    v-for="(row, idx) in seg.rows"
                    :key="seg.segStartIdx + idx"
                    :class="selectedRowIdx === seg.segStartIdx + idx ? 'bg-blue-50' : 'bg-white'"
                    style="height: 2.25rem;"
                    @click="handleRowClick(seg.segStartIdx + idx, null)"
                  >
                    <div class="flex h-full items-center">
                      <span class="w-12 flex-shrink-0 text-right pr-2 text-gray-400 select-none bg-gray-100 self-stretch flex items-center justify-end">{{ row.origLineNum }}</span>
                      <span class="flex-1 px-1 truncate" style="white-space: pre;">{{ row.origLine }}</span>
                    </div>
                  </div>
                </template>

                <!-- Conflict segment -->
                <div
                  v-else
                  :class="[
                    isConflictResolved(seg.conflictId!) ? 'border-l-4 border-gray-300' : 'border-l-4 border-orange-400',
                    'mb-0.5'
                  ]"
                >
                  <div v-for="(row, idx) in seg.rows" :key="seg.segStartIdx + idx">
                    <!-- Filler row: insert row has no orig line -->
                    <div
                      v-if="row.origLine === null"
                      :class="[selectedRowIdx === seg.segStartIdx + idx ? 'bg-blue-50' : 'filler-stripe']"
                      style="height: 2.25rem;"
                      @click.stop="handleRowClick(seg.segStartIdx + idx, seg.conflictId)"
                    >
                      <div class="flex h-full items-center">
                        <span class="w-12 flex-shrink-0 self-stretch filler-stripe-gutter"></span>
                        <span class="flex-1"></span>
                      </div>
                    </div>
                    <!-- Content row: delete or replace -->
                    <div
                      v-else
                      :class="selectedRowIdx === seg.segStartIdx + idx ? 'bg-blue-50' : (isConflictResolved(seg.conflictId!) ? '' : 'bg-red-50')"
                      style="height: 2.25rem;"
                      @click.stop="handleRowClick(seg.segStartIdx + idx, seg.conflictId)"
                    >
                      <div class="flex h-full items-center">
                        <span class="w-12 flex-shrink-0 text-right pr-2 text-gray-400 select-none bg-gray-100 self-stretch flex items-center justify-end">{{ row.origLineNum }}</span>
                        <span class="flex-1 px-1 truncate" style="white-space: pre;">
                          <template v-if="!isConflictResolved(seg.conflictId!) && row.type === 'replace'">
                            <template v-for="(s, si) in getCharDiff(row.origLine, row.modLine!, 'orig')" :key="si">
                              <span :class="s.isDiff ? 'bg-red-200 font-semibold' : ''" style="white-space: pre;">{{ s.text }}</span>
                            </template>
                          </template>
                          <template v-else>{{ row.origLine }}</template>
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Orig panel action bar -->
                  <div v-if="selectedConflict === seg.conflictId">
                    <!-- Unresolved: show accept button -->
                    <div v-if="!isConflictResolved(seg.conflictId!)" class="p-2 bg-gray-50 border-t border-gray-200">
                      <button
                        @click.stop="acceptOriginal(seg.conflictId!)"
                        class="w-full px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded border border-red-300 hover:bg-red-100 transition-colors"
                      >
                        Keep Original
                      </button>
                    </div>
                    <!-- Resolved: show current state + change / undo options -->
                    <div v-else class="p-2 bg-gray-50 border-t border-gray-200 flex flex-col gap-1">
                      <span class="text-xs text-gray-500">Using: <span class="font-medium text-gray-700">{{ conflicts.find(c => c.id === seg.conflictId)?.resolvedWith === 'original' ? 'Original' : 'Modified' }}</span></span>
                      <div class="flex gap-1">
                        <button
                          v-if="conflicts.find(c => c.id === seg.conflictId)?.resolvedWith !== 'original'"
                          @click.stop="acceptOriginal(seg.conflictId!)"
                          class="flex-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded border border-red-300 hover:bg-red-100 transition-colors"
                        >
                          Keep Original
                        </button>
                        <button
                          @click.stop="unresolveConflict(seg.conflictId!)"
                          class="px-3 py-1.5 bg-white text-gray-500 text-sm rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          Undo
                        </button>
                      </div>
                    </div>
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
              style="height: 40rem; line-height: 2.25rem;"
              ref="compareModifiedPanel"
              @scroll="syncCompareScrollModified"
            >
              <template v-for="seg in rowSegments" :key="seg.segStartIdx">
                <!-- Equal segment -->
                <template v-if="seg.type === 'equal'">
                  <div
                    v-for="(row, idx) in seg.rows"
                    :key="seg.segStartIdx + idx"
                    :class="selectedRowIdx === seg.segStartIdx + idx ? 'bg-blue-50' : 'bg-white'"
                    style="height: 2.25rem;"
                    @click="handleRowClick(seg.segStartIdx + idx, null)"
                  >
                    <div class="flex h-full items-center">
                      <span class="w-12 flex-shrink-0 text-right pr-2 text-gray-400 select-none bg-gray-100 self-stretch flex items-center justify-end">{{ row.modLineNum }}</span>
                      <span class="flex-1 px-1 truncate" style="white-space: pre;">{{ row.modLine }}</span>
                    </div>
                  </div>
                </template>

                <!-- Conflict segment -->
                <div
                  v-else
                  :class="[
                    isConflictResolved(seg.conflictId!) ? 'border-l-4 border-gray-300' : 'border-l-4 border-orange-400',
                    'mb-0.5'
                  ]"
                >
                  <div v-for="(row, idx) in seg.rows" :key="seg.segStartIdx + idx">
                    <!-- Filler row: delete row has no mod line -->
                    <div
                      v-if="row.modLine === null"
                      :class="[selectedRowIdx === seg.segStartIdx + idx ? 'bg-blue-50' : 'filler-stripe']"
                      style="height: 2.25rem;"
                      @click.stop="handleRowClick(seg.segStartIdx + idx, seg.conflictId)"
                    >
                      <div class="flex h-full items-center">
                        <span class="w-12 flex-shrink-0 self-stretch filler-stripe-gutter"></span>
                        <span class="flex-1"></span>
                      </div>
                    </div>
                    <!-- Content row: insert or replace -->
                    <div
                      v-else
                      :class="selectedRowIdx === seg.segStartIdx + idx ? 'bg-blue-50' : (isConflictResolved(seg.conflictId!) ? '' : 'bg-green-50')"
                      style="height: 2.25rem;"
                      @click.stop="handleRowClick(seg.segStartIdx + idx, seg.conflictId)"
                    >
                      <div class="flex h-full items-center">
                        <span class="w-12 flex-shrink-0 text-right pr-2 text-gray-400 select-none bg-gray-100 self-stretch flex items-center justify-end">{{ row.modLineNum }}</span>
                        <span class="flex-1 px-1 truncate" style="white-space: pre;">
                          <template v-if="!isConflictResolved(seg.conflictId!) && row.type === 'replace'">
                            <template v-for="(s, si) in getCharDiff(row.origLine!, row.modLine, 'mod')" :key="si">
                              <span :class="s.isDiff ? 'bg-green-200 font-semibold' : ''" style="white-space: pre;">{{ s.text }}</span>
                            </template>
                          </template>
                          <template v-else>{{ row.modLine }}</template>
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Mod panel action bar -->
                  <div v-if="selectedConflict === seg.conflictId">
                    <!-- Unresolved: show accept button -->
                    <div v-if="!isConflictResolved(seg.conflictId!)" class="p-2 bg-gray-50 border-t border-gray-200">
                      <button
                        @click.stop="acceptModified(seg.conflictId!)"
                        class="w-full px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded border border-green-300 hover:bg-green-100 transition-colors"
                      >
                        Keep Modified
                      </button>
                    </div>
                    <!-- Resolved: show current state + change / undo options -->
                    <div v-else class="p-2 bg-gray-50 border-t border-gray-200 flex flex-col gap-1">
                      <span class="text-xs text-gray-500">Using: <span class="font-medium text-gray-700">{{ conflicts.find(c => c.id === seg.conflictId)?.resolvedWith === 'modified' ? 'Modified' : 'Original' }}</span></span>
                      <div class="flex gap-1">
                        <button
                          v-if="conflicts.find(c => c.id === seg.conflictId)?.resolvedWith !== 'modified'"
                          @click.stop="acceptModified(seg.conflictId!)"
                          class="flex-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded border border-green-300 hover:bg-green-100 transition-colors"
                        >
                          Keep Modified
                        </button>
                        <button
                          @click.stop="unresolveConflict(seg.conflictId!)"
                          class="px-3 py-1.5 bg-white text-gray-500 text-sm rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          Undo
                        </button>
                      </div>
                    </div>
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
              <span class="text-gray-500 text-base ml-2">({{ mergedResult.length }} lines)</span>
            </div>
            <div
              ref="compareResultPanel"
              class="overflow-auto font-mono text-base bg-gray-50"
              style="height: 18rem; line-height: 2.25rem;"
              @scroll="syncCompareScrollResult"
            >
              <div v-if="mergedResult.length === 0" class="p-4 text-gray-400 italic">
                No result yet. Resolve changes to see merged result.
              </div>
              <template v-else>
                <div
                  v-for="(line, index) in mergedResult"
                  :key="index"
                  :class="mergedResultMap[index] === selectedRowIdx ? 'bg-blue-50' : 'bg-white'"
                  style="height: 2.25rem;"
                  @click="handleRowClick(mergedResultMap[index], null)"
                >
                  <div class="flex h-full items-center">
                    <span class="w-12 flex-shrink-0 text-right pr-2 text-gray-400 select-none bg-gray-100 self-stretch flex items-center justify-end">{{ index + 1 }}</span>
                    <span class="flex-1 px-1 truncate" style="white-space: pre;">{{ line }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
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
const originalTextarea       = ref<HTMLTextAreaElement | null>(null)
const modifiedTextarea        = ref<HTMLTextAreaElement | null>(null)
const mobileOriginalTextarea = ref<HTMLTextAreaElement | null>(null)
const mobileModifiedTextarea = ref<HTMLTextAreaElement | null>(null)

// Compare panel refs for scrolling
const compareOriginalPanel = ref<HTMLElement | null>(null)
const compareModifiedPanel = ref<HTMLElement | null>(null)
const compareResultPanel   = ref<HTMLElement | null>(null)

// Scroll offsets — drive gutter translateY so sync is always pixel-perfect
const origScrollTop = ref(0)
const modScrollTop  = ref(0)

// Logical line counts — used in compare view header only
const originalLineCount = computed(() => Math.max(1, originalText.value.split('\n').length))
const modifiedLineCount = computed(() => Math.max(1, modifiedText.value.split('\n').length))

// ── Gutter entries ──────────────────────────────────────────────────
// For each logical line we measure how many visual rows it wraps to.
// Shows the logical line number on the FIRST visual row; blank spacers
// for every wrapped continuation row so the gutter stays pixel-perfect.
type GutterEntry = number | null

const originalGutterEntries = ref<GutterEntry[]>([1])
const modifiedGutterEntries = ref<GutterEntry[]>([1])

// Reusable off-screen gauge div (created once, reused for all measurements)
let gaugeEl: HTMLDivElement | null = null
const getGauge = (): HTMLDivElement => {
  if (!gaugeEl) {
    gaugeEl = document.createElement('div')
    gaugeEl.setAttribute('aria-hidden', 'true')
    Object.assign(gaugeEl.style, {
      position: 'absolute', visibility: 'hidden', pointerEvents: 'none',
      top: '-9999px', left: '-9999px',
      whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
      boxSizing: 'content-box', border: 'none', padding: '0', margin: '0',
    })
    document.body.appendChild(gaugeEl)
  }
  return gaugeEl
}

const buildGutterEntries = (text: string, textareaEl: HTMLTextAreaElement): GutterEntry[] => {
  const cs = getComputedStyle(textareaEl)
  const lineH = parseFloat(cs.lineHeight) || 24

  // clientWidth is 0 when the panel is hidden (inactive mobile tab).
  // Fall back to the container width minus the gutter (3.5rem = 56px).
  let innerW = textareaEl.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
  if (innerW <= 0) {
    const container = textareaEl.closest('.tool-input-output-container') as HTMLElement | null
    innerW = container
      ? container.clientWidth - 56 - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      : 300
  }
  if (innerW <= 0) innerW = 300  // absolute safety fallback

  const gauge = getGauge()
  gauge.style.width      = `${innerW}px`
  gauge.style.fontFamily = cs.fontFamily
  gauge.style.fontSize   = cs.fontSize
  gauge.style.lineHeight = cs.lineHeight

  const lines   = text.split('\n')
  const entries: GutterEntry[] = []
  for (let i = 0; i < lines.length; i++) {
    gauge.textContent = lines[i] || '\u200b'  // zero-width space keeps height for empty lines
    const rows = Math.max(1, Math.round(gauge.scrollHeight / lineH))
    entries.push(i + 1)                        // logical line number on first visual row
    for (let r = 1; r < rows; r++) entries.push(null)  // blank spacers for wrapped rows
  }
  return entries
}

const recomputeOriginalLines = async () => {
  await nextTick()
  const el = originalTextarea.value ?? mobileOriginalTextarea.value
  if (el) originalGutterEntries.value = buildGutterEntries(originalText.value, el)
  else    originalGutterEntries.value = originalText.value.split('\n').map((_, i) => i + 1)
}

const recomputeModifiedLines = async () => {
  await nextTick()
  const el = modifiedTextarea.value ?? mobileModifiedTextarea.value
  if (el) modifiedGutterEntries.value = buildGutterEntries(modifiedText.value, el)
  else    modifiedGutterEntries.value = modifiedText.value.split('\n').map((_, i) => i + 1)
}

// Re-run whenever text or active mobile tab changes
watch(originalText, recomputeOriginalLines)
watch(modifiedText, recomputeModifiedLines)
watch(activePanel, async () => { await recomputeOriginalLines(); await recomputeModifiedLines() })

// ResizeObserver: recompute whenever any textarea changes width (window resize / layout shift)
let resizeObs: ResizeObserver | null = null
onMounted(async () => {
  await recomputeOriginalLines()
  await recomputeModifiedLines()
  // Re-measure after fonts finish loading (font metrics affect line wrapping)
  document.fonts?.ready?.then(() => { recomputeOriginalLines(); recomputeModifiedLines() })

  resizeObs = new ResizeObserver(() => {
    recomputeOriginalLines()
    recomputeModifiedLines()
  })
  ;[originalTextarea, modifiedTextarea, mobileOriginalTextarea, mobileModifiedTextarea]
    .forEach(r => { if (r.value) resizeObs!.observe(r.value) })
  resizeObs.observe(document.documentElement)
})

onBeforeUnmount(() => {
  resizeObs?.disconnect()
  if (gaugeEl) { document.body.removeChild(gaugeEl); gaugeEl = null }
})

// One aligned row shared by both panels (LCS-based)
interface AlignedRow {
  type: 'equal' | 'delete' | 'insert' | 'replace'
  origLine: string | null   // null → filler cell on orig side
  modLine: string | null    // null → filler cell on mod side
  origLineNum: number | null
  modLineNum: number | null
  conflictId: number | null
}

// Grouped view segment for rendering with borders
interface RowSegment {
  type: 'equal' | 'conflict'
  conflictId: number | null
  rows: AlignedRow[]
  segStartIdx: number
}

// Conflict tracking
interface Conflict {
  id: number
  resolved: boolean
  resolvedWith: 'original' | 'modified' | null
}

const conflicts = ref<Conflict[]>([])
const selectedConflict = ref<number | null>(null)
const selectedRowIdx   = ref<number | null>(null)
const alignedRows = ref<AlignedRow[]>([])
let conflictIdCounter = 0

// Strip trailing empty strings produced by a trailing newline in the textarea
const splitLines = (text: string): string[] => {
  const lines = text.split('\n')
  while (lines.length > 1 && lines[lines.length - 1] === '') lines.pop()
  return lines
}

// LCS-based line diff — builds an array of AlignedRow (called by compareDiff)
const lcsLineDiff = (): AlignedRow[] => {
  const origLines = splitLines(originalText.value)
  const modLines  = splitLines(modifiedText.value)
  const m = origLines.length, n = modLines.length

  // Build DP table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = origLines[i - 1] === modLines[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  // Backtrack to get edit ops
  type Op = { type: 'equal' | 'delete' | 'insert'; oi: number; mi: number }
  const ops: Op[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      ops.push({ type: 'equal', oi: i - 1, mi: j - 1 }); i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ type: 'insert', oi: -1, mi: j - 1 }); j--
    } else {
      ops.push({ type: 'delete', oi: i - 1, mi: -1 }); i--
    }
  }
  ops.reverse()

  // Build AlignedRows: pair adjacent deletes+inserts as 'replace', remainder as delete/insert
  const rows: AlignedRow[] = []
  let origLineNum = 0, modLineNum = 0
  let pi = 0

  while (pi < ops.length) {
    const op = ops[pi]
    if (op.type === 'equal') {
      origLineNum++; modLineNum++
      rows.push({ type: 'equal', origLine: origLines[op.oi], modLine: modLines[op.mi],
                  origLineNum, modLineNum, conflictId: null })
      pi++
    } else {
      // Collect entire non-equal run
      const deletes: Op[] = [], inserts: Op[] = []
      while (pi < ops.length && ops[pi].type !== 'equal') {
        if (ops[pi].type === 'delete') deletes.push(ops[pi])
        else                           inserts.push(ops[pi])
        pi++
      }
      const pairCount = Math.min(deletes.length, inserts.length)
      // Paired → replace
      for (let k = 0; k < pairCount; k++) {
        origLineNum++; modLineNum++
        rows.push({ type: 'replace', origLine: origLines[deletes[k].oi], modLine: modLines[inserts[k].mi],
                    origLineNum, modLineNum, conflictId: null })
      }
      // Unpaired deletes → delete (filler on mod side)
      for (let k = pairCount; k < deletes.length; k++) {
        origLineNum++
        rows.push({ type: 'delete', origLine: origLines[deletes[k].oi], modLine: null,
                    origLineNum, modLineNum: null, conflictId: null })
      }
      // Unpaired inserts → insert (filler on orig side)
      for (let k = pairCount; k < inserts.length; k++) {
        modLineNum++
        rows.push({ type: 'insert', origLine: null, modLine: modLines[inserts[k].mi],
                    origLineNum: null, modLineNum, conflictId: null })
      }
    }
  }
  return rows
}

// Groups alignedRows into equal-runs vs conflict-blocks for bordered rendering
const rowSegments = computed((): RowSegment[] => {
  const segs: RowSegment[] = []
  const rows = alignedRows.value
  let i = 0
  while (i < rows.length) {
    if (rows[i].conflictId === null) {
      const start = i
      const segRows: AlignedRow[] = []
      while (i < rows.length && rows[i].conflictId === null) segRows.push(rows[i++])
      segs.push({ type: 'equal', conflictId: null, rows: segRows, segStartIdx: start })
    } else {
      const cid = rows[i].conflictId!
      const start = i
      const segRows: AlignedRow[] = []
      while (i < rows.length && rows[i].conflictId === cid) segRows.push(rows[i++])
      segs.push({ type: 'conflict', conflictId: cid, rows: segRows, segStartIdx: start })
    }
  }
  return segs
})

const conflictCount = computed(() => conflicts.value.filter(c => !c.resolved).length)

// Merge results: equal rows always kept; conflict rows only if resolved
const mergedResult = computed(() => {
  if (alignedRows.value.length === 0) return []
  const result: string[] = []
  let i = 0
  while (i < alignedRows.value.length) {
    const row = alignedRows.value[i]
    if (row.conflictId === null) {
      result.push(row.origLine!)
      i++
    } else {
      const cid = row.conflictId
      const conflict = conflicts.value.find(c => c.id === cid)
      // Collect all rows for this conflict block
      while (i < alignedRows.value.length && alignedRows.value[i].conflictId === cid) {
        const r = alignedRows.value[i]
        if (conflict?.resolved) {
          if (conflict.resolvedWith === 'original' && r.origLine !== null) result.push(r.origLine)
          else if (conflict.resolvedWith === 'modified' && r.modLine !== null) result.push(r.modLine)
        }
        i++
      }
    }
  }
  return result
})

// Maps each merged-result line index → its alignedRows index (for cross-panel row highlighting)
const mergedResultMap = computed((): number[] => {
  if (alignedRows.value.length === 0) return []
  const map: number[] = []
  let i = 0
  while (i < alignedRows.value.length) {
    const row = alignedRows.value[i]
    if (row.conflictId === null) {
      map.push(i); i++
    } else {
      const cid = row.conflictId
      const conflict = conflicts.value.find(c => c.id === cid)
      while (i < alignedRows.value.length && alignedRows.value[i].conflictId === cid) {
        if (conflict?.resolved) {
          const r = alignedRows.value[i]
          if (conflict.resolvedWith === 'original' && r.origLine !== null) map.push(i)
          else if (conflict.resolvedWith === 'modified' && r.modLine !== null) map.push(i)
        }
        i++
      }
    }
  }
  return map
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

// Toggle conflict selection
const toggleConflict = (conflictId: number) => {
  if (selectedConflict.value === conflictId) {
    selectedConflict.value = null
  } else {
    selectedConflict.value = conflictId
  }
}

// Click a row: highlight it across all three panels; also toggles change block (resolved or not)
const handleRowClick = (rowIdx: number | null, conflictId: number | null) => {
  if (rowIdx === null) return
  if (selectedRowIdx.value === rowIdx) {
    selectedRowIdx.value = null
  } else {
    selectedRowIdx.value = rowIdx
  }
  if (conflictId !== null) toggleConflict(conflictId)
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

// Undo a resolved conflict — revert to unresolved
const unresolveConflict = (conflictId: number) => {
  const conflict = conflicts.value.find(c => c.id === conflictId)
  if (conflict) {
    conflict.resolved = false
    conflict.resolvedWith = null
    selectedConflict.value = null
    alert.showSuccess('Change reopened')
  }
}

// Bulk-resolve all remaining conflicts with original
const acceptAllOriginal = async () => {
  const remaining = conflicts.value.filter(c => !c.resolved)
  if (remaining.length === 0) return
  const confirmed = await confirm.confirm(`Accept original text for all ${remaining.length} remaining change(s)?`)
  if (!confirmed) return
  remaining.forEach(c => { c.resolved = true; c.resolvedWith = 'original' })
  selectedConflict.value = null
  alert.showSuccess(`Accepted original for ${remaining.length} change(s)`)
}

// Bulk-resolve all remaining conflicts with modified
const acceptAllModified = async () => {
  const remaining = conflicts.value.filter(c => !c.resolved)
  if (remaining.length === 0) return
  const confirmed = await confirm.confirm(`Accept modified text for all ${remaining.length} remaining change(s)?`)
  if (!confirmed) return
  remaining.forEach(c => { c.resolved = true; c.resolvedWith = 'modified' })
  selectedConflict.value = null
  alert.showSuccess(`Accepted modified for ${remaining.length} change(s)`)
}

// Check if conflict is resolved
const isConflictResolved = (conflictId: number) => {
  const conflict = conflicts.value.find(c => c.id === conflictId)
  return conflict?.resolved || false
}

// Sync scroll for input view — just update the reactive offset; the gutter uses transform:translateY
const syncScrollOriginal = () => {
  origScrollTop.value = originalTextarea.value?.scrollTop ?? mobileOriginalTextarea.value?.scrollTop ?? 0
}

const syncScrollModified = () => {
  modScrollTop.value = modifiedTextarea.value?.scrollTop ?? mobileModifiedTextarea.value?.scrollTop ?? 0
}

// Sync scroll for compare view — keep all three panels in lockstep
const syncCompareScrollOriginal = () => {
  const top = compareOriginalPanel.value?.scrollTop ?? 0
  if (compareModifiedPanel.value) compareModifiedPanel.value.scrollTop = top
  if (compareResultPanel.value)   compareResultPanel.value.scrollTop   = top
}

const syncCompareScrollModified = () => {
  const top = compareModifiedPanel.value?.scrollTop ?? 0
  if (compareOriginalPanel.value) compareOriginalPanel.value.scrollTop = top
  if (compareResultPanel.value)   compareResultPanel.value.scrollTop   = top
}

const syncCompareScrollResult = () => {
  const top = compareResultPanel.value?.scrollTop ?? 0
  if (compareOriginalPanel.value) compareOriginalPanel.value.scrollTop = top
  if (compareModifiedPanel.value) compareModifiedPanel.value.scrollTop = top
}

// Compare diff — LCS-based with filler row alignment
const compareDiff = () => {
  if (!originalText.value.trim() && !modifiedText.value.trim()) {
    alert.showError('Please enter text in at least one field')
    return
  }

  conflicts.value = []
  conflictIdCounter = 0

  const rows = lcsLineDiff()

  // Stamp conflictId onto each contiguous non-equal run
  let pi = 0
  while (pi < rows.length) {
    if (rows[pi].type !== 'equal') {
      conflictIdCounter++
      const cid = conflictIdCounter
      conflicts.value.push({ id: cid, resolved: false, resolvedWith: null })
      while (pi < rows.length && rows[pi].type !== 'equal') {
        rows[pi].conflictId = cid
        pi++
      }
    } else {
      pi++
    }
  }

  alignedRows.value = rows
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

  if (conflictCount.value > 0) {
    alert.showError(`Please resolve all ${conflictCount.value} remaining change(s) before saving`)
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

/* Prevent horizontal scroll on input textareas */
.diff-textarea {
  overflow-x: hidden;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

/*
  Gutter inner: driven via transform:translateY from the textarea scrollTop.
  The .tool-gutter container already provides padding-top: 0.5rem (matches
  the textarea padding-top), so we add NO extra padding here.
*/
.gutter-inner {
  will-change: transform;
}

/* Diagonal stripe pattern for filler (empty placeholder) rows */
.filler-stripe {
  background-color: #f3f4f6;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.07) 5px,
    rgba(0, 0, 0, 0.07) 10px
  );
}

.filler-stripe-gutter {
  background-color: #e5e7eb;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.07) 5px,
    rgba(0, 0, 0, 0.07) 10px
  );
}
</style>
