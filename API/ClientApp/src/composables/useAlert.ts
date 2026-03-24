import { ref } from 'vue'

const visible = ref(false)
const type = ref<'success' | 'error'>('success')
const message = ref('')

export function useAlert() {
  const showSuccess = (msg: string) => {
    type.value = 'success'
    message.value = msg
    visible.value = true
  }

  const showError = (msg: string) => {
    type.value = 'error'
    message.value = msg
    visible.value = true
  }

  const hide = () => {
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
