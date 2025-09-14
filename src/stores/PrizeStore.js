import { defineStore } from 'pinia'
import axios from 'axios'
import authHeader from '../services/auth-header'

export const usePrizeStore = defineStore('PrizeStore', {
  state: () => {
    return {
      prizes: {
        individual_daily_rewards: [],
        individual_weekly_rewards: [],
        squad_daily_rewards: [],
        squad_weekly_rewards: [],
        jeecpot_prizes: [],
      },
    }
  },
  actions: {
    async getRewards() {
      await axios
        .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/prizes_details', {
          headers: authHeader(),
        })
        .then((response) => {
          this.prizes = response.data
        })
    },
  },
})
