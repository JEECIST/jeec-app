<template>
  <div class="prizes-page">
    <div class="background" v-if="showPopup">
      <div class="prize-info-popup">
        <h1>{{ prize_name }}</h1>
        <p>{{ prize_description }}</p>
        <button class="close-btn" @click="showPopup = false">&times;</button>
      </div>
    </div>
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
          <Carousel :ref="carousels.dailySolo" v-model="currentSlides.dailySolo" :items-to-show="3" :wrap-around="true" snap-align="center"
            class="custom-carousel">
            <Slide v-for="(prize, index) in daily_solo_prizes" :key="prize.day" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('dailySolo', index)">
                <h3>{{ prize.day }}</h3>
                <div class="img-div" id="daily-img-div">
                  <img :src="'data:image/png;base64,' + prize.image_url" alt="Prize Image" />
                </div>
                <p>{{ prize.name }}</p>
              </div>
            </Slide>
          </Carousel>
        </div>

        <h2>ACTIVITIES PRIZES</h2>
        <div class="display-prizes">
          <Carousel :ref="carousels.dailyAct" v-model="currentSlides.dailyAct" :items-to-show="3" :wrap-around="true" snap-align="center"
            class="custom-carousel">
            <Slide v-for="(prize, index) in daily_activities_prizes" :key="prize.activity" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('dailyAct', index)">
                <h3></h3>
                <div class="img-div" id="activities-img-div">
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
          <Carousel :ref="carousels.jeecpotSolo" v-model="currentSlides.jeecpotSolo" :items-to-show="3" :wrap-around="true"
            snap-align="center" class="custom-carousel">
            <Slide v-for="(prize, index) in jeecpot_solo_prizes" :key="prize.rank" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('jeecpotSolo', index)">
                <h3>{{ prize.rank }}</h3>
                <div class="img-div" id="solo-img-div">
                  <img :src="'data:image/png;base64,' + prize.image_url" alt="Prize Image" />
                </div>
                <p>{{ prize.name }}</p>
              </div>
            </Slide>
          </Carousel>
        </div>

        <h2>SQUAD PRIZES</h2>
        <div class="display-prizes">
          <Carousel :ref="carousels.jeecpotSquad" v-model="currentSlides.jeecpotSquad" :items-to-show="3" :wrap-around="true"
            snap-align="center" class="custom-carousel">
            <Slide v-for="(prize, index) in jeecpot_squad_prizes" :key="prize.rank" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('jeecpotSquad', index)">
                <h3>{{ prize.rank }}</h3>
                <div class="img-div" id="squad-img-div">
                  <img :src="'data:image/png;base64,' + prize.image_url" alt="Prize Image" />
                </div>
                <p>{{ prize.name }}</p>
              </div>
            </Slide>
          </Carousel>
        </div>

        <h2>CV PRIZE</h2>
        <div class="display-prizes">
          <Carousel :ref="carousels.cv" v-model="currentSlides.cv" :items-to-show="1" :wrap-around="true"
            snap-align="center" class="custom-carousel">
            <Slide v-for="(prize, index) in cv_prize" :key="prize.rank" v-slot="{ isActive }">
              <div class="prize-card" :class="{ active: isActive }" @click="goTo('cv', index)">
                <h3></h3>
                <div class="img-div" id="cv-img-div">
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

const showPopup = ref(false)
const prize_name = ref('Teste')
const prize_description = ref('O sol poente pintava o horizonte com tons de âmbar e violeta, enquanto a brisa fresca soprava entre as árvores antigas. No silêncio da montanha, cada passo ressoava como um segredo partilhado com a terra. O tempo parecia parar, permitindo que a mente divagasse por caminhos nunca antes explorados.')


const carousels = {
  dailySolo: ref(null),
  dailyAct: ref(null),
  jeecpotSolo: ref(null),
  jeecpotSquad: ref(null),
    cv: ref(null)
}

const currentSlides = ref({
  dailySolo: 0,
  dailyAct: 0,
  jeecpotSolo: 1,
  jeecpotSquad: 1,
  cv: 0,
})

const goTo = (type, index) => {
  // O valor atual está agora na nossa variável reativa!
  const currentActiveIndex = currentSlides.value[type];

  console.log("Slide Atual:", currentActiveIndex, "Index Clicado:", index);

  if (currentActiveIndex === index) {
    // Abrir popup
    const prizeList = {
      dailySolo: daily_solo_prizes,
      dailyAct: daily_activities_prizes,
      jeecpotSolo: jeecpot_solo_prizes,
      jeecpotSquad: jeecpot_squad_prizes,
      cv: cv_prize
    };

    const selected = prizeList[type].value[index];
    if (selected) {
      prize_name.value = selected.name;
      showPopup.value = true;
    }
  } else {
    // Se não for o atual, o v-model atualiza-se sozinho se usares slideTo
    carousels[type].value?.slideTo(index);
  }
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

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7); /* Escurece o fundo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99; /* Um abaixo do popup */
  backdrop-filter: blur(5px); /* Efeito de desfoque luxuoso */
}

.prize-info-popup {
  position: relative; /* Mudado de fixed para relative porque o pai já é fixed */
  background: #000814;
  border: 2px solid #1e90ff;
  box-shadow: 0 0 20px 2px #1e90ff;
  border-radius: 25px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.prize-info-popup h1 {
  color: #1e90ff;
  margin-bottom: 20px;
}

.prize-info-popup p {
  color: #ccc;
  font-size: 14px;
  line-height: 1.5;
}

.close-btn {
position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: #1e90ff;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  transition: color 0.3s ease, transform 0.2s ease;
}

.close-btn:hover {
color: #B8A1FF;
  transform: scale(1.2);
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
  max-width: 200px;
  max-height: 200px;

  width: 33vw;
  height: 33vw;

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

#activities-img-div {
  border-color: #B8A1FF;
  box-shadow: 0 0 20px 2px #B8A1FF;
}

#squad-img-div {
  border-color: #00ffff;
  box-shadow: 0 0 20px 2px #00ffff;
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

  /* font-size: 3vw; 
  font-size: clamp(12px, 3vw, 18px);
  height: 3.2rem; */

  height: 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prize-card h3 {
  color: #ccc;
  text-align: center;
    white-space: nowrap;
}
</style>
