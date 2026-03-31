<template>
  <div class="w-full">

    <!-- â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
    <section class="hero-section">
      <!-- Atmospheric depth orbs -->
      <span class="orb orb-1" aria-hidden="true"></span>
      <span class="orb orb-2" aria-hidden="true"></span>
      <span class="orb orb-3" aria-hidden="true"></span>

      <div class="hero-inner">
        <div class="hero-badge fade-up">âš¡ Developer Utilities</div>
        <h1 class="hero-title fade-up fade-up-1">
          Build faster.<br />
          <span class="hero-title-accent">Ship cleaner.</span>
        </h1>
        <p class="hero-sub fade-up fade-up-2">
          A suite of precision tools designed to eliminate the friction
          between you and your best work.
        </p>
        <div class="hero-cta fade-up fade-up-3">
          <router-link to="/json-formatter" class="btn btn-primary hero-btn">Start with JSON Formatter</router-link>
        </div>
      </div>
    </section>

    <!-- â”€â”€ Tool Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
    <section class="tools-section">
      <div class="tools-inner">
        <div class="section-header reveal">
          <h2 class="section-title">All Tools</h2>
          <p class="section-sub">Everything you need, zero configuration.</p>
        </div>

        <div class="tool-grid reveal-stagger">
          <!-- JSON Formatter -->
          <router-link to="/json-formatter" class="tool-card card-3d reveal" @mousemove="tilt($event)" @mouseleave="resetTilt($event)">
            <div class="tool-card-icon" style="--icon-clr:#4f46e5;--icon-bg:#eef2ff;">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <div class="tool-card-body">
              <h3 class="tool-card-name">JSON Formatter</h3>
              <p class="tool-card-desc">Format, validate and auto-repair JSON with smart error detection.</p>
            </div>
            <div class="tool-card-arrow">â†’</div>
          </router-link>

          <!-- JSON Stringify -->
          <router-link to="/json-stringify" class="tool-card card-3d reveal" @mousemove="tilt($event)" @mouseleave="resetTilt($event)">
            <div class="tool-card-icon" style="--icon-clr:#059669;--icon-bg:#ecfdf5;">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div class="tool-card-body">
              <h3 class="tool-card-name">JSON Stringify</h3>
              <p class="tool-card-desc">Convert plain text into JSON-safe escaped strings instantly.</p>
            </div>
            <div class="tool-card-arrow">â†’</div>
          </router-link>

          <!-- Markdown -->
          <router-link to="/markdown-preview" class="tool-card card-3d reveal" @mousemove="tilt($event)" @mouseleave="resetTilt($event)">
            <div class="tool-card-icon" style="--icon-clr:#7c3aed;--icon-bg:#f5f3ff;">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div class="tool-card-body">
              <h3 class="tool-card-name">Markdown Preview</h3>
              <p class="tool-card-desc">Write and preview Markdown with live rendering side-by-side.</p>
            </div>
            <div class="tool-card-arrow">â†’</div>
          </router-link>

          <!-- Diff Checker -->
          <router-link to="/diff-checker" class="tool-card card-3d reveal" @mousemove="tilt($event)" @mouseleave="resetTilt($event)">
            <div class="tool-card-icon" style="--icon-clr:#d97706;--icon-bg:#fffbeb;">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" /></svg>
            </div>
            <div class="tool-card-body">
              <h3 class="tool-card-name">Diff Checker</h3>
              <p class="tool-card-desc">Compare two text blocks and highlight every difference clearly.</p>
            </div>
            <div class="tool-card-arrow">â†’</div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- â”€â”€ Recent History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
    <section v-if="authStore.isAuthenticated && recentResults.length > 0" class="history-section">
      <div class="tools-inner">
        <div class="flex items-center justify-between mb-6 reveal">
          <h2 class="section-title">Recent History</h2>
          <router-link to="/saved" class="history-link">View all â†’</router-link>
        </div>
        <div class="history-list reveal">
          <div
            v-for="result in recentResults"
            :key="result.id"
            @click="goToTool(result.toolType)"
            class="history-item"
          >
            <span class="history-badge" :class="getToolTypeClass(result.toolType)">
              {{ getToolTypeName(result.toolType) }}
            </span>
            <p class="history-input">{{ result.input }}</p>
            <span class="history-time">{{ formatDate(result.createdAt) }}</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { savedResultsApi } from '../api/saved'

interface SavedResult {
  id: number; userId: number; toolType: number
  input: string; output: string; createdAt: string
}

const authStore = useAuthStore()
const recentResults = ref<SavedResult[]>([])

// â”€â”€ 3D card tilt â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const tilt = (e: MouseEvent) => {
  const card = (e.currentTarget as HTMLElement)
  const { left, top, width, height } = card.getBoundingClientRect()
  const x = (e.clientX - left) / width  - 0.5   // -0.5 â†’ +0.5
  const y = (e.clientY - top)  / height - 0.5
  card.style.setProperty('--rx', `${-y * 9}deg`)
  card.style.setProperty('--ry', `${x * 9}deg`)
  card.style.transform = `perspective(800px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateZ(6px)`
}

const resetTilt = (e: MouseEvent) => {
  const card = (e.currentTarget as HTMLElement)
  card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)'
}

// â”€â”€ Scroll reveal (IntersectionObserver) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const activateReveal = () => {
  const items = document.querySelectorAll<HTMLElement>('.reveal')
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); obs.unobserve(e.target) } }),
    { threshold: 0.12 }
  )
  items.forEach((el, i) => {
    const parent = el.parentElement
    if (parent?.classList.contains('reveal-stagger')) {
      el.style.setProperty('--delay', `${i * 80}ms`)
    }
    obs.observe(el)
  })
}

// â”€â”€ Tool meta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const toolTypeNames: Record<number, string> = { 1: 'JSON Formatter', 2: 'JSON Stringify', 3: 'Markdown', 4: 'Diff Checker' }
const toolTypeClasses: Record<number, string> = { 1: 'badge-blue', 2: 'badge-green', 3: 'badge-purple', 4: 'badge-yellow' }
const toolTypeRoutes: Record<number, string> = { 1: '/json-formatter', 2: '/json-stringify', 3: '/markdown-preview', 4: '/diff-checker' }

const getToolTypeName  = (t: number) => toolTypeNames[t]  || 'Tool'
const getToolTypeClass = (t: number) => toolTypeClasses[t] || 'badge-gray'

const formatDate = (s: string) => {
  const diff = Date.now() - new Date(s).getTime()
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000)
  if (m < 1) return 'Just now'; if (m < 60) return `${m}m ago`; if (h < 24) return `${h}h ago`
  if (d < 7) return `${d}d ago`; return new Date(s).toLocaleDateString()
}

const goToTool = (t: number) => { if (toolTypeRoutes[t]) window.location.href = toolTypeRoutes[t] }

onMounted(async () => {
  activateReveal()
  if (authStore.isAuthenticated) {
    try { recentResults.value = (await savedResultsApi.getAll()).data.slice(0, 3) } catch {}
  }
})
</script>

<style scoped>
/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 76vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1d1160 70%, #0f172a 100%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 6rem 2rem 6rem;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  padding: 0.3rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(6px);
}

.hero-title {
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.hero-title-accent {
  background: linear-gradient(90deg, #a78bfa, #60a5fa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.7;
  color: rgba(255,255,255,0.62);
  max-width: 520px;
  margin: 0 auto 2.5rem;
}

.hero-cta { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
.hero-btn { padding: 0.85rem 2rem; font-size: 1.05rem; border-radius: 0.625rem; }

/* Orbs */
.orb-1 { width: 520px; height: 520px; background: #4f46e5; top: -160px; right: -120px; --dur: 9s; }
.orb-2 { width: 380px; height: 380px; background: #7c3aed; bottom: -100px; left: -80px;  --dur: 12s; animation-delay: -3s; }
.orb-3 { width: 260px; height: 260px; background: #0ea5e9; top: 30%;  left: 25%;        --dur: 7s;  animation-delay: -1.5s; opacity: 0.2; }

/* â”€â”€ Section shared â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.tools-section  { padding: 5rem 1.5rem; }
.history-section { padding: 0 1.5rem 5rem; }
.tools-inner { max-width: 1100px; margin: 0 auto; }

.section-header { margin-bottom: 3rem; }
.section-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
.section-sub { color: #6b7280; margin-top: 0.4rem; font-size: 1.05rem; }

/* â”€â”€ Tool grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.75rem;
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1.5px solid #e5e7eb;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.3s ease;
}

.tool-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0) 60%, rgba(79,70,229,0.04) 100%);
  pointer-events: none;
}

.tool-card:hover { border-color: #c7d2fe; }

.tool-card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.875rem;
  background: var(--icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.25s var(--ease-out-expo);
}
.tool-card:hover .tool-card-icon { transform: scale(1.1) rotate(-3deg); }

.tool-card-icon svg {
  width: 1.4rem;
  height: 1.4rem;
  stroke: var(--icon-clr);
}

.tool-card-body { flex: 1; }
.tool-card-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.4rem;
  transition: color 0.15s ease;
}
.tool-card:hover .tool-card-name { color: #4f46e5; }
.tool-card-desc { font-size: 0.925rem; color: #6b7280; line-height: 1.55; }

.tool-card-arrow {
  font-size: 1.1rem;
  color: #d1d5db;
  align-self: flex-end;
  transition: color 0.2s ease, transform 0.2s var(--ease-out-expo);
}
.tool-card:hover .tool-card-arrow { color: #4f46e5; transform: translateX(4px); }

/* â”€â”€ History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.history-link { font-size: 0.9rem; color: #4f46e5; font-weight: 600; text-decoration: none; }
.history-link:hover { text-decoration: underline; }

.history-list { display: flex; flex-direction: column; gap: 0.625rem; }

.history-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.875rem;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.history-item:hover { border-color: #a5b4fc; box-shadow: 0 4px 12px rgba(79,70,229,0.08); }

.history-badge {
  flex-shrink: 0;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}
.badge-blue   { background: #ede9fe; color: #4338ca; }
.badge-green  { background: #d1fae5; color: #065f46; }
.badge-purple { background: #f3e8ff; color: #7c3aed; }
.badge-yellow { background: #fef9c3; color: #92400e; }
.badge-gray   { background: #f3f4f6; color: #374151; }

.history-input { flex: 1; font-size: 0.9rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.history-time  { flex-shrink: 0; font-size: 0.8rem; color: #9ca3af; }

/* ── Dark mode overrides ──────────────────────────────────────────── */
:global(.dark) .section-title  { color: #f1f5f9; }
:global(.dark) .section-sub    { color: #94a3b8; }

:global(.dark) .tool-card      { background: #1a2233; border-color: #2d3748; }
:global(.dark) .tool-card:hover { border-color: #6366f1; }
:global(.dark) .tool-card-name  { color: #f1f5f9; }
:global(.dark) .tool-card:hover .tool-card-name { color: #818cf8; }
:global(.dark) .tool-card-desc  { color: #94a3b8; }
:global(.dark) .tool-card-arrow { color: #374151; }
:global(.dark) .tool-card:hover .tool-card-arrow { color: #818cf8; }

:global(.dark) .history-item   { background: #1a2233; border-color: #2d3748; }
:global(.dark) .history-item:hover { border-color: #a5b4fc; }
:global(.dark) .history-input  { color: #94a3b8; }
:global(.dark) .history-time   { color: #64748b; }

:global(.dark) .badge-blue   { background: #1e2a4a; color: #93c5fd; }
:global(.dark) .badge-green  { background: #14302a; color: #6ee7b7; }
:global(.dark) .badge-purple { background: #281e4a; color: #c4b5fd; }
:global(.dark) .badge-yellow { background: #2a2010; color: #fcd34d; }
:global(.dark) .badge-gray   { background: #1c2230; color: #94a3b8; }
</style>
