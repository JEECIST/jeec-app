<template>
  <div class="view">
    <!-- SECTION: Main Title and Description -->
    <section>
      <h3>Earn points by participating in JEEC!</h3>
      <p>
        Visit companies at the job fair or take part in Eletrolink to collect points. Use your
        points to buy tickets to the daily draw, increase your JEECPOT chances and more!
      </p>
    </section>

    <!-- Loading/Error handling -->
    <div v-if="isLoading" class="loading-container">
      <p>Loading prizes...</p>
    </div>

    <div v-else-if="hasError" class="error-container">
      <p>{{ errorMessage }}</p>
      <button @click="fetchPrizes" class="retry-btn">Retry</button>
    </div>

    <template v-else>
      <!-- SECTION: Daily Draw -->
      <section class="daily-draw-section" v-if="segmentedPrizes.Daily.length > 0">
        <h2>DAILY DRAW</h2>

        <div class="carousel-container">
          <Carousel v-bind="config">
            <Slide v-for="(prize, index) in dailyPrizes" :key="'daily-' + index">
              <div class="shop">
                <div class="carousel__item">
                  <div
                    class="circle"
                    :style="
                      prize.image
                        ? { backgroundImage: `url(${prize.image})`, backgroundSize: 'cover' }
                        : {}
                    "
                  ></div>
                  <p class="day-label">{{ prize.day || 'Not defined yet' }}</p>
                  <p class="prize-name">{{ prize.name }}</p>
                </div>
              </div>
            </Slide>
          </Carousel>
        </div>
      </section>

      <!-- SECTION: CV Draw -->
      <section class="cv-draw-section" v-if="segmentedPrizes.CV.length > 0">
        <h2>CV DRAW</h2>

        <div class="cv-container">
          <router-link to="/profile" class="upload-cv-btn">
            <div class="upload-cv-content">
              <!-- SVG Icon -->
              <img src="@/assets/CVImage.svg" alt="" />
              <span>Upload your CV</span>
            </div>
          </router-link>

          <div
            class="logo-cv"
            :style="
              cvPrize.image
                ? { backgroundImage: `url(${cvPrize.image})`, backgroundSize: 'cover' }
                : {}
            "
          ></div>
        </div>
        <p class="prize-description" v-if="cvPrize">{{ cvPrize.name }}</p>
      </section>

      <!-- SECTION: Solo Jeecpot -->
      <section class="solo-jeecpot-section" v-if="segmentedPrizes.Individual.length > 0">
        <h2>SOLO JEECPOT</h2>
        <p>The points you earn increase your chances of winning the JEECPOT!</p>

        <div class="prizes-grid">
          <div
            v-for="(prize, index) in individualPrizes.slice(0, 3)"
            :key="'individual-' + index"
            class="prize-item"
          >
            <div
              class="prize-circle"
              :style="
                prize.image
                  ? { backgroundImage: `url(${prize.image})`, backgroundSize: 'cover' }
                  : {}
              "
            ></div>
            <p class="prize-name">{{ prize.name }}</p>
          </div>
        </div>
      </section>

      <!-- SECTION: Squad Jeecpot -->
      <section class="squad-jeecpot-section" v-if="segmentedPrizes.Squad.length > 0">
        <h2>SQUAD JEECPOT</h2>
        <p>The points your squad earns increase your chances of winning the JEECPOT!</p>

        <div class="prizes-grid">
          <div
            v-for="(prize, index) in squadPrizes.slice(0, 3)"
            :key="'squad-' + index"
            class="prize-item"
          >
            <div
              class="prize-circle"
              :style="
                prize.image
                  ? { backgroundImage: `url(${prize.image})`, backgroundSize: 'cover' }
                  : {}
              "
            ></div>
            <p class="prize-name">{{ prize.name }}</p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import authHeader from '../services/auth-header'

const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const prizesArray = ref({
  Daily: [],
  Squad: [],
  Individual: [],
  CV: [],
  Shop: [],
})

const segmentedPrizes = ref({
  CV: [],
  Daily: [],
  Individual: [],
  Shop: [],
  Squad: [],
})

// Carousel configuration
const config = {
  adjustableHeight: true,
  snapAlign: 'center',
  autoplay: 4000,
  wrapAround: true,
  pauseAutoplayOnHover: true,
  breakpointMode: 'carousel',
  breakpoints: {
    0: {
      itemsToShow: 1.5,
    },
    300: {
      itemsToShow: 3,
    },
    550: {
      itemsToShow: 3,
    },
    700: {
      itemsToShow: 3,
    },
    1000: {
      itemsToShow: 5,
    },
  },
}

// Fetch prizes data from the backend
const fetchPrizes = async () => {
  try {
    isLoading.value = true
    hasError.value = false

    const response = await axios.get(
      import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/site-get-prizes',
      {
        headers: authHeader(),
      },
    )

    prizesArray.value = response.data
    // Segment the prizes by type
    segmentedPrizes.value = {
      CV: response.data.CV || [],
      Daily: response.data.Daily || [],
      Individual: response.data.Individual || [],
      Shop: response.data.Shop || [],
      Squad: response.data.Squad || [],
    }
  } catch (error) {
    console.error('Error fetching prizes:', error)
    hasError.value = true
    errorMessage.value = 'Failed to load prizes. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// Map date from rowplace to weekday
const getWeekdayFromRowplace = (rowplace) => {
  // Map known dates to weekdays
  const dateToWeekday = {
    '5/05': 'Monday',
    '6/05': 'Tuesday',
    '7/05': 'Wednesday',
    '8/05': 'Thursday',
    '9/05': 'Friday',
  }

  return dateToWeekday[rowplace] || null
}

// Helper computed properties to get prizes safely with proper formatting
const dailyPrizes = computed(() => {
  return segmentedPrizes.value.Daily.map((prize) => {
    // Determine the day based on rowplace
    const day = prize?.rowplace ? getWeekdayFromRowplace(prize.rowplace) : null

    return {
      name: prize?.name || 'Prize coming soon',
      image: prize?.image_url ? `data:image/*;base64,${prize.image_url}` : null,
      day: day,
    }
  })
})

const individualPrizes = computed(() => {
  return segmentedPrizes.value.Individual.map((prize) => ({
    name: prize?.name || 'Prize coming soon',
    image: prize?.image_url ? `data:image/*;base64,${prize.image_url}` : null,
  }))
})

const squadPrizes = computed(() => {
  return segmentedPrizes.value.Squad.map((prize) => ({
    name: prize?.name || 'Prize coming soon',
    image: prize?.image_url ? `data:image/*;base64,${prize.image_url}` : null,
  }))
})

const cvPrize = computed(() => {
  const prize = segmentedPrizes.value.CV?.[0]
  return prize
    ? {
        name: prize.name || 'Prize coming soon',
        image: prize.image_url ? `data:image/*;base64,${prize.image_url}` : null,
      }
    : { name: 'Prize coming soon', image: null }
})

// Call the fetch function when component mounts
onMounted(() => {
  fetchPrizes()
})
</script>

<style scoped>
.view {
  padding-top: var(--header-height);
  --acc-color: var(--c-acc-violet);
  padding-bottom: 100px;
}

.shop {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

section {
  padding: 20px;
  text-align: center;
  color: white;
}

h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-shadow:
    0 0 5px var(--color-strong-pink),
    0 0 10px var(--color-strong-pink),
    0 0 20px var(--color-strong-pink),
    0 0 40px var(--color-strong-pink);
  margin-bottom: 10px;
  text-transform: uppercase;
}

h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

p {
  font-size: 1rem;
  margin-top: 8px;
  margin-bottom: 16px;
}

a {
  text-decoration: none;
}

.daily-draw-section .carousel-container {
  margin-top: 20px;
  margin-bottom: 10px;
}

.carousel__item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle {
  width: 80px;
  height: 80px;
  border: 2px solid purple;
  border-radius: 50%;
  background: white;
  background-position: center;
}

.circle.bought {
  background: grey;
  border: none;
}

.day-label {
  margin-top: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0;
}

.prize-name {
  font-size: 0.8rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.buy-ticket-btn {
  display: inline-block;
  margin-top: 12px;
  background-color: #ff4c9b;
  padding: 8px 20px;
  border-radius: 12px;
  color: white;
  font-weight: bold;
}

.cv-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.upload-cv-btn {
  background: #ff4c9b;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 12px;
  color: white;
}

.upload-cv-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.logo-cv {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 2px solid purple;
  background-position: center;
}

/* New prizes grid layout */
.prizes-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.prize-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
}

.prize-circle {
  width: 80px;
  height: 80px;
  border: 2px solid purple;
  border-radius: 50%;
  background: white;
  background-position: center;
  margin-bottom: 8px;
}

.prize-description {
  margin-top: 10px;
  font-weight: bold;
}

/* Loading and error styling */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  text-align: center;
  padding: 1rem;
}

.loading-container p,
.error-container p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 8px 16px;
  background-color: #ff4c9b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #e03a84;
}
</style>
