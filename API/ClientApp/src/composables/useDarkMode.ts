import { ref } from 'vue'

// Module-level singleton so all callers share the same state
const isDark = ref(false)

function applyTheme(dark: boolean, animate = false) {
  if (animate) {
    document.documentElement.classList.add('theme-transitioning')
    // Remove the class after the transition completes (longest property = 350 ms)
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 400)
  }
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

export function useDarkMode() {
  const toggle = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value, true)
  }

  const init = () => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = saved !== null ? saved === 'dark' : prefersDark
    applyTheme(isDark.value, false)
  }

  return { isDark, toggle, init }
}
