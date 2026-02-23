<template>
  <div class="center">
    <div class="podium">
      <div
        :id="'stand-2'"
        class="stand radient-border-passthrough"
        v-if="other_rankingdata.length > 1"
      >
        <div class="img-wrapper radient-border-passthrough">
          <img :src="ProcessImg(other_rankingdata[1].photo, type)" class="podium-img" />
        </div>
        <p class="place">2nd place</p>
        <p
          v-if="other_rankingdata[1].name != identity"
          :id="'podium-text-other'"
          class="podium-text"
        >
          {{ other_rankingdata[1].name }}
        </p>
        <p v-else :id="'podium-text-you'" class="podium-text">{{ identity }}</p>
        <div class="podium_xp">
          <span>{{ other_rankingdata[1].points }}</span>
          <img :src="duck" class="xp-duck" />
        </div>
      </div>
      <div
        :id="'stand-1'"
        class="stand radient-border-passthrough"
        v-if="other_rankingdata.length > 0"
      >
        <div class="img-wrapper radient-border-passthrough">
          <img :src="ProcessImg(other_rankingdata[0].photo, type)" class="podium-img" />
        </div>
        <p class="place">1st place</p>
        <p
          v-if="other_rankingdata[0].name != identity"
          :id="'podium-text-other'"
          class="podium-text"
        >
          {{ other_rankingdata[0].name }}
        </p>
        <p v-else :id="'podium-text-you'" class="podium-text">{{ identity }}</p>
        <div class="podium_xp">
          <span>{{ other_rankingdata[0].points }}</span>
          <img :src="duck" class="xp-duck" />
        </div>
      </div>
      <div
        :id="'stand-3'"
        class="stand radient-border-passthrough"
        v-if="other_rankingdata.length > 2"
      >
        <div class="img-wrapper radient-border-passthrough">
          <img :src="ProcessImg(other_rankingdata[2].photo, type)" class="podium-img" />
        </div>
        <p class="place">3rd place</p>
        <p
          v-if="other_rankingdata[2].name != identity"
          :id="'podium-text-other'"
          class="podium-text"
        >
          {{ other_rankingdata[2].name }}
        </p>
        <p v-else :id="'podium-text-you'" class="podium-text">{{ identity }}</p>
        <div class="podium_xp">
          <span>{{ other_rankingdata[2].points }}</span>
          <img :src="duck" class="xp-duck" />
        </div>
      </div>
    </div>
  </div>

  <Transition name="show" appear>
    <div class="show-transition" v-if="show">
      <div v-for="index in other_rankingdata.length - 3" :key="index">
        <div class="center">
          <div class="top_10">
            <div class="box">
              <div :id="'student_ranking_number-other'" class="student_ranking_number">
                <p>{{ index + 3 }}th</p>
              </div>
            </div>

            <div v-if="other_rankingdata[index + 2].name != identity" class="student_name">
              <p>{{ other_rankingdata[index + 2].name }}</p>
            </div>

            <div v-else class="you_name">
              <p>{{ identity }}</p>
            </div>

            <div class="student_xp">
              <span>{{ other_rankingdata[index + 2].points }}</span>
              <img :src="duck" class="xp-duck" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <div class="center">
    <Transition name="show-you" appear>
      <div v-if="!show && flag" class="top_10 show-you-transition">
        <div class="box">
          <div
            v-if="user_ranking > 3"
            :id="'student_ranking_number-other'"
            class="student_ranking_number"
          >
            <p v-if="user_ranking % 10 == 1">{{ user_ranking }}st</p>
            <p v-if="user_ranking % 10 == 2">{{ user_ranking }}nd</p>
            <p v-if="user_ranking % 10 == 3">{{ user_ranking }}rd</p>
            <p v-if="user_ranking % 10 > 3 || user_ranking % 10 == 0">{{ user_ranking }}th</p>
          </div>
          <div v-else :id="'student_ranking_number-' + user_ranking" class="student_ranking_number">
            <p v-if="user_ranking == 1">{{ user_ranking }}st</p>
            <p v-if="user_ranking == 2">{{ user_ranking }}nd</p>
            <p v-if="user_ranking == 3">{{ user_ranking }}rd</p>
            <p v-if="user_ranking > 3 || user_ranking == 0">{{ user_ranking }}th</p>
          </div>
        </div>

        <div class="you_name">
          <p>{{ identity }}</p>
        </div>

        <div class="student_xp">
          <span>{{ user_points }}</span>
          <img :src="duck" class="xp-duck" />
        </div>
      </div>
    </Transition>
  </div>

  <div class="center">
    <div v-if="extend" @click="show = !show" class="dropdown">
      <div><img :src="arrow" class="arrow" :class="{ open: show }" /></div>
    </div>
  </div>
</template>

<script>
import arrow from '../assets/chevron-compact-down.svg'
import duck from '../assets/icons/flash_home_white.svg'

export default {
  name: 'Rank',
  data: function () {
    return {
      show: false,
      arrow: arrow,
      duck: duck,
      Image: Image,
    }
  },
  props: {
    other_rankingdata: Object,
    user_ranking: Number,
    user_points: Number,
    identity: String,
    flag: Boolean,
    extend: Boolean,
    type: String,
  },
  computed: {},
  methods: {
    ProcessImg(image, type) {
      if (type == 'Student') {
        let photo = 'data:image/png;base64,' + image
        return photo
      } else {
        let photo = import.meta.env.VITE_APP_JEEC_BRAIN_URL + image
        return photo
      }
    },
  },
}
</script>

<style scoped>
:root {
  --color-dark: #1f1f1f;
}

.show-you-transition {
  max-height: 45px;
  overflow: hidden;
}

.show-you-enter-active {
  transition: all 1s ease;
}

.show-you-leave-active {
  transition: all 0.5s ease;
}

.show-you-enter-from,
.show-you-leave-to {
  max-height: 0;
}

.show-transition {
  max-height: 500px;
  overflow: hidden;
}

.show-enter-active,
.show-leave-active {
  transition: all 1s ease;
}

.show-enter-from,
.show-leave-to {
  max-height: 0;
}

.arrow {
  width: 70%;
  transform: rotateX(0deg);
  transition: 1s;
}

.arrow.open {
  transform: rotateX(180deg);
  transition: 1s;
}

.center {
  display: flex;
  justify-content: center;
}

.top_10 {
  width: 90%;
  max-width: 500px;
  height: 30px;
  display: flex;
  font-family: 'Lexend Exa';
  color: white;
  position: relative;
  border: 2px solid rgba(25,155,255, 0.5);
  border-radius: 15px;
  margin-top: 4px;
}

.top_10::before {
  content: '';
}

.you_name {
  display: flex;
  flex: 1;
  justify-content: start;
  align-items: center;
  align-self: center;
  height: 50%;
  font-family: 'Lexend Exa';
  font-size: 80%;
  font-weight: 600;
  letter-spacing: 2px;
  color: #8eadcc;
}

.student_name {
  display: flex;
  flex: 1;
  justify-content: start;
  align-items: center;
  align-self: center;
  height: 60%;
  font-family: 'Lexend Exa';
  font-size: 80%;
  font-weight: 600;
  letter-spacing: 2px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #8eadcc;
}

.student_ranking_number {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: 35px;
  height: 35px;
  font-size: 70%;
  font-weight: 600;
}

#student_ranking_number-other {
  color: #8eadcc;
}

#student_ranking_number-1 {
  color: #c1a875;
}

#student_ranking_number-2 {
  color: #a8a8a8;
}

#student_ranking_number-3 {
  color: #c9705c;
}

.student_xp {
  display: flex;
  justify-content: end;
  align-items: center;
  text-align: center;
  gap: 2px;
  font-family: 'Lexend Exa';
  font-size: 70%;
  font-weight: 600;
  min-width: 20%;
  padding-right: 10px;
}

#student_xp-podium {
  width: 100%;
  justify-content: center;
  height: 35px;
}

/* .dropdown {
  width: 40%;
  max-width: 200px;
  height: 3.5vh;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  --border-radius: 0px 0px 10vw 10vw;
  --border-width: 0 0 2px 0;
}

.dropdown::before {
  content: '';
} */

.box {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 15%;
  margin-left: 4%;
}


.super {
  text-align: center;
  font-family: 'Russo One';
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 45px;
  top: -0.9em;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.super::before {
  content: '';
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    77deg,
    #576265 11.6%,
    #9ea1a1 25.31%,
    #848b8a 48.06%,
    #576265 55.72%,
    #576265 77.23%,
    #757a7b 85.34%,
    #576265 91.31%
  );
  mix-blend-mode: luminosity;
}

.super::after {
  content: '';
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(339deg, rgba(255, 255, 255, 0) 52.79%, #fff 95.95%);
  mix-blend-mode: overlay;
}

#super-1 {
  background-color: #c1a875;
}

#super-2 {
  background-color: #a8a8a8;
}

#super-3 {
  background-color: #c9705c;
}

.podium {
  width: 95%;
  max-width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 5px;
  margin-top: 30px;
}

.podium-text {
  text-align: center;
  font-family: 'Lexend Exa';
  font-size: 0.7rem;
  font-weight: 200;
  margin: 20px 0 0 0; /* pequena margem entre nome e XP */
}

#podium-text-other {
  color: var(--Greyish-White, #e7e7e7);
}

#podium-text-you {
  color: #4cc9f0;
  text-shadow: 0px 0px 5px #4cc9f0;
}

.img-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  --border-radius: 50%;
  overflow: hidden;
  width: 50%;
  aspect-ratio: 1;
}

.img-wrapper::before {
  content: '';
}

.img-wrapper.radient-border-passthrough {
  --_border-background: var(--color-jeec-blue); /* borda sólida */
  --_border-width: 2px;
}

.podium-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.place {
  width: 100%;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%); /* centraliza vertical e horizontal */
  font-size: 1rem;
  text-align: center;
  letter-spacing: 0.1rem;
  font-weight: 100;
}

.podium_xp {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: 'Lexend Exa';
  font-size: 0.7rem;
  text-align: center;
  margin: 2px 0 5px 0; /* distância do fundo do stand */
  gap: 2px;
}

.xp-duck {
  height: 20px;     
  width: auto;     
  object-fit: contain;
}

.stand {
  position: relative;
  width: 32.5%;
  border: 2px solid rgb(173, 216, 230);
  box-shadow: 5px -5px 20px #5c81d3; /* from figma*/
  border-radius: 25px;
  background: #1c2b45; /*from figma*/

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end; /* nome e XP ficam no fundo */
  padding-top: 30%; /* espaço para a imagem no topo */
  height: 150px;
}


#stand-1 {
  height: 100%;
}

#stand-2 {
  height: 80%;
}

#stand-3 {
  height: 70%;
}
</style>
