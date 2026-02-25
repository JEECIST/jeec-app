<template>
  <div class="wrapper">
    <!-- <div class="welcome">
      <h2>Welcome to</h2>
      <img alt="JEEC" src="@/assets/jeec_logo_darkmode.svg" />
    </div>

    <div class="login">
      <p>Login to our Webapp</p>
      <p>Stay tunned JEEC coming soon!</p>
      <div class="button_wrapper">
        <GoogleLogin :callback="callback" />
        <button @click="loginDev">Login DEV</button>
        <button @click="loginDev_2">Login DEV 2</button>
        <p>v3.0</p>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import axios from 'axios'
import { useUserStore } from '@/stores/UserStore'
import { decodeCredential } from 'vue3-google-login'
// import loginBackground from '@/assets/login-background.png'

import CryptoJS from 'crypto-js'

const userStore = useUserStore()

const callback = (response) => {
  const userData = decodeCredential(response.credential)

  axios
    .post(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/redirecturigoogle', userData)
    .then((response) => {
      const jwt = decrypt(response.data)

      userStore.authUser(jwt)
    })
}

function loginDev() {
  const userData = {
    email: 'jose.paradela@tecnico.ulisboa.pt',
    name: 'Paradela',
    picture:
      'https://lh3.googleusercontent.com/a/ACg8ocKjA1Qo1DFfQJiC7jvDb4u59lYIIXfx2JszEa-SsfQRCijyiQ=s96-c',
  }

  axios
    .post(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/redirecturigoogle', userData)
    .then((response) => {
      const jwt = decrypt(response.data)
      userStore.authUser(jwt)
    })
}

function loginDev_2() {
  const userData = {
    email: 'markurto2@gmail.com',
    name: 'Curtorepe',
    picture:
      'https://lh3.googleusercontent.com/a/ACg8ocKjA1Qo1DFfQJiC7jvDb4u59lYIIXfx2JszEa-SsfQRCijyiQ=s96-c',
  }

  axios
    .post(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/redirecturigoogle', userData)
    .then((response) => {
      const jwt = decrypt(response.data)
      userStore.authUser(jwt)
    })
}

function decrypt(code) {
  const master_key = '12345678901234561234567890123456'
  const rawData = atob(code)

  let iv = rawData.substring(0, 16)
  let crypttext = rawData.substring(16)

  iv = CryptoJS.enc.Latin1.parse(iv)
  crypttext = CryptoJS.enc.Latin1.parse(crypttext)

  const key = CryptoJS.enc.Utf8.parse(master_key)

  const plaintextArray = CryptoJS.AES.decrypt({ ciphertext: crypttext }, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  const output_plaintext = CryptoJS.enc.Latin1.stringify(plaintextArray)

  return output_plaintext
}
</script>

<style scoped>
.wrapper {
  height: 100svh;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/login-background.png');

  /* Garante que a imagem cobre o ecrã todo sem se deformar */
  background-size: cover;

  /* Mantém a parte mais importante da imagem no centro */
  background-position: center;

  /* Previne que a imagem se repita se o ecrã for muito grande */
  background-repeat: no-repeat;
}

.welcome {
  width: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.welcome h2 {
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
}

.welcome img {
  display: block;
  width: 100%;
  object-fit: contain;
  max-width: 300px;
}

.login {
  margin: 0 auto;
  margin-top: 100px;
  width: 90%;
  background-color: var(--color-background-sec);
  border-radius: 20px;
  height: 200px;
  max-width: 300px;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.button_wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -30%;
}

.button_wrapper p {
  padding-top: 0.3rem;
}

.g-btn-wrapper {
  margin: 0 auto;
}

@media screen and (min-width: 500px) {
  .login {
    max-width: 500px;
  }
}
</style>
