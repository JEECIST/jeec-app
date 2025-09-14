import axios from 'axios'

const jeec_log_url = import.meta.env.VITE_APP_JEEC_BRAIN_URL.VITE_APP_JEEC_LOG_URL
let jwt = localStorage.getItem('jwt')

class LogService {
  async postLog(entrypoint) {
    if (jwt) {
      return axios.post(jeec_log_url + '/log', {
        jwt: jwt,
        entrypoint: entrypoint,
      })
    }
  }
}

export default new LogService()
