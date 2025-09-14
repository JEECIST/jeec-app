<template>
  <div class="CV" :style="{ '--background': '#199CFF1A', '--border-background': '#199CFF' }">
    <div class="CV-container">
      <h2>CV Draw</h2>
      <div class="body">
        <p>
          {{ text }}
        </p>
        <div class="Cv-icon">
          <router-link
            to="/profile"
            :class="{ pressed: isPressed }"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            <img class="image" :src="icon" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import cv_button_img from '@/assets/cv_button_img.svg'

const text = ref('Still didn’t add your CV? Pass by our check in to win a surprise reward.')
const icon = ref(cv_button_img)

const isPressed = ref(false)

const onTouchStart = () => (isPressed.value = true)
const onTouchEnd = () => setTimeout(() => (isPressed.value = false), 100)
</script>

<style scoped>
.CV-container {
  padding: 0.5rem 0 0.5rem 0;
}

.CV-container h2 {
  font-size: clamp(1.4rem, 3.1vw, 1.8rem);
  /* CV DRAW */

  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  font-family: 'Lexend Exa';
  text-transform: uppercase;
}

.body {
  display: flex;
  flex-direction: row;
  align-content: center;
  gap: 1rem;
  justify-content: center;
  padding: 0 0.5rem 0 0.5rem;
}

.body p {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: start;
  justify-self: center;
  font-family: 'Lexend Exa';
  font-size: clamp(0.8rem, 3.4vw, 1.2rem);
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 10px;
}

.Cv-icon {
  width: 15ch;
  max-width: 70px;
  position: relative;
  align-self: center;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #199cff;
  border-radius: 30%;
}

.Cv-icon::before {
  content: '';
}

.Cv-icon .image {
  height: 70%;
  object-position: center;
}

.pressed {
  transform: scale(1.1);
  opacity: 0.8;
}
</style>
