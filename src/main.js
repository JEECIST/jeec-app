import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia, setMapStoreSuffix } from 'pinia'
import Vue3GoogleLogin from 'vue3-google-login'
import axios from 'axios'
import { incrementRequests, decrementRequests } from './services/loader.service'
import './global.css'

// Setup axios interceptors for loading state
axios.interceptors.request.use(
  (config) => {
    incrementRequests()
    return config
  },
  (error) => {
    decrementRequests()
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    decrementRequests()
    return response
  },
  (error) => {
    decrementRequests()
    return Promise.reject(error)
  }
)

const app = createApp(App)

setMapStoreSuffix('')
export const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Vue3GoogleLogin, {
  clientId: '286554998545-hsatr3tkmeskks4r3r4eb7vcfsbv25h7.apps.googleusercontent.com',
})
app.mount('#app')
