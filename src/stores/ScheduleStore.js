import { defineStore } from 'pinia'
import axios from 'axios'
import authHeader from '@/services/auth-header'

export const useScheduleStore = defineStore('ScheduleStore', {
  state: () => {
    return {
      activites: [],
    }
  },
  actions: {
    async getActivities() {
      return axios
        .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/activities?date=', {
          headers: authHeader(),
        })
        .then((response) => {
          this.activites = response.data.data
        })
    },
  },
})
