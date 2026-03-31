import { defineStore } from 'pinia'

interface DiffCheckerPending {
  original: string
  modified: string
}

export const useDiffCheckerStore = defineStore('diffChecker', {
  state: () => ({
    pending: null as DiffCheckerPending | null
  }),
  actions: {
    setInputs(original: string, modified: string) {
      this.pending = { original, modified }
    },
    consume(): DiffCheckerPending | null {
      const data = this.pending
      this.pending = null
      return data
    }
  }
})
