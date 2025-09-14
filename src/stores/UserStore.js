import { defineStore } from 'pinia'
import axios from 'axios'
import authHeader from '@/services/auth-header'

export const useUserStore = defineStore('UserStore', {
  state: () => {
    return {
      loggedIn: false,
      loggedInState: false,
      user: {
        name: '',
        username: '',
        email: '',
        picture: '',
        student_external_id: '',
      },
      milestones: {
        total: 0,
        daily: 0,
        squad: 0,
      },
      userPoints: {
        total_points: 0,
        daily_points: 0,
        current_points: 0,
      },
    }
  },
  actions: {
    isLoggedIn() {
      var buffer = localStorage.getItem('loggedIn')
      this.loggedIn = JSON.parse(buffer)

      if (this.loggedIn == true) {
        buffer = localStorage.getItem('user')
        this.user = { ...JSON.parse(buffer) }
      }
    },

    logOut() {
      localStorage.clear()
      this.loggedInState = false
      window.location.reload()
    },

    async authUser(jwt) {
      await axios
        .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/current_student_24', {
          headers: { Authorization: jwt },
        })
        .then((response) => {
          const data = response.data
          this.user = data.current_student
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('loggedIn', JSON.stringify(true))
          localStorage.setItem('jwt', JSON.stringify(jwt))
        })

      if (this.user.name != '') {
        window.location.replace('home')
      } else {
        window.location.reload()
      }
    },
    async getMilestones() {
      await axios
        .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/get_event_points', {
          headers: authHeader(),
        })
        .then((response) => {
          this.milestones.total = response.data.total_event_points
          this.milestones.daily = response.data.daily_event_points
          this.milestones.squad = response.data.squad_event_points
        })
    },
    async getPoints() {
      await axios
        .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/game_info', {
          headers: authHeader(),
        })
        .then((response) => {
          this.userPoints = response.data
        })
    },
  },
})
