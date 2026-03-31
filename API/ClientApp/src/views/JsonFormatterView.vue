<template>
  <div class="w-full p-6 sm:p-8 lg:p-10">
    <div class="w-full">

      <h1 class="text-4xl font-bold text-gray-800 mb-2">JSON Formatter &amp; Validator</h1>
      <p class="text-base text-gray-500 mb-6">Paste your JSON below, choose indent style, then click <strong>Process</strong>.</p>

      <!-- ── Input ──────────────────────────────────────────────────────────── -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">Input JSON</label>
          <button @click="copyText(input)" title="Copy input" class="tool-copy-btn" :disabled="!input">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
        </div>
        <div class="tool-input-output-container">
          <div ref="inputGutter" class="tool-gutter">
            <div v-for="n in inputLines" :key="n" class="tool-gutter-line">{{ n }}</div>
          </div>
          <!-- Code editor area: highlight overlay + transparent textarea -->
          <div class="code-editor-wrapper">
            <div ref="highlightLayer" class="code-highlight-layer" v-html="highlightedInput" aria-hidden="true"></div>
            <textarea
              ref="inputEl"
              v-model="input"
              @scroll="syncGutter"
              @input="resetResult"
              class="code-textarea-transparent"
              placeholder='Paste JSON here…'
              spellcheck="false"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end mt-1 text-sm text-gray-400">{{ input.length }} chars</div>
      </div>

      <!-- ── Toolbar ─────────────────────────────────────────────────────────── -->
      <div class="flex flex-wrap items-center gap-3 mb-6">
        <!-- Indent selector -->
        <label class="text-base text-gray-600 font-medium">Indent:</label>
        <select v-model="indentSize" class="text-base border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
          <option :value="2">2 Spaces</option>
          <option :value="4">4 Spaces</option>
          <option :value="-1">Tab</option>
          <option :value="0">Compact</option>
        </select>

        <div class="flex-1"></div>

        <!-- Status badge on the right -->
        <div v-if="state !== 'empty'" class="flex items-center gap-2">
          <!-- Valid -->
          <div v-if="state === 'valid'" class="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-300 rounded-lg">
            <svg class="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span class="text-green-700 font-semibold text-sm">Valid JSON</span>
          </div>
          <!-- JSONC badge -->
          <div v-if="wasJsonc" class="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
            <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4"/></svg>
            <span class="text-gray-600 text-sm font-medium">Comments stripped</span>
          </div>
          <!-- Error -->
          <div v-if="state === 'error'" class="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-300 rounded-lg">
            <svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            <span class="text-red-700 font-semibold text-sm">{{ errors.length }} Error{{ errors.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>

        <button @click="clearAll"  class="btn btn-danger">Clear</button>
        <button @click="process"   class="btn btn-primary">Process</button>
        <button v-if="authStore.isAuthenticated && resultJson" @click="saveResult" class="btn btn-primary btn-sm">Save</button>
      </div>

      <!-- ── Action buttons for valid output ─────────────────────────────────── -->
      <div v-if="state === 'valid'" class="flex gap-2 mb-4 justify-end">
        <button @click="copyText(resultJson)" class="btn btn-secondary btn-sm">Copy</button>
        <button @click="downloadOutput"       class="btn btn-secondary btn-sm">Download .json</button>
      </div>

      <!-- ── Formatted output (valid) ────────────────────────────────────────── -->
      <div v-if="state === 'valid'" class="mb-4">
        <div class="tool-input-output-container" style="height:auto;max-height:48rem;border-color:#86efac;">
          <div class="tool-gutter" style="background:#f0fdf4;">
            <div v-for="n in outputLines" :key="n" class="tool-gutter-line">{{ n }}</div>
          </div>
          <div class="tool-output" style="background:#f0fdf4;">
            <pre class="editor-pre"><code v-html="highlightedOutput"></code></pre>
          </div>
        </div>
      </div>

      <!-- ── Error list ──────────────────────────────────────────────────────── -->
      <div v-if="state === 'error'" class="mb-4 rounded-lg border border-red-300 bg-red-50 p-4">
        <h4 class="font-bold text-red-800 mb-3 text-base">Found {{ errors.length }} error{{ errors.length !== 1 ? 's' : '' }}</h4>
        <ul class="space-y-2">
          <li
            v-for="(err, i) in errors.slice(0, 20)"
            :key="i"
            class="flex items-start gap-2 cursor-pointer hover:bg-red-100 rounded px-2 py-1 transition-colors"
            @click="scrollToError(err)"
          >
            <span class="inline-block bg-red-200 text-red-700 text-sm font-bold px-2 py-0.5 rounded shrink-0 mt-0.5">{{ i + 1 }}</span>
            <div class="text-base">
              <span class="text-red-700 font-semibold">Line {{ err.line }}, Column {{ err.column }}</span>
              <span class="mx-1 text-red-400">—</span>
              <span class="text-red-600">{{ err.message }}</span>
            </div>
          </li>
          <li v-if="errors.length > 20" class="text-red-500 text-xs italic pl-6">…and {{ errors.length - 20 }} more errors</li>
        </ul>
      </div>

      

      <!-- ── Suggested Fix ───────────────────────────────────────────────────── -->
      <div v-if="suggestedFixJson" class="mb-4 rounded-lg border border-amber-300 bg-amber-50 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-amber-200">
          <div>
            <h4 class="font-bold text-amber-800 text-base">Suggested Fix</h4>
          </div>
          <div class="flex gap-2">
            <button @click="copyText(suggestedFixJson)" class="btn btn-ghost btn-sm">Copy Fix</button>
            <button @click="applyFix"                   class="btn btn-primary btn-sm">Apply Fix →</button>
          </div>
        </div>
        <div class="tool-input-output-container" style="height:auto;max-height:24rem;border:none;border-radius:0;">
          <div class="tool-gutter" style="background:#fef3c7;">
            <div v-for="n in fixLines" :key="n" class="tool-gutter-line">{{ n }}</div>
          </div>
          <div class="tool-output" style="background:white;">
            <div class="editor-pre">
              <div v-for="(lineHtml, idx) in highlightedFixLines" :key="idx" class="whitespace-pre font-mono text-sm px-3" v-html="lineHtml"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Example ─────────────────────────────────────────────────────────── -->
      <details class="mt-3">
        <summary class="cursor-pointer text-sm text-gray-400 select-none hover:text-gray-600">Show example</summary>
        <pre @click="loadExample" class="mt-2 bg-gray-100 p-3 rounded text-sm cursor-pointer hover:bg-gray-200 transition-colors whitespace-pre-wrap">{{ exampleJson }}</pre>
      </details>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { savedResultsApi } from '../api/saved'
import { processJson, type EngineError } from '../services/jsonEngine'
import { useAlert } from '../composables/useAlert'
import { useConfirm } from '../composables/useConfirm'

const authStore = useAuthStore()
const alert     = useAlert()
const confirm   = useConfirm()

// ── State ──────────────────────────────────────────────────────────────────────
const input            = ref('')
const resultJson       = ref('')
const errors           = ref<EngineError[]>([])
const suggestedFixJson = ref('')  // raw jsonrepair output – line numbers align with errors
const formattedFixJson = ref('')  // JSON.stringify-formatted version – used when applying fix
const wasJsonc         = ref(false)
const state            = ref<'empty' | 'valid' | 'error'>('empty')
const indentSize       = ref(2)

const inputEl        = ref<HTMLTextAreaElement | null>(null)
const inputGutter    = ref<HTMLDivElement | null>(null)
const highlightLayer = ref<HTMLDivElement | null>(null)

// ── Line numbers ───────────────────────────────────────────────────────────────
const countLines = (s: string) => Math.max(1, s.split('\n').length)
const inputLines  = computed(() => Array.from({ length: countLines(input.value) },       (_, i) => i + 1))
const outputLines = computed(() => Array.from({ length: countLines(resultJson.value) },  (_, i) => i + 1))
const fixLines    = computed(() => Array.from({ length: countLines(suggestedFixJson.value) }, (_, i) => i + 1))

// (errorLineSet removed — suggested-fix highlights use errorsByLine)

// ── Line-by-line input display ─────────────────────────────────────────────────
// ── Error lookup map: line number → list of errors on that line ────────────────
const errorsByLine = computed(() => {
  const map = new Map<number, EngineError[]>()
  for (const err of errors.value) {
    const bucket = map.get(err.line) ?? []
    bucket.push(err)
    map.set(err.line, bucket)
  }
  return map
})

// ── Scroll sync ────────────────────────────────────────────────────────────────
const syncGutter = () => {
  if (inputEl.value && inputGutter.value)
    inputGutter.value.scrollTop = inputEl.value.scrollTop
  if (inputEl.value && highlightLayer.value)
    highlightLayer.value.scrollTop = inputEl.value.scrollTop
}

// ── Comment-aware input highlight (overlay) ────────────────────────────────────
const highlightInputLine = (line: string): string => {
  // Full-line comment: optional whitespace then //
  const fullComment = line.match(/^(\s*)(\/\/.*)$/)
  if (fullComment) {
    return escHtml(fullComment[1]) + `<span class="jc">${escHtml(fullComment[2])}</span>`
  }
  // Block comment starting on this line
  if (/^\s*\/\*/.test(line)) {
    return `<span class="jc">${escHtml(line)}</span>`
  }
  // Inline comment: find // that is not inside a string literal
  let inStr = false
  for (let i = 0; i < line.length - 1; i++) {
    const ch = line[i]
    if (ch === '"' && (i === 0 || line[i - 1] !== '\\')) inStr = !inStr
    if (!inStr && ch === '/' && line[i + 1] === '/') {
      return `<span class="jnorm">${escHtml(line.slice(0, i))}</span><span class="jc">${escHtml(line.slice(i))}</span>`
    }
  }
  return `<span class="jnorm">${escHtml(line)}</span>`
}

const highlightedInput = computed(() =>
  input.value.split('\n').map(highlightInputLine).join('\n')
)

const resetResult = () => {
  if (state.value !== 'empty') {
    state.value = 'empty'
    errors.value = []
    resultJson.value = ''
    suggestedFixJson.value = ''
    formattedFixJson.value = ''
    wasJsonc.value = false
  }
}

// ── Syntax highlight ──────────────────────────────────────────────────────────
const escHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const highlightJson = (json: string): string =>
  escHtml(json).replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    match => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="jk">${match.slice(0, -1)}</span>:`
        return `<span class="js">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span class="jb">${match}</span>`
      if (/null/.test(match))       return `<span class="jn">${match}</span>`
      return `<span class="jnum">${match}</span>`
    }
  )

const highlightedOutput = computed(() => highlightJson(resultJson.value))

// Helpers to produce line-wise highlighted HTML for the suggested fix
// This function compares the original line with the fixed line and highlights differences
const getFixLineHtml = (fixedLine: string, lineNum: number, errs: EngineError[]) => {
  if (!errs || errs.length === 0) return escHtml(fixedLine) || '&nbsp;'
  
  // Get the corresponding original line
  const originalLines = input.value.split('\n')
  const originalLine = originalLines[lineNum - 1] || ''
  
  const err = errs[0]
  const message = err.message.toLowerCase()
  
  // Smart highlighting based on error type
  if (message.includes('single quotes') && message.includes('double quotes')) {
    // Highlight all quoted strings in the fixed line
    return highlightQuotedStrings(fixedLine, err.message)
  } else if (message.includes('python literal') && (message.includes('true') || message.includes('false'))) {
    // Highlight true/false values
    return highlightPattern(fixedLine, /\b(true|false)\b/g, err.message)
  } else if (
    message.includes('python literal') && message.includes('null') ||
    message.includes('undefined') ||
    message.includes('nan') ||
    message.includes('infinity')
  ) {
    // Highlight null values (undefined/NaN/Infinity/None → null)
    return highlightPattern(fixedLine, /\bnull\b/g, err.message)
  } else if (message.includes('hex color')) {
    // Highlight the quoted hex color value e.g. "#FFAA00"
    return highlightPattern(fixedLine, /"#[0-9A-Fa-f]{3,8}"/g, err.message)
  } else if (message.includes('trailing comma')) {
    // Highlight the area where trailing comma was (last non-whitespace before closing bracket)
    return highlightTrailingCommaFix(fixedLine, originalLine, err.message)
  } else {
    // Generic token-by-token comparison
    return highlightTokenDifferences(fixedLine, originalLine, err.message)
  }
}

// Highlight all quoted strings in a line
const highlightQuotedStrings = (line: string, errMsg: string): string => {
  const parts: string[] = []
  let i = 0
  while (i < line.length) {
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i]
      let end = i + 1
      while (end < line.length && line[end] !== quote) {
        if (line[end] === '\\') end++
        end++
      }
      if (end < line.length) end++
      parts.push(`<mark class="err-mark" title="${escHtml(errMsg)}">${escHtml(line.slice(i, end))}</mark>`)
      i = end
    } else {
      parts.push(escHtml(line[i]))
      i++
    }
  }
  return parts.join('') || '&nbsp;'
}

// Highlight based on regex pattern
const highlightPattern = (line: string, pattern: RegExp, errMsg: string): string => {
  const matches = [...line.matchAll(pattern)]
  
  if (matches.length === 0) return escHtml(line)
  
  // Build highlighted version by processing each match
  const parts: string[] = []
  let lastIndex = 0
  
  for (const match of matches) {
    if (match.index !== undefined) {
      // Add the part before the match
      if (match.index > lastIndex) {
        parts.push(escHtml(line.slice(lastIndex, match.index)))
      }
      // Add the highlighted match
      parts.push(`<mark class="err-mark" title="${escHtml(errMsg)}">${escHtml(match[0])}</mark>`)
      lastIndex = match.index + match[0].length
    }
  }
  
  // Add any remaining part after the last match
  if (lastIndex < line.length) {
    parts.push(escHtml(line.slice(lastIndex)))
  }
  
  return parts.join('') || '&nbsp;'
}

// Highlight where trailing comma was removed
const highlightTrailingCommaFix = (fixedLine: string, originalLine: string, errMsg: string): string => {
  const trimmedOrig  = originalLine.trimEnd()
  const trimmedFixed = fixedLine.trimEnd()

  // Case 1: comma before } or ] on the same line  →  "json",]
  const hasInlineComma = /,\s*[}\]]/.test(originalLine)
  // Case 2: comma at the very end of the line, and fixed line has it removed  →  "New York",
  const hasLineEndComma = trimmedOrig.endsWith(',') && !trimmedFixed.endsWith(',')

  if (!hasInlineComma && !hasLineEndComma) {
    return escHtml(fixedLine) || '&nbsp;'
  }

  // Find all value tokens (strings, booleans, null, numbers) in the FIXED line
  const valuePattern = /"(?:[^"\\]|\\.)*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g
  const values: { value: string; start: number; end: number }[] = []
  let m
  while ((m = valuePattern.exec(fixedLine)) !== null) {
    values.push({ value: m[0], start: m.index, end: m.index + m[0].length })
  }

  if (values.length === 0) return escHtml(fixedLine) || '&nbsp;'

  // The last value is the one whose trailing comma was removed
  const last = values[values.length - 1]
  return (
    escHtml(fixedLine.slice(0, last.start)) +
    `<mark class="err-mark" title="${escHtml(errMsg)}">${escHtml(last.value)}</mark>` +
    escHtml(fixedLine.slice(last.end))
  )
}

// Generic token-by-token comparison for other types of errors
const highlightTokenDifferences = (fixedLine: string, originalLine: string, errMsg: string): string => {
  const parts: string[] = []
  let i = 0
  let j = 0
  
  while (i < fixedLine.length || j < originalLine.length) {
    // Skip matching whitespace
    while (i < fixedLine.length && j < originalLine.length && 
           fixedLine[i] === originalLine[j] && /\s/.test(fixedLine[i])) {
      parts.push(escHtml(fixedLine[i]))
      i++
      j++
    }
    
    if (i >= fixedLine.length) break
    if (j >= originalLine.length) {
      // Rest of fixed line is new - highlight it
      parts.push(`<mark class="err-mark" title="${escHtml(errMsg)}">${escHtml(fixedLine.slice(i))}</mark>`)
      break
    }
    
    // Find the next token in both lines
    const fixedToken = extractToken(fixedLine, i)
    const origToken = extractToken(originalLine, j)
    
    if (fixedToken.text === origToken.text) {
      // Tokens match - add without highlighting
      parts.push(escHtml(fixedToken.text))
      i += fixedToken.length
      j += origToken.length
    } else {
      // Tokens differ - highlight the fixed token
      if (fixedToken.text) {
        parts.push(`<mark class="err-mark" title="${escHtml(errMsg)}">${escHtml(fixedToken.text)}</mark>`)
        i += fixedToken.length
      }
      if (origToken.text) {
        j += origToken.length
      }
      if (!fixedToken.text && !origToken.text) {
        // Both empty, advance to avoid infinite loop
        if (i < fixedLine.length) parts.push(escHtml(fixedLine[i++]))
        if (j < originalLine.length) j++
      }
    }
  }
  
  return parts.join('') || '&nbsp;'
}

// Extract next token from a string starting at position i
const extractToken = (line: string, start: number): { text: string; length: number } => {
  if (start >= line.length) return { text: '', length: 0 }
  
  let end = start
  const ch = line[start]
  
  // If it's a string literal
  if (ch === '"' || ch === "'") {
    const quote = ch
    end++
    while (end < line.length && line[end] !== quote) {
      if (line[end] === '\\') end++ // Skip escaped character
      end++
    }
    if (end < line.length) end++ // Include closing quote
    return { text: line.slice(start, end), length: end - start }
  }
  
  // If it's whitespace
  if (/\s/.test(ch)) {
    while (end < line.length && /\s/.test(line[end])) end++
    return { text: line.slice(start, end), length: end - start }
  }
  
  // If it's a structural character
  if (/[\[\]\{\},:]/.test(ch)) {
    return { text: line[start], length: 1 }
  }
  
  // Otherwise it's a word/number token
  while (end < line.length && !/[\s\[\]\{\},:"']/.test(line[end])) end++
  return { text: line.slice(start, end), length: end - start }
}

const highlightedFixLines = computed(() => {
  const lines = suggestedFixJson.value ? suggestedFixJson.value.split('\n') : ['']
  return lines.map((ln, idx) => getFixLineHtml(ln, idx + 1, errorsByLine.value.get(idx + 1) ?? []))
})

// ── Core engine (all three layers run synchronously in the browser) ────────────
const process = () => {
  if (!input.value.trim()) { alert.showError('Input is empty'); return }
  const result = processJson(input.value, indentSize.value)
  if (result.hasErrors) {
    errors.value           = result.errors
    resultJson.value       = ''
    suggestedFixJson.value = result.repairedJson   ?? ''  // raw, line numbers match errors
    formattedFixJson.value = result.formattedFixed ?? ''  // formatted, used on apply
    wasJsonc.value         = result.wasJsonc ?? false
    state.value            = 'error'
  } else {
    errors.value           = []
    resultJson.value       = result.formattedJson ?? ''
    suggestedFixJson.value = ''
    formattedFixJson.value = ''
    wasJsonc.value         = result.wasJsonc ?? false
    state.value            = 'valid'
  }
}

const applyFix = () => {
  if (!suggestedFixJson.value) return
  // Use the fully-formatted version as the new input so the user gets clean JSON
  input.value = formattedFixJson.value || suggestedFixJson.value
  suggestedFixJson.value = ''
  formattedFixJson.value = ''
  errors.value = []
  state.value = 'empty'
  process()
}

const scrollToError = (err: EngineError) => {
  if (!inputEl.value) return
  const lines = input.value.split('\n')
  let offset = 0
  for (let i = 0; i < err.line - 1 && i < lines.length; i++)
    offset += lines[i].length + 1
  inputEl.value.focus()
  inputEl.value.setSelectionRange(offset, offset)
  inputEl.value.scrollTop = Math.max(0, (err.line - 3) * 20)
}

const clearAll = async () => {
  if (input.value && !(await confirm.confirm('Clear all?'))) return
  input.value = ''; resultJson.value = ''; errors.value = []
  suggestedFixJson.value = ''; formattedFixJson.value = ''; wasJsonc.value = false; state.value = 'empty'
}

const copyText = (text: string) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => alert.showSuccess('Copied!'))
}

const downloadOutput = () => {
  if (!resultJson.value) return
  const blob = new Blob([resultJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'formatted.json'
  a.click(); URL.revokeObjectURL(url)
}

const saveResult = async () => {
  try {
    await savedResultsApi.create({ toolType: 1, input: input.value, output: resultJson.value })
    alert.showSuccess('Saved!')
  } catch (e: any) {
    alert.showError(e.response?.data?.message ?? 'Failed to save')
  }
}

const exampleJson = `{
  'name': 'John',
  "age": 30,
  "active": True,
  "score": None,
  "tags": ["dev", "json",],
  "address": {
    "city": "New York",
  }
}`

const loadExample = () => {
  input.value = exampleJson
  state.value = 'empty'; errors.value = []
  resultJson.value = ''; suggestedFixJson.value = ''
}
</script>

<style scoped>
/* Keep only JSON-specific highlighting and error display styles */
.gutter-line-error { background: #fecaca; color: #b91c1c; font-weight: 700; border-radius: 2px; }

.editor-pre {
  white-space: pre-wrap;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5rem;
}

.editor-display-line {
  display: block;
  min-height: 1.5rem;
  line-height: 1.5rem;
  position: relative;
}
.editor-display-line.bg-red-100 { border-left: 3px solid #ef4444; }

/* Error tooltip */
.error-tooltip {
  display: none;
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 20;
  background: #1f2937;
  color: #f9fafb;
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 12px rgba(0,0,0,.25);
  white-space: normal;
  width: max-content;
  max-width: 28rem;
  pointer-events: none;
}
.editor-display-line:hover .error-tooltip { display: block; }

:deep(.err-mark) { background: #fecaca; border-bottom: 2px solid #ef4444; padding: 0 0.125rem; border-radius: 0.125rem; }
:deep(.jk)    { color: #0451a5; }
:deep(.js)    { color: #a31515; }
:deep(.jnum)  { color: #098658; }
:deep(.jb)    { color: #0000ff; }
:deep(.jn)    { color: #0000ff; }

/* ── Comment-aware code editor ─────────────────────────────────────────────── */
.code-editor-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
}

/* Highlight overlay (sits behind the textarea, not interactive) */
.code-highlight-layer {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  padding: 0.5rem 0.75rem;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 1rem;
  line-height: 1.5rem;
  white-space: pre;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  word-break: normal;
  tab-size: 2;
}

/* Transparent textarea on top — captures all typing, cursor visible */
.code-textarea-transparent {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 0.5rem 0.75rem;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 1rem;
  line-height: 1.5rem;
  background: transparent;
  color: transparent;         /* hide native text — overlay renders it */
  caret-color: #1e293b;       /* keep cursor visible */
  border: 0;
  outline: none;
  resize: none;
  tab-size: 2;
}
.code-textarea-transparent:focus { box-shadow: inset 0 0 0 2px #60a5fa; }

/* Colour tokens inside the overlay */
:deep(.jnorm) { color: #1e293b; }   /* normal JSON text */
:deep(.jc)    { color: #6b7280; font-style: italic; }   /* // comment */

/* Dark mode code colours */
:global(.dark) :deep(.jnorm) { color: #e2e8f0; }
:global(.dark) :deep(.jk)    { color: #79b8ff; }
:global(.dark) :deep(.js)    { color: #f97583; }
:global(.dark) :deep(.jnum)  { color: #79c0ff; }
:global(.dark) :deep(.jb)    { color: #d2a8ff; }
:global(.dark) :deep(.jn)    { color: #d2a8ff; }
:global(.dark) :deep(.jc)    { color: #8b949e; font-style: italic; }
:global(.dark) :deep(.err-mark) { background: rgba(127,29,29,0.6); border-bottom-color: #ef4444; }
:global(.dark) .code-textarea-transparent { caret-color: #e2e8f0; }
</style>
