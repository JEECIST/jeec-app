<template>
  <div class="desktop" v-if="!isMobile">
    <div class="view">
      <section class="tabs">
        <div v-for="(day, index) in days" :key="index" class="tab" :class="{ active: activeDay === index }"
          @click="setActiveDay(index)">
          {{ day.label }}
        </div>
      </section>
      <transition name="fade" mode="out-in">
        <img :src="dayy.image" :alt="dayy.label" />
      </transition>
    </div>
  </div>

  <div class="mobile" v-else>
    <div class="view">
      <section class="tabs-container">
        <div class="tabs-wrapper">
          <div class="tabs" :style="tabsStyle">
            <div v-for="(day, index) in days" :key="index" class="tab" :class="{ active: activeDay === index }"
              @click="setActiveDay(index)">
              {{ day.label }}
            </div>
          </div>
        </div>
        <button class="nav-button prev" @click="scrollPrev" :disabled="activeDay === 0">
          &lt;
        </button>
        <button class="nav-button next" @click="scrollNext" :disabled="activeDay === days.length - 1">
          &gt;
        </button>
      </section>
      <transition name="fade" mode="out-in">
        <img :src="dayy.image" :alt="dayy.label" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

const isMobile = ref(false)
const tabWidth = ref(250)
const tabsStyle = ref({ transform: 'translateX(0)' })

const dayy = computed(() => days.value[activeDay.value])

const activeDay = ref(0)
const expandedEvent = ref(null)

const days = ref([
  { label: 'MONDAY', image: new URL('@/assets/Planta05.png', import.meta.url).href },
  { label: 'TUESDAY', image: new URL('@/assets/Planta06.png', import.meta.url).href },
  { label: 'WEDNESDAY', image: new URL('@/assets/Planta07.png', import.meta.url).href },
])

const event_days = ['2026-03-02', '2026-03-03', '2026-03-04']

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 800
  scrollToTab(activeDay.value)
}

// Scroll para a tab ativa
function scrollToTab(index) {
  if (!isMobile.value) return

  const containerWidth = window.innerWidth
  const tabCenterPosition = index * tabWidth.value + tabWidth.value / 2
  const containerCenter = containerWidth / 2
  const offset = containerCenter - tabCenterPosition + index * 42

  tabsStyle.value = {
    transform: `translateX(${offset}px)`,
    transition: 'transform 0.3s ease-in-out',
  }
}

function scrollPrev() {
  if (activeDay.value > 0) {
    setActiveDay(activeDay.value - 1)
  }
}

function scrollNext() {
  if (activeDay.value < days.length - 1) {
    setActiveDay(activeDay.value + 1)
  }
}

// Mudar o dia ativo
function setActiveDay(index) {
  activeDay.value = index
  expandedEvent.value = null

  scrollToTab(index)
}

// Dia atual como padrão
function setDefaultDay() {
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  const index = event_days.findIndex((day) => day === todayString)
  activeDay.value = index !== -1 ? index : 0
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)

  setTimeout(() => {
    scrollToTab(activeDay.value)
  }, 100)

  setDefaultDay()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
.view {
  padding-top: var(--header-height);
  --acc-color: var(--c-acc-strong-pink);
}

img {
  max-width: 1200px;
  width: 90%;
  height: 100%;
  margin: 0 auto;
  display: block;
}

h1 {
  text-align: center;
  text-shadow: 0px 0px 15px var(--acc-color);
  margin: 2rem auto;
  position: relative;
  width: 100%;
  padding-right: 5%;
  padding-left: 5%;
}

.tabs {
  position: relative;
  display: flex;
  justify-content: center;
  overflow: auto;
  gap: 10px;
  padding: 20px;
  width: 100%;
  top: -10px;
}

.tab {
  text-align: center;
  padding-top: 15px;
  padding-bottom: 15px;
  letter-spacing: 0.1em;
  overflow: auto;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  position: relative;
  cursor: pointer;
  width: 200px;
  transition: all 0.3s ease-in-out;
  font-family: var(--font-schedule);
}

.tab:nth-child(1) {
  --tab-color: var(--c-acc-lighter-dark-blue);
}

.tab:nth-child(2) {
  --tab-color: var(--c-acc-violet);
}

.tab:nth-child(3) {
  --tab-color: var(--c-acc-strong-pink);
}

.tab:nth-child(4) {
  --tab-color: var(--c-acc-orange);
}

.tab:nth-child(5) {
  --tab-color: var(--c-acc-yellow);
}

.tab::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
  transition: opacity 0.1s ease-in-out;
  opacity: 0.3;
  background: radial-gradient(ellipse at top center,
      var(--tab-color) 10%,
      rgba(255, 255, 255, 0) 75%);
  z-index: -3;
}

.tab.active {
  opacity: 1;
  transform: scale(1.06);
}

.tab:hover::before {
  opacity: 0.5;
}

.tab.active::before {
  opacity: 0.5;
}

.tab:first-child {
  border-radius: 20px 0 0 0;
}

.tab:last-child {
  border-radius: 0 20px 0 0;
}

.tab:not(:first-child):not(:last-child) {
  border-radius: 0;
}

/* Cores dos dias da semana */
.tab:nth-child(1) {
  border-top: 2px solid var(--c-acc-lighter-dark-blue);
}

.tab:nth-child(2) {
  border-top: 2px solid var(--c-acc-violet);
}

.tab:nth-child(3) {
  border-top: 2px solid var(--c-acc-strong-pink);
}

.tab:nth-child(4) {
  border-top: 2px solid var(--c-acc-orange);
}

.tab:nth-child(5) {
  border-top: 2px solid var(--c-acc-yellow);
}

/* Estilos para o carrossel mobile */
.mobile .tabs-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 10px 0;
  /* Espaço para os botões de navegação */
}

.mobile .tabs-wrapper {
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
}

.mobile .tabs {
  display: flex;
  width: max-content;
  gap: 10px;
  will-change: transform;
}

.mobile .tab {
  text-align: center;
  padding-top: 15px;
  padding-bottom: 15px;
  letter-spacing: 0.1em;
  overflow: auto;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  position: relative;
  cursor: pointer;
  width: 200px;
  transition: all 0.3s ease-in-out;
  opacity: 0.7;
  transform: scale(0.9);
}

.mobile .tab.active {
  opacity: 1;
  transform: scale(1);
}

.mobile .nav-button {
  display: none;
  /* Remove completamente do layout */
}

.mobile .nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.mobile .nav-button.prev {
  left: 10px;
}

.mobile .nav-button.next {
  right: 10px;
}
</style>
