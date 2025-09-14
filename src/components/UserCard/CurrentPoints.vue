<template>
  <div class="wrapper" :class="variant">
    <div class="tickets-progress radient-border-passthrough">
      <div class="progress radient-border-passthrough_child"></div>
      <div class="tickets">
        <p>{{ userDailyPoints }}</p>
        <img src="@/assets/icons/flash_home.svg" aria-hidden="true" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, defineProps, nextTick } from 'vue'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const props = defineProps(['variant'])

const userDailyPoints = ref(0)

async function getProgress() {
  if (userStore.userPoints.current_points == undefined) {
    userDailyPoints.value = 0
  } else {
    userDailyPoints.value = userStore.userPoints.current_points
  }

  // const milestones = userStore.milestones.daily.sort(function(a, b) { return a - b; });
  // const milestonesMod = [0].concat(milestones); //[0, 50, 550, 1100]

  // const progressPercentage = (userDailyPoints / milestones[milestones.length - 1]) * 100;

  // if (progressPercentage >= 100) {
  //   progress.value = 100;
  // } else {
  //   progress.value = progressPercentage;
  // }

  // let milestonePercentage = 0;
  // let width = 0;

  // await nextTick();

  // for (let index = 0; index < milestones.length; index++) {
  //   if (index == milestones.length - 1) {
  //     milestonePercentage = 100;
  //     width = 0;
  //   } else {
  //     milestonePercentage = (milestones[index] / milestones[milestones.length - 1]) * 100;
  //     width = milestonePercentage - ((milestonesMod[index] / milestones[milestones.length - 1]) * 100);
  //   }

  //   if (progressPercentage >= milestonePercentage) {
  //     milestonesRef.value[index].classList.add("obtained");
  //   }

  //   milestonePercentages.value.push(width.toString());
  // }
}

watch(
  () => userStore.userPoints,
  () => {
    getProgress()
  },
)
</script>
<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  margin-top: 7px;
  display: flex;
  justify-content: flex-end;
}
.img {
  width: 40px;
  height: 380%;
  object-fit: contain;
}
.bar {
  text-align: right;
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  height: 100%;
}
.wrapper.profile > .bar {
  text-align: left;
}
.wrapper.nav > .bar > p {
  font-size: 1.4rem;
}
.wrapper.profile > .bar > p {
  font-size: clamp(1rem, 4.5vw, 1.2rem);
  padding-bottom: 0.1rem;
}
p {
  font-family: 'Lexend Exa';
  font-size: 0.95rem;
}
.wrapper.profile .tickets-progress {
  height: 23px;
}
.tickets-progress {
  max-width: 80%;
  height: 25px;
  position: relative;
  background: linear-gradient(0deg, rgba(25, 156, 255, 0.1), rgba(25, 156, 255, 0.1)), #1f1f1f;
  --border-background: #199cff;
  --border-width: 1.5px;
  --border-radius: 50px;
}

.progress {
  background-size: 200%;
  align-content: center;
  justify-content: center;
  display: flex;
}
.tickets {
  padding: 3px 8px 0px 12px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  gap: 5px;
}

.wrapper.profile .tickets img {
  height: 140%;
}
.tickets img {
  height: 90%;
  object-fit: contain;
}

p {
  font-family: 'Lexend Exa';
  font-size: 0.95rem;
  color: var(--color-font);
  overflow: hidden;
}
</style>
