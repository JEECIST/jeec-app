<template>
  <div class="prizes-page">
    <div class="prizes-content">
      <!-- Selector -->
      <div class="select-prizes">
        <button :class="{ activeBtn: daily }" @click="selectDaily">Daily</button>
        <button :class="{ activeBtn: jeecpot }" @click="selectJeecpot">JEECPOT</button>
      </div>

      <!-- DAILY -->
      <div class="selected-prizes" v-if="daily">
        <h2>SOLO PRIZES</h2>
        <div class="display-prizes">
          <Carousel :ref="carousels.dailySolo" :items-to-show="3" :wrap-around="true" snap-align="center"
            class="custom-carousel">
            <Slide v-for="(prize, index) in daily_solo_prizes" :key="prize.day" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('dailySolo', index)">
                <h3>{{ prize.day }}</h3>
                <div class="img-div">
                  <img :src="'data:image/png;base64,' + prize.image_url" alt="Prize Image" />
                </div>
                <p>{{ prize.name }}</p>
              </div>
            </Slide>
          </Carousel>
        </div>

        <h2>ACTIVITIES PRIZES</h2>
        <div class="display-prizes">
          <Carousel :ref="carousels.dailyAct" :items-to-show="3" :wrap-around="true" snap-align="center"
            class="custom-carousel">
            <Slide v-for="(prize, index) in daily_activities_prizes" :key="prize.activity" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('dailyAct', index)">
                <h3>{{ prize.activity }}</h3>
                <div class="img-div">
                  <img :src="'data:image/png;base64,' + prize.image_url" alt="Prize Image" />
                </div>
                <p>{{ prize.name }}</p>
              </div>
            </Slide>
          </Carousel>
        </div>
      </div>

      <!-- JEECPOT -->
      <div class="selected-prizes" v-if="jeecpot">
        <h2>SOLO PRIZES</h2>
        <div class="display-prizes">
          <Carousel :ref="carousels.jeecpotSolo" :items-to-show="3" :modelValue="1" :wrap-around="true"
            snap-align="center" class="custom-carousel">
            <Slide v-for="(prize, index) in jeecpot_solo_prizes" :key="prize.rank" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('jeecpotSolo', index)">
                <h3>{{ prize.rank }}</h3>
                <div class="img-div">
                  <img :src="'data:image/png;base64,' + prize.image_url" alt="Prize Image" />
                </div>
                <p>{{ prize.name }}</p>
              </div>
            </Slide>
          </Carousel>
        </div>

        <h2>SQUAD PRIZES</h2>
        <div class="display-prizes">
          <Carousel :ref="carousels.jeecpotSquad" :items-to-show="3" :modelValue="1" :wrap-around="true"
            snap-align="center" class="custom-carousel">
            <Slide v-for="(prize, index) in jeecpot_squad_prizes" :key="prize.rank" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('jeecpotSquad', index)">
                <h3>{{ prize.rank }}</h3>
                <div class="img-div">
                  <img :src="'data:image/png;base64,' + prize.image_url" alt="Prize Image" />
                </div>
                <p>{{ prize.name }}</p>
              </div>
            </Slide>
          </Carousel>
        </div>

        <h2>CV PRIZE</h2>
        <div class="display-prizes">
          <Carousel :ref="carousels.jeecpot" :items-to-show="1" :modelValue="0" :wrap-around="true" snap-align="center"
            class="custom-carousel">
            <Slide v-for="(prize, index) in cv_prize" :key="prize.rank" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('jeecpot', index)">
                <h3></h3>
                <div class="img-div">
                  <img :src="'data:image/png;base64,' + prize.image_url" alt="Prize Image" />
                </div>
                <p>{{ prize.name }}</p>
              </div>
            </Slide>
          </Carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import axios from 'axios'
import authHeader from '@/services/auth-header'

const daily = ref(true)
const jeecpot = ref(false)

const carousels = {
  dailySolo: ref(null),
  dailyAct: ref(null),
  jeecpot: ref(null),
  jeecpotSolo: ref(null),
  jeecpotSquad: ref(null)
}

const goTo = (type, index) => {
  carousels[type].value?.slideTo(index)
}

const selectDaily = () => {
  daily.value = true
  jeecpot.value = false
}

const selectJeecpot = () => {
  daily.value = false
  jeecpot.value = true
}

const daily_solo_prizes = ref([])
const daily_activities_prizes = ref([])
const jeecpot_solo_prizes = ref([])
const jeecpot_squad_prizes = ref([])
const cv_prize = ref([])

async function fetchPrizes() {
  const response = await axios.get(
    import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/app-get-prizes',
    {
      headers: authHeader()
    },
  )

  console.log(response.data)

  daily_solo_prizes.value = response.data.Daily;
  daily_solo_prizes.value[0].day = 'Monday'
  daily_solo_prizes.value[1].day = 'Tuesday'
  daily_solo_prizes.value[2].day = 'Wednesday'

  daily_activities_prizes.value = response.data.Activity;
  daily_activities_prizes.value[0].activity = 'Activity 1'
  daily_activities_prizes.value[1].activity = 'Activity 2'
  daily_activities_prizes.value[2].activity = 'Activity 3'
  daily_activities_prizes.value[3].activity = 'Activity 4'

  jeecpot_solo_prizes.value = response.data.Individual;
  jeecpot_solo_prizes.value[0].rank = '1st Place'
  jeecpot_solo_prizes.value[1].rank = '2nd Place'
  jeecpot_solo_prizes.value[2].rank = '3rd Place'

  let temp = jeecpot_solo_prizes.value[0];
  jeecpot_solo_prizes.value[0] = jeecpot_solo_prizes.value[1];
  jeecpot_solo_prizes.value[1] = temp;

  jeecpot_squad_prizes.value = response.data.Squad;
  jeecpot_squad_prizes.value[0].rank = '1st Place'
  jeecpot_squad_prizes.value[1].rank = '2nd Place'
  jeecpot_squad_prizes.value[2].rank = '3rd Place'

  temp = jeecpot_squad_prizes.value[0];
  jeecpot_squad_prizes.value[0] = jeecpot_squad_prizes.value[1];
  jeecpot_squad_prizes.value[1] = temp;

  cv_prize.value = response.data.CV;
}

onMounted(() => {
  fetchPrizes()
})

</script>

<style scoped>
.prizes-page {
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(circle at center, #001a1f, #000814);
  display: flex;
  justify-content: center;
}

.prizes-content {
  width: 100%;
  max-width: 600px;
  padding: 40px 20px 200px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.select-prizes {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
}

.select-prizes button:first-child {
  border-radius: 25px 0 0 25px;
  border-top: 2px solid #038B87;
  border-left: 2px solid #038B87;
}

.select-prizes button:last-child {
  border-radius: 0 25px 25px 0;
  border-top: 2px solid #B8A1FF;
  border-right: 2px solid #B8A1FF;
}

.select-prizes button {
  padding: 12px 30px;
  font-size: 16px;
  width: 98%;
  border: none;
  cursor: pointer;
  background: transparent;
  color: #aaa;
  transition: all 0.3s ease;
}

.select-prizes button:first-child.activeBtn {
  background: #038B87;
}

.select-prizes button:last-child.activeBtn {
  background: #B8A1FF;
}

.selected-prizes {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  overflow: visible;
}

.display-prizes {
  width: 100%;
  overflow: visible;
  z-index: 0;
}

h2 {
  color: #B8A1FF;
  letter-spacing: 4px;
  text-shadow: 0 0 15px rgba(179, 136, 255, 0.7);
}

.custom-carousel {
  overflow: visible;
}


.prize-card {
  transform: scale(0.8);
  transition: all 0.5s ease;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0px 20px;
  opacity: 0.1;
}

.prize-card.active {
  transform: scale(1);
  opacity: 1;
  z-index: 10;
  /* o central fica à frente */
}

.prize-card .img-div {
  width: 150px;
  height: 150px;
  border-radius: 25px;
  background: rgba(0, 255, 255, 0.05);
  border: 2px solid #1e90ff;
  box-shadow: 0 0 20px 2px #1e90ff;
  transition: all 0.5s ease;
  margin-top: 10px;
  padding: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.prize-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.prize-card p {
  margin-top: 15px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  width: 100%;
  text-align: center;
  height: 2.5rem;
}

.prize-card h3 {
  font-size: 18px;
  color: #ccc;
}
</style>
