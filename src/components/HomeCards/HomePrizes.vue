<template>
  <div class="daily-prize-card">
    <template v-if="currentPrize">
      <div class="card-body">
        <div class="prize-image-wrapper">
          <Transition :name="slideDirection" mode="out-in">
            <img :key="currentIndex" :src="currentPrize.image" :alt="currentPrize.name" class="prize-image" />
          </Transition>
        </div>
        <h2 class="prize-title">DAILY PRIZE</h2>
        <Transition :name="slideDirection" mode="out-in">
          <p class="prize-name" :key="currentIndex">{{ currentPrize.name }}</p>
        </Transition>

        <router-link to="/help" class="info-link">+ info</router-link>

        <div class="view-all-row">
          <span class="line"></span>
          <router-link to="/draw" class="view-all-link">view all</router-link>
          <span class="line"></span>
        </div>
      </div>

      <!-- Carousel arrows -->
      <button
        v-if="prizes.length > 1"
        class="arrow arrow-left"
        @click="prevPrize"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        v-if="prizes.length > 1"
        class="arrow arrow-right"
        @click="nextPrize"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </template>
    <template v-else>
      <div class="no-prizes">
        <h2>No Prizes today</h2>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import authHeader from '@/services/auth-header'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
const student = userStore.user

const currentIndex = ref(0)
const slideDirection = ref('slide-left')

const prizes = ref([])

function getDailyPrizes() {
  axios
    .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/home_prize', {
      headers: {
        ...authHeader(),
        student: student,
      },
    })
    .then((response) => {
      if (response.data && response.data.img_daily_prize) {
        // API returns { img_daily_prize: "data:image/...", error: "" }
        prizes.value = [{
          image: response.data.img_daily_prize,
          name: 'Ipad Air',
        }]
      } else {
        prizes.value = []
      }
    })
    .catch((error) => {
      console.error('Error fetching daily prizes:', error)
      prizes.value = []
    })
}

const currentPrize = computed(() => {
  if (prizes.value.length === 0) return null
  return prizes.value[currentIndex.value]
})

function nextPrize() {
  if (prizes.value.length > 1) {
    slideDirection.value = 'slide-left'
    currentIndex.value = (currentIndex.value + 1) % prizes.value.length
  }
}

function prevPrize() {
  if (prizes.value.length > 1) {
    slideDirection.value = 'slide-right'
    currentIndex.value =
      (currentIndex.value - 1 + prizes.value.length) % prizes.value.length
  }
}

onMounted(() => {
  getDailyPrizes()
})

</script>

<style scoped>
.daily-prize-card {
  position: relative;
  color: var(--color-font);
  overflow: visible;
  
  --background: var(--color-prizes-background);
  --border-background: var(--color-prizes-border);
}

.card-body {
  position: relative;
  z-index: 2;
  padding: 1rem 1.5rem 1.2rem 1.5rem;
  text-align: center;
}

/* Prize image sitting above the title in normal flow, pulled outside the card */
.prize-image-wrapper {
  display: flex;
  justify-content: center;
  margin-top: -7rem;
  margin-bottom: -0.5rem;
  pointer-events: none;
  position: relative;
  z-index: 10;
}

.prize-image {
  width: 120px;
  max-width: 35%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
}

/* Title with pink/purple neon glow */
.prize-title {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 0.5rem 0;
  color: #fff;
  text-shadow:
    0 0 10px rgba(200, 100, 255, 0.8),
    0 0 30px rgba(180, 60, 255, 0.5),
    0 0 60px rgba(160, 40, 255, 0.3);
}

.prize-name {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(1rem, 3.5vw, 1.3rem);
  font-weight: 600;
  color: var(--color-font);
  margin: 0 0 0.6rem 0;
  letter-spacing: 0.03em;
}

.info-link {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(0.85rem, 2.8vw, 1rem);
  color: var(--color-font);
  text-decoration: none;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  display: inline-block;
  margin-bottom: 1rem;
}

.info-link:hover {
  opacity: 1;
}

/* "view all" with lines on each side */
.view-all-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.3rem;
}

.view-all-row .line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.view-all-link {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(0.85rem, 2.8vw, 1rem);
  color: var(--color-font);
  text-decoration: none;
  opacity: 0.7;
  white-space: nowrap;
  transition: opacity 0.3s ease;
  letter-spacing: 0.05em;
}

.view-all-link:hover {
  opacity: 1;
}

/* Carousel arrows */
.arrow {
  position: absolute;
  top: 30%;
  z-index: 3;
  background: none;
  border: none;
  color: var(--color-font);
  opacity: 1;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.arrow:hover {
  opacity: 1;
  transform: scale(1.2);
}

.arrow-left {
  left: -2rem;
}

.arrow-right {
  right: -2rem;
}

.no-prizes {
  padding: 2.5rem 0;
  text-align: center;
}

.no-prizes h2 {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  text-transform: uppercase;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: var(--color-font);
}

/* Slide left (next) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

/* Slide right (prev) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

@media screen and (max-width: 500px) {
  .arrow-left {
    left: -1.2rem;
  }

  .arrow-right {
    right: -1.2rem;
  }
}
</style>
