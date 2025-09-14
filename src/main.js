import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia, setMapStoreSuffix } from 'pinia'
import Vue3GoogleLogin from 'vue3-google-login'
import './global.css'

const app = createApp(App)

setMapStoreSuffix('')
export const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Vue3GoogleLogin, {
  clientId: '286554998545-hsatr3tkmeskks4r3r4eb7vcfsbv25h7.apps.googleusercontent.com',
})
app.mount('#app')
