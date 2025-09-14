<template>
  <div class="wrapper" :class="variant">
    <p class="chances">JEECPOT chances</p>
    <div class="points radient-border-passthrough">
      <div
        class="progress radient-border-passthrough_child"
        :style="'--progress:' + progress + '%;'"
      ></div>
      <div
        class="progress-fill"
        :style="{
          '--progress': progress + '%',
          ...(progress < 100 && {
            'clip-path': 'polygon(10% 0%, 100% 0%, 100% 100%, 5% 100%)',
          }),
        }"
      ></div>
      <p v-if="progress >= 100" class="points-total">Eligible!</p>
      <p v-else class="points-total">{{ progress }}%</p>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, defineProps, onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const props = defineProps(['variant'])

const progress = ref(0)

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
  text-align: right;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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
  height: 16px;
  overflow: hidden;
  background: linear-gradient(0deg, rgba(25, 156, 255, 0.1), rgba(25, 156, 255, 0.1)), #1f1f1f;
  --border-background: #199cff;
  --border-width: 1.5px;
  --border-radius: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.progress {
  overflow: hidden;
}
.progress-fill {
  width: calc(var(--border-width) + var(--progress)) !important;
  height: calc(100% - var(--border-width));
  background-color: var(--color-jeec-blue);
  transition: width 0.3s ease-in-out;
}

.points-total {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  padding-right: 1ch;
  z-index: 2;
}
</style>
