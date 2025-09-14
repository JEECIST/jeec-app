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
        <p
          v-if="other_rankingdata[1].name != identity"
          :id="'podium-text-other'"
          class="podium-text"
        >
          {{ other_rankingdata[1].name }}
        </p>
        <p v-else :id="'podium-text-you'" class="podium-text">{{ identity }}</p>
        <div :id="'pilar-2'" class="pilar">
          <span :id="'number-2'" class="number">2</span><sup :id="'super-2'" class="super">nd</sup>
        </div>
        <div :id="'student_xp-podium'" class="student_xp">{{ other_rankingdata[1].points }} xp</div>
        <div :id="'line-silver'" class="line"></div>
      </div>
      <div
        :id="'stand-1'"
        class="stand radient-border-passthrough"
        v-if="other_rankingdata.length > 0"
      >
        <div class="img-wrapper radient-border-passthrough">
          <img :src="ProcessImg(other_rankingdata[0].photo, type)" class="podium-img" />
        </div>
        <p
          v-if="other_rankingdata[0].name != identity"
          :id="'podium-text-other'"
          class="podium-text"
        >
          {{ other_rankingdata[0].name }}
        </p>
        <p v-else :id="'podium-text-you'" class="podium-text">{{ identity }}</p>
        <div :id="'pilar-1'" class="pilar">
          <span :id="'number-1'" class="number">1</span><sup :id="'super-1'" class="super">st</sup>
        </div>
        <div :id="'student_xp-podium'" class="student_xp">{{ other_rankingdata[0].points }} xp</div>
        <div :id="'line-gold'" class="line"></div>
      </div>
      <div
        :id="'stand-3'"
        class="stand radient-border-passthrough"
        v-if="other_rankingdata.length > 2"
      >
        <div class="img-wrapper radient-border-passthrough">
          <img :src="ProcessImg(other_rankingdata[2].photo, type)" class="podium-img" />
        </div>
        <p
          v-if="other_rankingdata[2].name != identity"
          :id="'podium-text-other'"
          class="podium-text"
        >
          {{ other_rankingdata[2].name }}
        </p>
        <p v-else :id="'podium-text-you'" class="podium-text">{{ identity }}</p>
        <div :id="'pilar-3'" class="pilar">
          <span :id="'number-3'" class="number">3</span><sup :id="'super-3'" class="super">rd</sup>
        </div>
        <div :id="'student_xp-podium'" class="student_xp">{{ other_rankingdata[2].points }} xp</div>
        <div :id="'line-bronze'" class="line"></div>
      </div>
    </div>
  </div>

  <Transition name="show" appear>
    <div class="show-transition" v-if="show">
      <div v-for="index in other_rankingdata.length - 3" :key="index">
        <div class="center">
          <div class="top_10 radient-border-passthrough">
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
              <p>{{ other_rankingdata[index + 2].points }} xp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <div class="center">
    <Transition name="show-you" appear>
      <div v-if="!show && flag" class="top_10 radient-border-passthrough show-you-transition">
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
          <p>{{ user_points }} xp</p>
        </div>
      </div>
    </Transition>
  </div>

  <div class="center">
    <div @click="show = !show" class="dropdown radient-border-passthrough">
      <div><img :src="arrow" class="arrow" :class="{ open: show }" /></div>
    </div>
  </div>
</template>

<script>
import arrow from '../assets/chevron-compact-down.svg'

export default {
  name: 'Rank',
  data: function () {
    return {
      show: false,
      arrow: arrow,
      Image: Image,
    }
  },
  props: {
    other_rankingdata: Object,
    user_ranking: Number,
    user_points: Number,
    identity: String,
    flag: Boolean,
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
  height: 45px;
  display: flex;
  font-family: 'Lexend Exa';
  color: white;
  position: relative;
  --border-radius: 0;
  --border-width: 0 0 2px 0;
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
  font-size: 100%;
  font-weight: 600;
  letter-spacing: 0.4vw;
  color: #4cc9f0;
  text-shadow: 0px 0px 15px #4cc9f0;
}

.student_name {
  display: flex;
  flex: 1;
  justify-content: start;
  align-items: center;
  align-self: center;
  height: 50%;
  font-family: 'Lexend Exa';
  font-size: 100%;
  font-weight: 600;
  letter-spacing: 0.4vw;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.student_ranking_number {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: 35px;
  height: 35px;
  font-size: 60%;
  font-weight: 800;
  border-radius: 100%;
}

#student_ranking_number-other {
  border: #39250e 2px solid;
  background-color: #6d3f0b;
}

#student_ranking_number-1 {
  background-color: #c1a875;
  border: #ddc695 2px solid;
}

#student_ranking_number-2 {
  background-color: #a8a8a8;
  border: #c4c2c2 2px solid;
}

#student_ranking_number-3 {
  background-color: #c9705c;
  border: #e18a77 2px solid;
}

.student_xp {
  display: flex;
  justify-content: start;
  align-items: center;
  text-align: center;
  font-family: 'Lexend Exa';
  font-size: 80%;
  font-weight: 600;
  width: 20%;
}

#student_xp-podium {
  width: 100%;
  justify-content: center;
  height: 35px;
  position: absolute;
  bottom: 0px;
}

.dropdown {
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
}

.box {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 15%;
  margin-left: 4%;
}

.line {
  width: 100%;
  height: 3px;
  bottom: 0px;
  position: absolute;
}

.line::before {
  content: '';
  position: absolute;
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

.line::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(339deg, rgba(255, 255, 255, 0) 52.79%, #fff 95.95%);
  mix-blend-mode: overlay;
}

#line-gold {
  background-color: #c1a875;
}

#line-silver {
  background-color: #a8a8a8;
}

#line-bronze {
  background-color: #c9705c;
}

.number {
  position: relative;
  font-family: 'Russo One';
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.number::before {
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

.number::after {
  content: '';
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(339deg, rgba(255, 255, 255, 0) 52.79%, #fff 95.95%);
  mix-blend-mode: overlay;
}

#number-1 {
  background-color: #c1a875;
}

#number-2 {
  background-color: #a8a8a8;
}

#number-3 {
  background-color: #c9705c;
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
  width: 90%;
  max-width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: end;
}

.pilar {
  text-align: center;
  color: white;
  width: 100%;
  height: 85px;
}

#pilar-1 {
  font-size: 3rem;
}

#pilar-2 {
  font-size: 2.5rem;
}

#pilar-3 {
  font-size: 2rem;
}

.podium-text {
  padding-top: 10px;
  text-align: center;
  font-family: 'Lexend Exa';
  font-size: 0.9rem;
  height: 3rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

#podium-text-other {
  color: var(--Greyish-White, #e7e7e7);
}

#podium-text-you {
  color: #4cc9f0;
  text-shadow: 0px 0px 5px #4cc9f0;
}

.img-wrapper {
  --border-radius: 50%;
  overflow: hidden;
  width: 60%;
  aspect-ratio: 1;
  margin: 0 auto;
}

.img-wrapper::before {
  content: '';
}

.podium-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stand {
  width: 32.5%;
  --border-radius: 0;
  --background: radial-gradient(ellipse 100% 100% at 50% 100%, #4ccaf03e, #4ccaf021 45%, #4ccaf000);
}

#stand-1 {
  height: 115%;
}

#stand-2 {
  height: 105%;
}

#stand-3 {
  height: 95%;
}
</style>
