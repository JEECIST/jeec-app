<template>
  <div
    class="eletrolink-card"
    :style="{
      '--background': 'rgba(var(--color-yellow-rgb), 0.1)',
      '--border-background': 'var(--color-yellow)',
    }"
  >
    <div v-if="no_eletrolink" class="container">
      <!-- Title -->
      <h2>ELETROLINK</h2>

      <!-- Subtitle -->
      <p class="subtitle">Today’s companies:</p>

      <!-- Company Logos -->
      <div class="companies">
        <div class="company" v-for="(company, index) in companies.images" :key="index">
          <img :src="company" class="logo" />
        </div>
      </div>

      <!-- Sign-up Button -->
      <router-link
        to="eletrolink"
        class="signup-btn"
        :class="{ pressed: isPressed }"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        Sign up</router-link
      >
    </div>
    <!-- No Eletrolink Message -->
    <div v-else class="no-eletrolink">No Eletrolink today</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import authHeader from '@/services/auth-header'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
const student = userStore.user

onMounted(() => {
  getEletrolink()
})

const jeec_brain_url = import.meta.env.VITE_APP_JEEC_BRAIN_URL.slice(0, -1)
// Example logos (Replace with real images)
const companies = ref({
  images: [],
})
const no_eletrolink = ref()

const isPressed = ref(false)

const onTouchStart = () => (isPressed.value = true)
const onTouchEnd = () => setTimeout(() => (isPressed.value = false), 100)

function getEletrolink() {
  axios
    .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/eletrolink_home', {
      headers: {
        ...authHeader(),
        student: student,
      },
    })
    .then((response) => {
      if (response.data.companies && response.data.companies.length > 0) {
        no_eletrolink.value = true
        companies.value.images = response.data.companies
      } else {
        no_eletrolink.value = false
      }
    })
    .catch((error) => {
      console.error('Error fetching Eletrolink data:', error)
      no_eletrolink.value = false // Handle error gracefully
    })
}
</script>

<style scoped>
.no-eletrolink {
  padding: 2rem 0;
  color: var(--color-font);
  font-size: clamp(1.4rem, 3.1vw, 1.8rem);
  font-family: 'Lexend Exa';
  text-transform: uppercase;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-weight: 700;
}

/* Container Styling */
.container {
  padding: 0.5rem 0.05rem 0.9rem 0.05rem;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  --background: rgba(var(--color-yellow-rgb), 0.1);
  /* Use RGB values with transparency */
  --border-background: var(--color-yellow);
}

/* Title */
.container h2 {
  font-size: clamp(1.4rem, 3.1vw, 1.8rem);
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: 'Lexend Exa';
  text-transform: uppercase;
}

/* Subtitle */
.subtitle {
  font-family: 'Lexend Exa';
  font-size: clamp(0.8rem, 3.2vw, 1.1rem);
  font-weight: 700;
  overflow: hidden;
  letter-spacing: 0.05em;
  align-self: flex-start;
  margin-bottom: 10px;
  margin-top: 5px;
}

/* Company Logos */
.companies {
  display: flex;
  justify-content: center;
  gap: 7%;
  margin-bottom: 15px;
  width: 85%;
  height: 100%;
}

.company {
  background: var(--c-ft);
  min-width: 60px;
  width: 5em;
  height: 3em;
  min-height: 40px;
  /* border-radius: 10px;
      border-color: var(--color-yellow-rgb);
      border-width: 5px; */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.logo {
  object-fit: contain;
  width: 100%;
  height: 100%;
  border: 2px solid var(--color-yellow);
  /* This adds the visible border */
  border-radius: 10px;
  /* Optional: softens the border */
  padding: 2px;
  /* Optional: gives spacing between image and border */
  background-color: white;
  /* Optional: ensures transparent logos stand out */
}

/* Sign-up Button */
.signup-btn {
  font-family: 'Lexend Exa';
  background-color: var(--color-yellow);
  color: var(--color-font);
  font-size: 1rem;
  font-weight: light;
  padding: 5px 15px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  text-decoration: none;
}

.pressed {
  transform: scale(1.1);
  opacity: 0.8;
}
</style>
