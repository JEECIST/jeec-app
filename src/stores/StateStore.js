import { defineStore } from 'pinia'

export const useStateStore = defineStore('StateStore', {
  state: () => {
    return {
      navOpen: false,
      qrCodeOpen: false,
    }
  },
})
