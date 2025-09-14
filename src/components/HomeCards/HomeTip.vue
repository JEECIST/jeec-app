<template>
  <div class="home-tip" :style="'--random-hue-1: ' + randomHue1 + ';'">
    <router-link
      v-if="tips[randomTip].link != undefined"
      class="tip-container"
      :to="tips[randomTip].link"
    >
      <p>{{ tips[randomTip].tip }}</p>
      <img v-if="tips[randomTip].image != undefined" :src="tips[randomTip].image" alt="" />
    </router-link>
    <div v-else class="tip-container">
      <p>{{ tips[randomTip].tip }}</p>
      <img v-if="tips[randomTip].image != undefined" :src="tips[randomTip].image" alt="" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import cv_button_img from '@/assets/cv_button_img.svg'
import linkedin_button_img from '@/assets/linkedin_button_img.svg'

const tips = [
  {
    tip: 'Add your CV so companies can get even closer to you! The CV is available to be sumitted thorough the profile. Maybe you will get a surprise bonus',
    image: cv_button_img,
    link: '/profile',
  },
  {
    tip: 'You can submit your linkedIn in the profile page. Who knows what you might get after?',
    image: linkedin_button_img,
    link: '/profile',
  },
  {
    tip: 'Check the help and info page to see how you can gain points and interact with the event!',
    link: '/help',
  },
  {
    tip: 'Show your QRCode at the job fair and at the entrance to the activities to go STONKS 📈📈',
  },
  {
    tip: 'There is in fact a non zero chance of you getting 100k points randomly. Maybe a cosmic ray bitflips some of your data in our server, so keep checking in everyday!',
  },
]

const randomTip = ref(Math.floor(Math.random() * tips.length))
const randomHue1 = ref(Math.floor(Math.random() * 360))
</script>

<style scoped>
.home-tip {
  --background: radial-gradient(
    ellipse 150% 150% at 15% 0%,
    hsla(var(--random-hue-1), 85%, 62%, 0.14) 0%,
    hsla(var(--random-hue-1), 85%, 62%, 0.08) 70%,
    hsla(var(--random-hue-1), 85%, 62%, 0) 100%
  );
  --border-background: linear-gradient(
    165deg,
    hsl(var(--random-hue-1), 91%, 38%),
    hsl(calc(var(--random-hue-1) + 30), 91%, 60%),
    hsl(var(--random-hue-1), 91%, 38%)
  );
}

.tip-container {
  padding: 3rem 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-decoration: none;
  gap: 1ch;
}

.tip-container p {
  max-width: 600px;
}

.tip-container img {
  width: 60px;
  aspect-ratio: 1;
  flex-shrink: 0;
}
</style>
