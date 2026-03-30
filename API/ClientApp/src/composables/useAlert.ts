import { ref } from 'vue'

const visible = ref(false)
const type = ref<'success' | 'error'>('success')
const message = ref('')

let _timer: ReturnType<typeof setTimeout> | null = null

const _scheduleHide = (ms: number) => {
  if (_timer) clearTimeout(_timer)
  _timer = setTimeout(() => { visible.value = false }, ms)
}

export function useAlert() {
  const showSuccess = (msg: string) => {
    visible.value = false
    setTimeout(() => {
      type.value = 'success'
      message.value = msg
      visible.value = true
      _scheduleHide(3000)
    }, 10)
  }

  const showError = (msg: string) => {
    visible.value = false
    setTimeout(() => {
      type.value = 'error'
      message.value = msg
      visible.value = true
      _scheduleHide(5000)
    }, 10)
  }

  const hide = () => {
    if (_timer) { clearTimeout(_timer); _timer = null }
    visible.value = false
  }

  return {
    visible,
    type,
    message,
    showSuccess,
    showError,
    hide
  }
}
