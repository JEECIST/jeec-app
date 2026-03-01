<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import authHeader from '../services/auth-header'
import { useUserStore } from '@/stores/UserStore'
import UserService from '../services/user.service'
// PONTOS CARALHO atualizar

const userStore = useUserStore()
const hasTicket = ref(true)
const items = ref([])
const loading = ref(true)
const error = ref(null)
const showPopup = ref(false)
const selectedPrize = ref(null)
const dailyPrize = ref(null)
const dailyPrizeLoading = ref(true)
const dailyPrizeError = ref(null)

// Add new ref for insufficient points popup
const showInsufficientPointsPopup = ref(false)

// Add new ref for ticket popup
const showTicketPopup = ref(false)

const prizeTicket = {
  name: 'Ticket Diário',
  description:
    'A ticket for the daily prize draw. Enter for a chance to win the daily prize shown!',
  price: 500,
}

const fetchPrizes = async () => {
  loading.value = true
  error.value = null

  try {
    const username = userStore.user?.username
    const response = await axios.get(
      import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/get-prizes-shop',
      {
        params: { username: username },
        headers: authHeader(),
      },
    )
    // Transform the data and filter out any prize named "Ticket"
    items.value = response.data
      .filter((prize) => prize.name !== prizeTicket.name)
      .map((prize) => ({
        id: prize.id,
        name: prize.name || 'No prize',
        description: prize.description || 'No description available',
        // Make sure we're correctly formatting the base64 image
        imageData: prize.imageData ? `data:image/*;base64,${prize.imageData}` : null,
        price: prize.price || 500,
        bought: prize.bought || false,
      }))
  } catch (err) {
    console.error('Failed to fetch prizes:', err)
    error.value = 'Failed to load prizes. Please try again later.'
    items.value = []
  } finally {
    loading.value = false
  }
}

// const fetchDailyPrize = async () => {
//   dailyPrizeLoading.value = true
//   dailyPrizeError.value = null

//   try {
//     const response = await axios.get(
//       import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/get-daily-prize',
//       {
//         headers: authHeader(),
//       },
//     )

//     if (response.data && response.data.length > 0) {
//       const prize = response.data[0]
//       dailyPrize.value = {
//         id: prize.id,
//         name: prize.name || 'No prize',
//         imageData: prize.imageData ? `data:image/*;base64,${prize.imageData}` : null,
//       }
//     } else {
//       dailyPrize.value = null
//     }
//   } catch (err) {
//     console.error('Failed to fetch daily prize:', err)
//     dailyPrizeError.value = 'Failed to load daily prize. Please try again later.'
//     dailyPrize.value = null
//   } finally {
//     dailyPrizeLoading.value = false
//   }

//   UserService.getDailyTicket().then(
//     (response) => {
//       hasTicket.value = response.data
//     },
//     (error) => {
//
//     },
//   )
// }

// const retryFetchDailyPrize = () => {
//   fetchDailyPrize()
// }

const openPrizePopup = (prize) => {
  selectedPrize.value = prize
  showPopup.value = true
}

// New function to open ticket popup
const openTicketPopup = () => {
  showTicketPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

// New function to close ticket popup
const closeTicketPopup = () => {
  showTicketPopup.value = false
}

// Add new function to close insufficient points popup
const closeInsufficientPointsPopup = () => {
  showInsufficientPointsPopup.value = false
}

const buyPrize = async (prize) => {
  // Check if user has enough points
  // if (userStore.userPoints.current_points < prize.price / 2) {
  if (userStore.userPoints.current_points < prize.price) {
    showInsufficientPointsPopup.value = true
    showPopup.value = false
    return
  }

  try {
    const username = userStore.user.username
    const response = await axios.post(
      import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/buy-prize',
      {
        prize_id: prize.id,
        username: username,
        prizeName: null,
      },
      {
        headers: authHeader(),
      },
    )

    const item = items.value.find((item) => item.id === prize.id)
    if (item) {
      item.bought = true
    }
    userStore.userPoints.current_points = response.data[0].current_points
    closePopup()
  } catch (err) {
    console.error('Purchase failed:', err)
    alert('Failed to purchase the prize. You can only buy one of these per day.')
  }
}

// New function to buy a ticket
// const buyDailyTicket = async () => {
//   // Check if user has enough points
//   if (userStore.userPoints.current_points < prizeTicket.price / 2) {
//     showInsufficientPointsPopup.value = true
//     showTicketPopup.value = false
//     return
//   }

//   try {
//     const username = userStore.user.username
//     const response = await axios.post(
//       import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/buy-prize',
//       {
//         username: username,
//         prize_id: null,
//         prizeName: prizeTicket.name,
//       },
//       {
//         headers: authHeader(),
//       },
//     )

//     // Update user points
//     userStore.userPoints.current_points = response.data[0].current_points
//     hasTicket.value = true
//     closeTicketPopup()
//     // You might want to show a success message or take other actions
//     alert('You have successfully purchased a ticket for the daily draw!')
//   } catch (err) {
//     console.error('Ticket purchase failed:', err)
//     alert('Failed to purchase the ticket. Please try again.')
//   }
// }

onMounted(() => {
  fetchPrizes()
  // fetchDailyPrize()
})
</script>

<template>
  <div class="view">
    <!-- FALTA VER A LOGICA DO BOUGHT :TODO -->
    <!-- SECTION DOS PARAGRAFOS
    <section class="info-section">
      <p>Earn points by participating in JEEC!</p>
      <p>
        Visit companies at the job fair or take part in Eletrolink to collect points. Use your
        points to redeem prizes below!
      </p>
      <p class="small">(maximum of one of each type per day)</p>
    </section> -->

    <!-- SECTION DO BUY DOS TICKETS PARA O DAILY DRAW
    <section class="ticket-section">
      <div class="daily-ticket-container">
        Loading state for daily prize
        <div v-if="dailyPrizeLoading" class="daily-prize-circle loading-circle">
          <div class="loading-spinner-small"></div>
        </div>

        Error state for daily prize
        <div
          v-else-if="dailyPrizeError"
          class="daily-prize-circle error-circle"
          @click="retryFetchDailyPrize"
        >
          <span class="error-icon">!</span>
        </div>

        Daily prize display when loaded
        <div v-else class="daily-prize-circle">
          <img
            v-if="dailyPrize?.imageData"
            :src="dailyPrize.imageData"
            alt="Daily Prize"
            class="daily-prize-image"
          />
          <div v-else class="no-image-placeholder">?</div>
        </div>

        <a v-if="!hasTicket" href="#" class="ticket-link" @click.prevent="openTicketPopup">
          <div class="ticket-content">
            <img
              src="@/assets/Ticket-Vector.svg"
              alt="Ticket image"
              style="height: 40px; width: 40px"
            />
            <div id="btn-ticket">
              <p>Daily Draw</p>
              <p>Ticket</p>
              <div class="item-price">
                <p class="coin">500</p>
                <img src="@/assets/icons/flash_home.svg" alt="credit" />
              </div>
              <div class="item-price">
                <p class="coin-new">250</p>
                <img src="@/assets/icons/flash_home.svg" alt="credit" />
              </div>
            </div>
          </div>
        </a>
        <a v-if="hasTicket" href="#" class="ticket-link disabled">
          <div class="ticket-content">
            <img
              src="@/assets/Ticket-Vector.svg"
              alt="Ticket image"
              style="height: 40px; width: 40px"
            />
            <div id="btn-ticket">
              <p>Daily Draw</p>
              <p>Ticket</p>
              <div class="item-price">
                <p class="coin">500</p>
                <img src="@/assets/icons/flash_home.svg" alt="credit" />
              </div>
              <div class="item-price">
                <p class="coin-new">250</p>
                <img src="@/assets/icons/flash_home.svg" alt="credit" />
              </div>
            </div>
          </div>
        </a>
      </div>
    </section> -->

    <!-- SECTION PARA COMPRAREM OS PRIZES DA SHOP  -->
    <section class="shop-section">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading prizes...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button class="retry-button" @click="fetchPrizes">Retry</button>
      </div>

      <div v-else-if="items.length === 0" class="empty-container">
        <p>No prizes available at the moment.</p>
      </div>

      <div v-else class="shop-container">
        <div v-for="item in items" :key="item.id" class="circle-container"
          @click="!item.bought && openPrizePopup(item)">
          <div :class="['circle', { bought: item.bought }]">
            <img v-if="item.imageData" :src="item.imageData" :alt="item.name" class="prize-image" />
            <div v-else class="no-image-placeholder">?</div>
          </div>
          <div class="price">
            <!-- Discount hidden
            <div class="item-price" v-if="!item.bought">
              <p class="coin">{{ item.price }}</p>
              <img src="@/assets/icons/flash_home.svg" alt="credits" />
            </div>
            <div class="item-price" v-if="!item.bought">
              <p class="coin-new">{{ item.price / 2 }}</p>
              <img src="@/assets/icons/flash_home.svg" alt="credits" />
            </div>
            -->
            <div class="item-price" v-if="!item.bought">
              <p style="display: inline-flex; align-items: center; gap: 0.2ch">{{ item.price }}</p>
              <img src="@/assets/icons/flash_home.svg" alt="credits" />
            </div>
            <span v-else class="bought-text">Bought</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Prize Popup -->
    <div v-if="showPopup && selectedPrize" class="qrcode-wrapper">
      <div class="qrcode-backdrop" @click="closePopup"></div>

      <div class="qrcode-card">
        <button class="close-popup-btn" @click="closePopup" aria-label="Close prize popup">
          <div></div>
          <div></div>
        </button>

        <h2>{{ selectedPrize.name }}</h2>

        <div class="scan invisible-scan">
          <div class="prize-circle full-square">
            <img v-if="selectedPrize.imageData" :src="selectedPrize.imageData" :alt="selectedPrize.name"
              class="popup-prize-image" />
            <div v-else class="no-image-placeholder">?</div>
          </div>
        </div>

        <p class="prize-description">{{ selectedPrize.description }}</p>

        <button class="prize-buy-button" @click="buyPrize(selectedPrize)" :disabled="selectedPrize.bought">
          <span class="buy-text">BUY PRIZE</span>
          <!-- <span class="price-text">{{ selectedPrize.price / 2 }}</span> -->
          <span class="price-text">{{ selectedPrize.price }}</span>
          <img src="@/assets/icons/flash_home_white.svg" alt="credits" class="button-icon" />
        </button>
      </div>
    </div>


    <!-- Ticket Popup -->
    <div v-if="showTicketPopup" class="popup-overlay">
      <div class="prize-popup">
        <div class="popup-header">
          <h2>Daily Draw Ticket</h2>
          <button class="close-button" @click="closeTicketPopup">✕</button>
        </div>
        <div class="popup-body">
          <div class="prize-circle ticket-circle">
            <img src="@/assets/Ticket-Vector.svg" alt="Ticket" class="popup-prize-image ticket-image-popup" />
          </div>
          <p class="prize-description">
            Purchase a ticket for the daily prize draw. You could win the prize displayed next to
            the ticket!
          </p>
          <button class="buy-button" @click="buyDailyTicket">
            <div class="item-price">
              BUY TICKET
              <p class="price-tag coin-new">250</p>
              <img src="@/assets/icons/flash_home_white.svg" alt="credits" class="white" />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Insufficient Points Popup -->
    <div v-if="showInsufficientPointsPopup" class="qrcode-wrapper">
      <div class="qrcode-backdrop" @click="closeInsufficientPointsPopup"></div>

      <div class="qrcode-card">
        <button class="close-popup-btn" @click="closeInsufficientPointsPopup" aria-label="Close popup">
          <div></div>
          <div></div>
        </button>

        <h2>Insufficient Points</h2>

        <div class="scan invisible-scan">
          <div class="prize-circle full-square">
            <img src="@/assets/sad-shuba-shuba.gif" alt="Sad Duck" class="popup-prize-image" />
          </div>
        </div>

        <p class="insufficient-points-message">
          You don't have enough points to buy this prize.
        </p>

        <button class="ok-button" @click="closeInsufficientPointsPopup">OK, GOT IT!</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view {
  padding-top: var(--header-height);
  --acc-color: var(--c-acc-violet);
  min-height: 100vh;
  position: relative;
  font-family: Arial, sans-serif;
}

.coin {
  display: inline-flex;
  align-items: center;
  gap: 0.2ch;
  text-decoration: line-through;
}

.coin-new {
  display: inline-flex;
  align-items: center;
  gap: 0.2ch;
  color: var(--c-acc-yellow);
}

.daily-prize-circle {
  width: 80px;
  height: 80px;
  border: 2px solid var(--c-acc-violet);
  border-radius: 50%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.daily-prize-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 768px) {
  .daily-prize-circle {
    width: 80px;
    height: 80px;
  }
}

#btn-ticket {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ticket-image {
  max-width: 80px;
  margin-left: 12px;
  border-radius: 4px;
}

.ticket-image-popup {
  max-width: 60px;
  max-height: 60px;
}

.ticket-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

#btn-ticket>p {
  font-size: 0.8rem;
}

.info-section {
  text-align: center;
  color: white;
  padding: 20px;
}

.info-section p {
  margin: 8px 0;
}

.info-section .small {
  font-size: 0.8rem;
  color: gray;
  margin-top: 8px;
}

.ticket-section {
  display: flex;
  justify-content: center;
  margin: 10px 0 20px;
}

.daily-ticket-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ticket-link {
  background: var(--c-acc-violet);
  padding: 10px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
}

.ticket-link.disabled {
  pointer-events: none;
  opacity: 0.5;
  background: grey;
  cursor: not-allowed;
}

.ticket-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.shop-section {
  padding: 10px;
  padding-bottom: 200px;
}

.shop-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
  padding: 10px;
}

.circle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  cursor: pointer;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: none;
  background: rgba(184, 161, 255, 0.21);
  box-shadow: 0 -8px 20px 4px rgba(184, 161, 255, 0.9);
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.circle.bought {
  background: rgba(184, 161, 255, 0.12);
  box-shadow: 0 -8px 20px 4px rgba(184, 161, 255, 0.4);
  filter: brightness(0.7);
}

.prize-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price {
  margin-top: 8px;
  color: white;
  font-size: 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
}

.bought-text {
  color: grey;
}

/* Loading styles for daily prize */
.loading-circle {
  background: rgba(255, 255, 255, 0.7);
}

.loading-spinner-small {
  border: 3px solid rgba(156, 39, 176, 0.2);
  border-radius: 50%;
  border-top: 3px solid #9c27b0;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

/* Error styles for daily prize */
.error-circle {
  background: #ffebee;
  cursor: pointer;
}

.error-icon {
  color: #f44336;
  font-size: 24px;
  font-weight: bold;
}

/* No image placeholder */
.no-image-placeholder {
  color: #9c27b0;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: #f5f5f5;
}

/* Popup Styles */
.qrcode-wrapper {
  position: fixed;
  z-index: 200;
  inset: 0;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  overscroll-behavior: contain;
}

.qrcode-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
}

.qrcode-card {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  width: min(92vw, 520px);
  padding: 22px 22px 26px;
  border-radius: 34px;

  background: linear-gradient(180deg,
      rgba(8, 14, 22, 0.96) 0%,
      rgba(5, 10, 16, 0.96) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid #b8a1ff;
  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.65),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: white;
}

.qrcode-card>.close-popup-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  opacity: 0.9;
}

.qrcode-card>.close-popup-btn:hover {
  opacity: 1;
  transform: scale(1.05);
}

.qrcode-card>.close-popup-btn>div {
  height: 3px;
  width: 70%;
  background-color: rgba(255, 255, 255, 0.9);
  position: absolute;
  border-radius: 3px;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}

.qrcode-card>.close-popup-btn>div:first-child {
  rotate: 45deg;
}

.qrcode-card>.close-popup-btn>div:last-child {
  rotate: -45deg;
}

.qrcode-card>h2 {
  width: 100%;
  margin: 0;
  padding: 18px 52px 0 32px;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
}

.scan {
  width: min(320px, 74vw);
  aspect-ratio: 1;
  margin: 0;
  display: grid;
  place-items: center;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.prize-circle {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-prize-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prize-description {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.prize-buy-button {
  margin-top: 12px;
  padding: 12px 20px;
  width: 80%;
  max-width: 260px;
  border-radius: 999px;
  border: none;
  background-color: #b8a1ff;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.prize-buy-button .buy-text {
  font-weight: 800;
  letter-spacing: 0.05em;
}

.prize-buy-button .price-text {
  font-weight: 800;
  color: #ffca28;
  /* Yellow/Gold color for price */
}

.prize-buy-button .button-icon {
  width: 27px;
  height: 27px;
}

/* Loading and error states */
.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: white;
  text-align: center;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #9c27b0;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.retry-button {
  background-color: #9c27b0;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  margin-top: 16px;
  cursor: pointer;
}


.buy-button:disabled {
  background-color: grey;
  cursor: not-allowed;
}

.price-tag {
  margin-left: 8px;
}

/* Insufficient Points Popup Styles */
.full-square {
  border-radius: 0;
  width: 100%;
  height: 100%;
}

.invisible-scan {
  background: none;
  border: none;
  box-shadow: none;
}

.insufficient-points-message {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  padding: 0 10px;
}



.ok-button {
  background-color: #b8a1ff;
  color: white;
  border: none;
  border-radius: 999px;
  /* Rounded pill shape */
  padding: 12px 24px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  width: 80%;
  max-width: 260px;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s ease;
}

.ok-button:active {
  transform: scale(0.98);
}

.item-price {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
}

.item-price img {
  height: auto;
  color: white;
  max-height: 20px;
  justify-content: center;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .shop-container {
    max-width: 890px;
    margin: 0 auto;
  }

  .circle-container {
    width: 110px;
  }

  .circle {
    width: 90px;
    height: 90px;
  }
}

@media (min-width: 1024px) {
  .qrcode-card {
    width: 420px;
    display: flex;
    flex-direction: column;
    padding: 30px;
    align-items: center;
    text-align: center;
    gap: 16px;
  }

  .scan {
    width: 220px;
    margin: 0 auto;
  }

  .qrcode-card>h2 {
    font-size: 2rem;
    margin-bottom: 5px;
    text-align: center;
    padding: 10px 0;
  }

  .prize-description,
  .insufficient-points-message {
    text-align: center;
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .prize-buy-button,
  .ok-button {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
