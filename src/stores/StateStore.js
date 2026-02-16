// StateStore.js
import { defineStore } from 'pinia'
import UserService from '../services/user.service' // where getIsSubscribed lives

export const useStateStore = defineStore('StateStore', {
  state: () => ({
    navOpen: false,
    qrCodeOpen: false,

    notificationsOpen: false,
    notificationsSubscribed: null, // ✅ null = unknown/loading, true/false = known
  }),

  actions: {
    async refreshNotificationSubscription() {
      this.notificationsSubscribed = null
      try {
        const { data } = await UserService.getIsSubscribed()
        this.notificationsSubscribed = !!data?.subscribed
      } catch (e) {
        this.notificationsSubscribed = false
      }
    },
  },
})
