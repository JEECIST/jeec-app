<template>
  <div class="view">
    <!-- <h2 style="text-align: center; margin-top: 60px;">Don't worry, the event map is coming soon!</h2> -->
    <TabsSelection :tabs="tabs" :activeTab="activeDay" @tab="setActiveDay">
    </TabsSelection>

    <transition name="fade" mode="out-in">
      <img :src="dayy.image" :alt="dayy.label" :key="activeDay" />
    </transition>
  </div>
  <div style="width: 100%; height: 60px;"></div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import TabsSelection from '@/components/TabsSelection.vue'

const activeDay = ref(0)

const tabs = ref(["Monday", "Tuesday", "Wednesday"])

const days = ref([
  { label: 'MONDAY', image: new URL('@/assets/MondaySchedule.jpeg', import.meta.url).href },
  { label: 'TUESDAY', image: new URL('@/assets/TuesdaySchedule.jpeg', import.meta.url).href },
  { label: 'WEDNESDAY', image: new URL('@/assets/WednesdaySchedule.jpeg', import.meta.url).href },
])

const dayy = computed(() => days.value[activeDay.value])
const event_days = ['2026-03-02', '2026-03-03', '2026-03-04']

function setActiveDay(index) {
  activeDay.value = index
}

function setDefaultDay() {
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]
  const index = event_days.findIndex((day) => day === todayString)
  activeDay.value = index !== -1 ? index : 0
}

onMounted(() => {
  setDefaultDay()
})
</script>

<style scoped>
.view {
  padding-top: var(--header-height);
  --acc-color: var(--c-acc-strong-pink);
}

img {
  max-width: 1200px;
  width: 80%;
  height: 90%;
  margin: 0 auto;
  display: block;
}

/* Your transition classes 
  (Make sure these exist so the fade actually works) 
*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>