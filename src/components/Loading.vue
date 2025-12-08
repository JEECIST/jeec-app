<template>
  <transition name="fade">
    <div v-if="isVisible" class="svg-loader-overlay">
      <img :src="svgSrc" alt="loading icon" class="svg-icon" />
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { loaderVisible } from '@/services/loader.service'

const svgSrc = 'src/assets/jeec_mobile_white.svg'

// use centralized loader state
const isVisible = computed(() => loaderVisible.value)
</script>

<style scoped>
/* Overlay covers the full screen */
.svg-loader-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.35); /* semi-transparent dark overlay */
  backdrop-filter: blur(4px); /* smooth blur */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

/* SVG pulse + shake animation */
.svg-icon {
  position: relative;
  width: 80vw;
  height: 80vw;
  animation: pulse-glow 1.4s ease-in-out infinite, shake 0.6s infinite;
  filter: drop-shadow(0 0 15px #199cff);
  transform-origin: center;
}

/* Pulse + glow */
@keyframes pulse-glow {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 12px #199cff);
    opacity: 1;
  }
  50% {
    transform: scale(1.2); /* slightly aggressive pulse */
    filter: drop-shadow(0 0 20px #33b0ff); /* stronger glow */
    opacity: 0.95;
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 12px #199cff);
    opacity: 1;
  }
}

/* Shake */
@keyframes shake {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 1px) rotate(-1deg); }
  75% { transform: translate(1px, 1px) rotate(1deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* Fade in / leave transition */
.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}

/* Blow-up on leave */
.fade-leave-active {
  animation: blow-up 0.5s forwards;
}
.fade-leave-to {
  opacity: 0;
}

/* Blow-up animation */
@keyframes blow-up {
    0% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
        filter: drop-shadow(0 0 15px #199cff);
    }
    50% {
        transform: scale(2) rotate(15deg);
        opacity: 0.1;
        filter: drop-shadow(0 0 25px #33b0ff);
    }
    100% {
        transform: scale(3) rotate(30deg);
        opacity: 0;
        filter: drop-shadow(0 0 30px #33b0ff);
    }
}

/* Stop pulse + shake during blow-up */
.fade-leave-active .svg-icon {
  animation: none;
}
</style>
