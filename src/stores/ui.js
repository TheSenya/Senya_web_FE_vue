import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
    theme: 'light',
    showMobileMenu: false
  }),
  actions: {
    setLoading(status) {
      this.isLoading = status
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    }
  }
}) 