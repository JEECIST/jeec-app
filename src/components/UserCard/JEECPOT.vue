<template>
  <div class="wrapper" :class="variant">
    <div class="points radient-border-passthrough">
      <div
        class="progress radient-border-passthrough_child"
        :style="'--progress:' + test + '%;'"
      ></div>
      <div
        class="progress-fill"
        :style="{
          '--progress': test + '%',
        }"
      ></div>
      <p v-if="test >= 100" class="points-total">Eligible!</p>
      <p v-else class="points-total">{{ test }}%</p>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, defineProps, onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const props = defineProps(['variant'])

const progress = ref(0)
const test = 40

function getProgress() {
  const userTotalPoints = userStore.userPoints.total_points

  const milestone = userStore.milestones.total

  const progressPercentage = (userTotalPoints / milestone) * 100

  if (isNaN(progressPercentage)) {
    progress.value = 0
  } else if (progressPercentage > 100) {
    progress.value = 100
  } else {
    progress.value = Math.round(progressPercentage)
  }
}

watch(
  () => userStore.userPoints,
  () => {
    if (userStore.milestones.total != 0) {
      getProgress()
    } else {
      setTimeout(() => {
        getProgress()
      }, 2000)
    }
  },
)

onMounted(() => {
  getProgress()
})
</script>
<style scoped>
.wrapper {
  font-family: 'Lexend Exa';
  width: 100%;
  /* height: 100%; */
  text-align: left;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: auto;
  gap: 3px;
}
.wrapper.profile {
  text-align: left;
}
.wrapper.nav > p {
  font-size: 1.4rem;
}
.wrapper.profile > p {
  font-size: clamp(1rem, 4.5vw, 1.2rem);
  padding-bottom: 0.1rem;
}
p {
  font-family: 'Lexend Exa';
  font-size: 0.6rem;
  /* Your JEECPOT chances */
  font-style: normal;
  font-weight: 300;
  text-align: right;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.9);
  margin-right: 2px;
}
.chances {
  font-family: 'Lexend Exa';
  font-size: 0.8rem;
  /* Your JEECPOT chances */
  font-style: normal;
  font-weight: lighter;
  text-align: right;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.9);
  margin-right: 2px;
}
.wrapper.profile > .points {
  height: 23px;
}

.points {
  width: 90%;
  height: 25px;
  overflow: hidden;

  position: relative;
  border-radius: 999px;

  background:
    linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.10) 100%),
    rgba(10, 18, 28, 0.55);

  --border-width: 0px;

  border: 1px solid rgba(255, 255, 255, 0.22);

  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.35),          
    inset 0 1px 0 rgba(255, 255, 255, 0.18),  
    inset 0 -1px 0 rgba(0, 0, 0, 0.35),       
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);

  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.points::after {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  top: 3px;
  height: 40%;
  border-radius: 999px;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.00)
  );

  pointer-events: none;
}

.progress {
  overflow: hidden;
}
.progress-fill {
  width: calc(var(--border-width) + var(--progress)) !important;
  height: calc(100% - var(--border-width));
  background-color: var(--color-jeec-blue);
  transition: width 0.3s ease-in-out;
  border-radius: 999px;
}

.points-total {
  position: absolute;
  top: 50%;
  left: 10px;         
  right: auto;        
  transform: translateY(-50%);
  z-index: 2;
  padding: 0;
  margin: 0;
}
</style>
