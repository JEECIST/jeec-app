<template>
  <div class="wrapper">
    <div class="hero-section">
      <h1 class="hero-text">EMPOWER</h1>
      <h1 class="hero-text">YOUR FUTURE</h1>
      <div class="brand-row">
        <h1 class="hero-text">WITH</h1>
        <img :src="jeeclogo" class="jeec-logo-hero" alt="JEEC" />
      </div>
    </div>
    <div class="button_wrapper">
      <GoogleLogin :callback="callback" :buttonConfig="{ width: 250 }" />
      <button @click="loginDev">Login DEV</button>
      <button @click="loginDev_2">Login DEV 2</button>
      <p>v3.0</p>
    </div>
  </div>


</template>

<script setup>
import axios from 'axios'
import { useUserStore } from '@/stores/UserStore'
import { decodeCredential } from 'vue3-google-login'
// import loginBackground from '@/assets/login-background.png'
import jeeclogo from '@/assets/jeec_horizontal_mobile_white.svg'

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
  align-items: center;
  background-image: url('@/assets/login-background.png');

  /* Garante que a imagem cobre o ecrã todo sem se deformar */
  background-size: cover;

  /* Mantém a parte mais importante da imagem no centro */
  background-position: center;

  /* Previne que a imagem se repita se o ecrã for muito grande */
  background-repeat: no-repeat;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* Aligns text to the left inside the box */
  width: 100%;
  max-width: 360px;
  /* Keeps the block compact so it centers nicely */
  margin: auto 0;
  /* Pushes it to the vertical center of the wrapper */
}

.hero-text {
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 600;
  font-size: 2.2rem;
  /* Big impact font */
  line-height: 1.2;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.brand-row {
  display: flex;
  align-items: top;
  gap: 7px;
}

.brand-row>.hero-text {
  /* 0 offsets, increasing blur radii, and a deep blue color */
  text-shadow:
    0 0 5px rgba(0, 50, 255, 0.8),
    0 0 12px rgba(0, 50, 255, 0.6),
    0 0 20px rgba(0, 50, 255, 0.4);
}

.brand-row>img {
  height: auto;
  width: 13rem;
}

.jeec-logo-hero {
  height: 2.2rem;
  /* Matches the text size perfectly */
  width: auto;
  display: block;
}

.button_wrapper {
  position: absolute;
  top: 80%;
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
