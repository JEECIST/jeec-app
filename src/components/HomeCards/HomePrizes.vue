<template>
  <div class="today-prizes">
    <template v-if="prizes.individual_prize != null">
      <div class="prizes-container">
        <h2>Today's Daily Prize</h2>
        <div class="prizes-flex">
          <div v-if="prizes.individual_prize != null" class="prize">
            <router-link to="prizes" class="prize-img radient-border-passthrough">
              <img :src="prizes.individual_prize" class="activity-img" />
            </router-link>
          </div>
          <router-link
            to="/shop"
            class="buy-ticket"
            :class="{ pressed: isPressed }"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            Buy Ticket
          </router-link>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="no-prizes">
        <h2>No Prizes today</h2>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import authHeader from '@/services/auth-header'
import { useUserStore } from '@/stores/UserStore'
import { onMounted } from 'vue'
const userStore = useUserStore()
const student = userStore.user

// const jeec_brain_url = import.meta.env.VITE_APP_JEEC_BRAIN_URL.slice(0, -1);

const prizes = ref({
  individual_prize: null, // Added fictional prize
})

// Uncommented the function for testing
function getDailyPrizes() {
  axios
    .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/home_prize', {
      headers: {
        ...authHeader(),
        student: student,
      },
    })
    .then((response) => {
      prizes.value = {
        individual_prize: response.data.img_daily_prize || null,
      }
    })
    .catch((error) => {
      console.error('Error fetching daily prizes:', error)
      prizes.value = { individual_prize: null } // Fallback to avoid rendering issues
    })
}

onMounted(() => {
  getDailyPrizes()
})

const isPressed = ref(false)

const onTouchStart = () => (isPressed.value = true)
const onTouchEnd = () => setTimeout(() => (isPressed.value = false), 100)
</script>
<style scoped>
.today-prizes {
  color: var(--color-font);
  --background: rgba(var(--color-strong-pink-rgb), 0.1);
  /* Use RGB values with transparency */
  --border-background: var(--color-strong-pink);
}

.today-prizes h2 {
  font-size: clamp(1.3rem, 3.1vw, 1.8rem);
  font-family: 'Lexend Exa';
  text-transform: uppercase;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.no-prizes {
  padding: 2rem 0;
  color: var(--color-font);
  font-size: clamp(1.7rem, 3.6vw, 2.3rem);
  text-shadow: 0px 4px 4px rgba(255, 0, 110, 0.25);
  --background: var(--color-strong-pink);
  --border-background: var(--color-strong-pink);
}

.prizes-container {
  padding: 0.5rem 0.05rem 0.9rem 0.05rem;
}

.prizes-flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1rem 0 0 0;
  gap: 1.5rem;
  overflow: hidden;
}

.prize-img {
  max-width: 90px;
  flex-grow: 1;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  --border-radius: 50%;
  object-fit: contain;
}

.prize-img::before {
  content: '';
}

.prize-img img {
  width: 99%;
  height: 99%;
  object-fit: contain;
}

.buy-ticket {
  display: flex;
  padding: 8px 17.5px;
  letter-spacing: 1px;
  font-size: 90%;
  /* Adjusted to approximate 16px */
  font-weight: light;
  font-family: 'Lexend Exa';
  border: none;
  border-radius: 15px;
  background-color: var(--color-strong-pink);
  color: white;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  max-width: 50%;
  align-content: center;
  max-height: 10%;
  text-decoration: none;
}

.pressed {
  transform: scale(1.1);
  opacity: 0.8;
}

@media screen and (max-width: 450px) {
  .prizes-flex {
    flex-direction: row;
    align-items: center;
  }
}
</style>
