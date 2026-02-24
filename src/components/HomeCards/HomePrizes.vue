<template>
  <div class="daily-prize-card">
    <template v-if="currentPrize">
      <!-- Image positioned absolutely, outside card-body flow -->
      <div class="prize-image-wrapper">
        <Transition :name="slideDirection" mode="out-in">
          <img :key="currentIndex" :src="currentPrize.image" :alt="currentPrize.name" class="prize-image" />
        </Transition>
      </div>

      <div class="card-body">
        <Transition :name="slideDirection" mode="out-in">
          <h2 class="prize-title" :key="'title-' + currentIndex">{{ currentPrize.type }} PRIZE</h2>
        </Transition>
        <Transition :name="slideDirection" mode="out-in">
          <p class="prize-name" :key="currentIndex">{{ currentPrize.name }}</p>
        </Transition>

        <a href="#" @click.prevent="toggleInfo" class="info-link">{{ isExpanded ? '- info' : '+ info' }}</a>

        <Transition name="expand">
          <div v-if="isExpanded" class="prize-info-message">
            <template v-if="currentPrize.activityName">
              <p>You have a chance to win this prize by participating in the activity: <strong>{{
                currentPrize.activityName }} - {{ currentPrize.activityType }}</strong></p>
            </template>
            <template v-else>
              <p>You have more chances to win this prize by getting more daily points</p>
            </template>
          </div>
        </Transition>

        <div class="view-all-row">
          <span class="line"></span>
          <router-link to="/prizes" class="view-all-link">view all</router-link>
          <span class="line"></span>
        </div>
      </div>

      <!-- Carousel arrows -->
      <button v-if="prizes.length > 1" class="arrow arrow-left" @click="prevPrize">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
      <button v-if="prizes.length > 1" class="arrow arrow-right" @click="nextPrize">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
            stroke-linejoin="round" />
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
const isExpanded = ref(false)

const prizes = ref([])

function toggleInfo() {
  isExpanded.value = !isExpanded.value
}

function getDailyPrizes() {
  axios
    .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/home_prize', {
      headers: {
        ...authHeader(),
        student: student,
      },
    })
    .then((response) => {
      const data = response.data
      const allPrizes = []

      // Add daily prize if available
      if (data.dayly_prize && data.dayly_prize.image) {
        allPrizes.push({
          image: data.dayly_prize.image,
          name: data.dayly_prize.name,
          type: data.dayly_prize.type,
        })
      }

      // Add activity prizes if available
      if (data.activity_prizes && Array.isArray(data.activity_prizes)) {
        data.activity_prizes.forEach((activity) => {
          if (activity.prize_image) {
            allPrizes.push({
              image: activity.prize_image,
              name: activity.prize_name,
              type: activity.prize_type,
              activityName: activity.activity_name,
              activityType: activity.activity_type,
            })
          }
        })
      }

      prizes.value = allPrizes
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
    isExpanded.value = false
  }
}

function prevPrize() {
  if (prizes.value.length > 1) {
    slideDirection.value = 'slide-right'
    currentIndex.value =
      (currentIndex.value - 1 + prizes.value.length) % prizes.value.length
    isExpanded.value = false
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
  transition: all 0.3s ease;

  --background: var(--color-prizes-background);
  --border-background: var(--color-prizes-border);
}

/* Image wrapper positioned absolutely relative to card */
.prize-image-wrapper {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  z-index: 10;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prize-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
}

.card-body {
  position: relative;
  z-index: 2;
  padding: 1.5rem 1.5rem 1.2rem 1.5rem;
  text-align: center;
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
  margin-bottom: 0.6rem;
}

.info-link:hover {
  opacity: 1;
}

/* Expandable info message */
.prize-info-message {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(0.9rem, 3vw, 1rem);
  color: var(--color-font);
  line-height: 1.6;
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  text-align: left;
}

.prize-info-message p {
  margin: 0;
}

.prize-info-message strong {
  color: #fff;
  font-weight: 700;
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

/* Expand transition for info message */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

@media screen and (max-width: 700px) {
  .arrow {
    top: 35%;
  }

  .arrow-left {
    left: -1.5rem;
  }

  .arrow-right {
    right: -1.5rem;
  }
}

@media screen and (max-width: 500px) {
  .arrow {
    top: 40%;
  }

  .arrow-left {
    left: -2.5rem;
  }

  .arrow-right {
    right: -2.5rem;
  }
}
</style>
