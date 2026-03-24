import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let resolvePromise: ((value: boolean) => void) | null = null

export function useConfirm() {
  const confirm = (msg: string): Promise<boolean> => {
    message.value = msg
    visible.value = true
    
    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  const handleConfirm = () => {
    visible.value = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  const handleCancel = () => {
    visible.value = false
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  return {
    visible,
    message,
    confirm,
    handleConfirm,
    handleCancel
  }
}
