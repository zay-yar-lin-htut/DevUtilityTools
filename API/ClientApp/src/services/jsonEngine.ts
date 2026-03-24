/**
 * Triple-Engine JSON Validator
 *
 * Layer 1 — AJV (The "What"):     detects structural violations using allErrors:true
 * Layer 2 — json-source-map ("Where"): maps JSON-Pointer paths → line/column coordinates
 * Layer 3 — jsonrepair ("How"):   auto-repairs syntax errors and describes each change
 */

// ─── Module declaration for json-source-map (no bundled .d.ts) ───────────────
declare module 'json-source-map' {
  export interface Location { line: number; column: number; pos: number }
  export interface Pointer {
    key?: Location
    keyEnd?: Location
    value: Location
    valueEnd: Location
  }
  export interface ParseResult { data: unknown; pointers: Record<string, Pointer> }
  export function parse(json: string): ParseResult
  export function stringify(data: unknown, replacer?: unknown, space?: string | number): { json: string; pointers: Record<string, Pointer> }
}

// ─── JSONC: strip // line-comments and /* block */ comments ──────────────────
export function stripJsonComments(src: string): string {
  let result = ''
  let i = 0
  while (i < src.length) {
    // Inside a string literal – copy verbatim until closing quote
    if (src[i] === '"') {
      result += src[i++]
      while (i < src.length) {
        if (src[i] === '\\') { result += src[i++]; result += src[i++]; continue }
        result += src[i]
        if (src[i++] === '"') break
      }
      continue
    }
    // Block comment /* … */
    if (src[i] === '/' && src[i + 1] === '*') {
      i += 2
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        result += src[i] === '\n' ? '\n' : ' '   // preserve newlines so line numbers stay
        i++
      }
      i += 2   // skip */
      continue
    }
    // Line comment // … \n
    if (src[i] === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++
      continue
    }
    result += src[i++]
  }
  return result
}

// Returns true when the source contains at least one comment
export function hasJsonComments(src: string): boolean {
  return /\/\/|\/\*/.test(src)
}
import Ajv, { type ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'
import { jsonrepair } from 'jsonrepair'
import * as jsonSourceMap from 'json-source-map'

// ─── AJV setup ────────────────────────────────────────────────────────────────
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
// Empty schema — accepts any valid JSON. Swap for a real schema to enable
// field-level validation (required, type, additionalProperties, etc.)
const validateSchema = ajv.compile({})

// ─── Public types ─────────────────────────────────────────────────────────────
export interface EngineError {
  line: number
  column: number
  message: string
  suggestedFix: string
}

export interface EngineResult {
  hasErrors: boolean
  errors: EngineError[]
  formattedJson?: string   // returned when input is valid
  repairedJson?: string    // raw jsonrepair output (line numbers match errors)
  formattedFixed?: string  // JSON.stringify formatted version of the repair (used on Apply Fix)
  wasJsonc?: boolean       // true when // or /* */ comments were stripped
}

// ─── Formatting helper ────────────────────────────────────────────────────────
function formatJson(obj: unknown, indentSize: number): string {
  const indent = indentSize === -1 ? '\t'
    : indentSize === 0 ? undefined
    : indentSize
  return JSON.stringify(obj, null, indent)
}

// ─── Position helpers ─────────────────────────────────────────────────────────
function posToLineCol(text: string, pos: number): { line: number; column: number } {
  const before = text.slice(0, Math.min(pos, text.length))
  const lines = before.split('\n')
  return { line: lines.length, column: lines[lines.length - 1].length + 1 }
}

function extractParseErrorPosition(msg: string, input: string): { line: number; column: number } {
  // Chrome/V8: "at position N"
  const posMatch = msg.match(/at position (\d+)/i)
  if (posMatch) return posToLineCol(input, parseInt(posMatch[1]))
  // Firefox: "on line N column M"
  const lineColMatch = msg.match(/(?:on )?line (\d+) column (\d+)/i)
  if (lineColMatch) return { line: parseInt(lineColMatch[1]), column: parseInt(lineColMatch[2]) }
  return { line: 1, column: 1 }
}

// ─── Pre-processor: handle tokens jsonrepair may choke on ────────────────────
// Processes char-by-char, skipping string literals so we never mangle values.
function preprocessSyntax(src: string): string {
  let result = ''
  let i = 0
  while (i < src.length) {
    // ── String literal (single OR double quote) ──
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i]
      result += '"'   // always output double-quote
      i++
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\') {
          const next = src[i + 1]
          if (q === "'" && next === "'") { result += "\\'"; i += 2; continue }
          result += src[i]; i++
          if (i < src.length) { result += src[i]; i++ }
          continue
        }
        if (q === "'" && src[i] === '"') { result += '\\"'; i++; continue }
        result += src[i++]
      }
      result += '"'
      if (i < src.length) i++   // skip closing quote
      continue
    }

    // ── Bare hex color: #[0-9A-Fa-f]{3,8} ──
    if (src[i] === '#') {
      let hex = '#'; let k = i + 1
      while (k < src.length && /[0-9A-Fa-f]/.test(src[k])) hex += src[k++]
      if (/^#[0-9A-Fa-f]{3,8}$/.test(hex)) {
        result += `"${hex}"`; i = k; continue
      }
      result += src[i++]; continue
    }

    // ── Bare word token ──
    if (/[A-Za-z_]/.test(src[i])) {
      let word = ''; let k = i
      while (k < src.length && /[\w]/.test(src[k])) word += src[k++]
      if (word === 'undefined' || word === 'NaN' || word === 'Infinity' || word === 'None') {
        result += 'null'
      } else if (word === 'True') {
        result += 'true'
      } else if (word === 'False') {
        result += 'false'
      } else {
        result += word
      }
      i = k; continue
    }

    // ── Negative Infinity ──
    if (src[i] === '-' && src.slice(i).startsWith('-Infinity')) {
      result += 'null'; i += 9; continue
    }

    // ── Leading decimal point: .5 → 0.5 ──
    // Only convert when preceded by a value-start context (: or [ or ,)
    if (src[i] === '.' && /[0-9]/.test(src[i + 1] ?? '')) {
      // Look back at last non-whitespace character
      let back = result.trimEnd()
      const prev = back[back.length - 1]
      if (prev === ':' || prev === '[' || prev === ',') {
        result += '0'; // fall through to copy the '.' and digits normally
      }
    }

    result += src[i++]
  }
  return result
}

// ─── Layer 3 helpers: Classify what jsonrepair changed ───────────────────────
function classifyChange(orig: string, rep: string): string {
  const o = orig.trim()
  const r = rep.trim()

  if (r === o + ',') return 'Added missing comma'
  if (o.endsWith(',') && !r.endsWith(',') && (r.endsWith('}') || r.endsWith(']')))
    return 'Removed trailing comma before closing bracket'
  if (o.endsWith(',') && !r.endsWith(','))
    return 'Removed trailing comma'
  if ((o.includes(',]') || o.includes(',}')) && !r.includes(',]') && !r.includes(',}'))
    return 'Removed trailing comma'
  if (o.includes("'") && !r.includes("'") && r.includes('"'))
    return 'Replaced single quotes with double quotes'
  if (/\bTrue\b/.test(o) && !/\bTrue\b/.test(r))
    return 'Converted Python literal: True → true'
  if (/\bFalse\b/.test(o) && !/\bFalse\b/.test(r))
    return 'Converted Python literal: False → false'
  if (/\bNone\b/.test(o) && !/\bNone\b/.test(r))
    return 'Converted Python literal: None → null'
  if (/\bundefined\b/.test(o) && r.includes('null'))
    return 'Replaced undefined with null'
  if (/\bNaN\b/.test(o) && r.includes('null'))
    return 'Replaced NaN with null'
  if (/\bInfinity\b/.test(o) && r.includes('null'))
    return 'Replaced Infinity with null'
  if (/#[0-9A-Fa-f]{3,8}/.test(o) && !/#[0-9A-Fa-f]{3,8}/.test(r) && r.includes('"#'))
    return 'Quoted bare hex color value'
  if (/^\s*\w[\w\d]*\s*:/.test(o) && /^\s*"[^"]+"\s*:/.test(r))
    return 'Added missing quotes around unquoted key'
  if (!o.startsWith('"') && r.startsWith('"') && r.endsWith('"'))
    return 'Quoted bare string value'
  if (o === '' && r !== '')
    return `Added missing character: "${r}"`
  if (o !== '' && r === '')
    return `Removed invalid character: "${o}"`
  return `Fixed invalid syntax`
}

function suggestedFixText(orig: string, rep: string): string {
  const o = orig.trim()
  const r = rep.trim()
  if (o && r && o !== r) return `"${o}" → "${r}"`
  if (!o && r) return `Insert: "${r}"`
  if (o && !r) return `Remove: "${o}"`
  return 'See repaired JSON below'
}

// ─── Layer 2 map: enrich errors with json-source-map coordinates ──────────────
function enrichWithSourceMap(errors: EngineError[], repairedJson: string): EngineError[] {
  try {
    const { pointers } = jsonSourceMap.parse(repairedJson)
    return errors.map(err => {
      // Try to find a pointer whose value line matches this error line
      for (const ptr of Object.values(pointers) as any) {
        if (ptr && ptr.value && (ptr.value.line + 1) === err.line) {
          return { ...err, column: (ptr.value.column ?? 0) + 1 }
        }
      }
      return err
    })
  } catch {
    return errors
  }
}

// ─── Myers / LCS line diff ────────────────────────────────────────────────────
// Returns structured ops for two arrays of lines.
type DiffOp = { type: 'del' | 'ins' | 'eq'; line: string; origIdx: number }

function lcsLineDiff(origLines: string[], repLines: string[]): DiffOp[] {
  const m = origLines.length, n = repLines.length

  // Suffix-based LCS DP: dp[i][j] = LCS of origLines[i..] vs repLines[j..]
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = origLines[i].trimEnd() === repLines[j].trimEnd()
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1])

  // Traceback from (0,0)
  // dp[i+1][j] >= dp[i][j+1]  →  prefer deleting origLines[i]  (advance i)
  // dp[i+1][j] <  dp[i][j+1]  →  prefer inserting repLines[j]  (advance j)
  const ops: DiffOp[] = []
  let i = 0, j = 0
  while (i < m || j < n) {
    if (i < m && j < n && origLines[i].trimEnd() === repLines[j].trimEnd()) {
      ops.push({ type: 'eq',  line: origLines[i], origIdx: i }); i++; j++
    } else if (i < m && (j >= n || dp[i + 1][j] >= dp[i][j + 1])) {
      ops.push({ type: 'del', line: origLines[i], origIdx: i }); i++
    } else {
      ops.push({ type: 'ins', line: repLines[j],  origIdx: i }); j++
    }
  }
  return ops
}

// ─── Build EngineErrors from a diff result ────────────────────────────────────
function opsToErrors(ops: DiffOp[]): EngineError[] {
  const errors: EngineError[] = []
  let k = 0
  while (k < ops.length) {
    if (ops[k].type === 'eq') { k++; continue }

    // Collect contiguous run of del/ins ops
    const delBuf: DiffOp[] = [], insBuf: DiffOp[] = []
    while (k < ops.length && ops[k].type !== 'eq') {
      if (ops[k].type === 'del') delBuf.push(ops[k])
      else                       insBuf.push(ops[k])
      k++
    }

    // Pair del[p] ↔ ins[p] as a line replacement; extras are pure removes/inserts
    const maxPairs = Math.max(delBuf.length, insBuf.length)
    for (let p = 0; p < maxPairs; p++) {
      const del = delBuf[p]
      const ins = insBuf[p]
      const lineNum = (del ?? ins).origIdx + 1   // 1-based line in original

      if (del && ins) {
        errors.push({
          line: lineNum, column: 1,
          message:      `Line ${lineNum}: ${classifyChange(del.line, ins.line)}`,
          suggestedFix: suggestedFixText(del.line, ins.line)
        })
      } else if (del && !ins) {
        // Line was completely removed (e.g. standalone trailing comma)
        errors.push({
          line: lineNum, column: 1,
          message:      `Line ${lineNum}: ${classifyChange(del.line, '')}`,
          suggestedFix: `Remove: "${del.line.trim()}"`
        })
      }
      // Pure ins → extra line added by repair, no original line to report
    }
  }
  return errors
}

// ─── Layer 1: AJV schema validation (runs on already-parsed data) ────────────
function getAjvErrors(parsed: unknown): EngineError[] {
  validateSchema(parsed)
  const raw: ErrorObject[] = validateSchema.errors ?? []
  return raw.map(err => {
    const suggestedFix = getSuggestedFix(err)
    return {
      line: 1,   // will be enriched by Layer 2 when a real schema is in use
      column: 1,
      message: `${err.instancePath || '(root)'}: ${err.message ?? 'Schema violation'}`,
      suggestedFix
    }
  })
}

function getSuggestedFix(err: ErrorObject): string {
  switch (err.keyword) {
    case 'type': {
      const params = err.params as { type: string }
      return `Expected type: ${params.type}`
    }
    case 'required': {
      const params = err.params as { missingProperty: string }
      return `Add missing field: "${params.missingProperty}"`
    }
    case 'additionalProperties': {
      const params = err.params as { additionalProperty: string }
      return `Remove unrecognized key: "${params.additionalProperty}"`
    }
    case 'enum': {
      const params = err.params as { allowedValues: unknown[] }
      return `Value must be one of: ${params.allowedValues.join(', ')}`
    }
    case 'minLength':
    case 'maxLength': {
      const params = err.params as { limit: number }
      return `String length must be ${err.keyword === 'minLength' ? '≥' : '≤'} ${params.limit}`
    }
    case 'minimum':
    case 'maximum': {
      const params = err.params as { limit: number }
      return `Value must be ${err.keyword === 'minimum' ? '≥' : '≤'} ${params.limit}`
    }
    default:
      return err.message ?? 'See schema documentation'
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────
export function processJson(rawInput: string, indentSize: number): EngineResult {
  if (!rawInput.trim()) {
    return { hasErrors: false, errors: [] }
  }

  // ── Happy path: valid JSON ────────────────────────────────────────────────
  try {
    const parsed = JSON.parse(rawInput)

    // Layer 1: AJV — with an empty schema this always passes, but is ready
    // for future schema injection (swap {} for a real JSON Schema object)
    const schemaErrors = getAjvErrors(parsed)
    if (schemaErrors.length > 0) {
      // Schema errors: use json-source-map to attach line coordinates
      const formatted = formatJson(parsed, indentSize)
      const enriched  = enrichWithSourceMap(schemaErrors, formatted)
      return { hasErrors: true, errors: enriched, repairedJson: formatted }
    }

    return { hasErrors: false, errors: [], formattedJson: formatJson(parsed, indentSize) }
  } catch {
    // Not valid JSON — fall through
  }

  // ── JSONC path: try stripping // and /* */ comments then parse ────────────
  if (hasJsonComments(rawInput)) {
    try {
      const stripped = stripJsonComments(rawInput)
      const parsed   = JSON.parse(stripped)
      return {
        hasErrors: false,
        errors: [],
        formattedJson: formatJson(parsed, indentSize),
        wasJsonc: true
      }
    } catch {
      // Comments stripped but still invalid — fall through to repair
    }
  }

  // ── Layer 3: preprocessSyntax → jsonrepair ───────────────────────────────
  // Split into two inner try-blocks so that even if jsonrepair throws we can
  // still surface the errors detected during preprocessing (pass 1).
  let preprocessed = rawInput
  try { preprocessed = preprocessSyntax(rawInput) } catch { /* keep rawInput */ }

  // Pass 1 errors (rawInput → preprocessed): single-quotes, #hex, NaN, undefined,
  // True/False/None — these we always have, even if jsonrepair can't run.
  const pass1Errors = opsToErrors(lcsLineDiff(rawInput.split('\n'), preprocessed.split('\n')))

  try {
    const repaired       = jsonrepair(preprocessed)
    const parsedRepaired = JSON.parse(repaired)
    const formattedFixed = formatJson(parsedRepaired, indentSize)

    // Two-pass diff
    const pass2Errors = opsToErrors(lcsLineDiff(preprocessed.split('\n'), repaired.split('\n')))
    const reportedLines = new Set(pass1Errors.map(e => e.line))
    const allErrors = [...pass1Errors]
    for (const e of pass2Errors) {
      if (!reportedLines.has(e.line)) allErrors.push(e)
    }
    allErrors.sort((a, b) => a.line - b.line)

    let repairErrors = allErrors.length > 0 ? allErrors : [{
      line: 1, column: 1,
      message: 'JSON contained syntax errors (auto-repaired)',
      suggestedFix: 'Apply the suggested fix below'
    }]

    const enriched = enrichWithSourceMap(repairErrors, repaired)
    return { hasErrors: true, errors: enriched, repairedJson: repaired, formattedFixed }
  } catch {
    // jsonrepair failed — but we may still have pass 1 errors from preprocessing
    if (pass1Errors.length > 0) {
      return {
        hasErrors: true,
        errors: pass1Errors,
        repairedJson: preprocessed,
        formattedFixed: undefined
      }
    }
    // jsonrepair completely failed with no usable info — fall through to fallback
  }

  // ── Fallback: unrecoverable parse error ───────────────────────────────────
  let line = 1, column = 1, message = 'Invalid JSON'
  try {
    JSON.parse(rawInput)
  } catch (e: unknown) {
    const msg = (e as SyntaxError).message ?? ''
    const pos = extractParseErrorPosition(msg, rawInput)
    line = pos.line; column = pos.column
    message = msg || 'Invalid JSON'
  }

  return {
    hasErrors: true,
    errors: [{ line, column, message, suggestedFix: 'Could not auto-repair — please fix the error manually.' }]
  }
}
