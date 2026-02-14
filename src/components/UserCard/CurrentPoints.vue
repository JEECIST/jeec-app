<template>
  <div class="wrapper" :class="variant">
    <div class="tickets-progress radient-border-passthrough">
      <div class="progress radient-border-passthrough_child"></div>

      <div class="tickets">
        <p class="tickets-value">{{ userDailyPoints }}</p>

        <span class="tickets-icon">
          <img src="@/assets/icons/flash_home.svg" aria-hidden="true" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

defineProps(['variant'])

const userDailyPoints = ref(0)

function getProgress() {
  if (userStore.userPoints.current_points == undefined) {
    userDailyPoints.value = 0
  } else {
    userDailyPoints.value = userStore.userPoints.current_points
  }
}

watch(
  () => userStore.userPoints,
  () => {
    getProgress()
  },
  { immediate: true },
)
</script>

<style scoped>
.wrapper {
  width: 200px;
  height: 70%;
  display: flex;
  justify-content: flex-start;
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

/* pill container */
.tickets-progress {
  max-width: 80%;
  height: 34px;
  position: relative;

  border-radius: 999px;
  overflow: hidden;

  /* glassy background */
  background:
    linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 45%, rgba(0,0,0,0.12) 100%),
    rgba(10, 18, 28, 0.55);

  /* prevent double border from your gradient-border system */
  --border-background: #199cff;
  --border-width: 0px;
  --border-radius: 50px;

  /* subtle transparent border */
  border: 1px solid rgba(255, 255, 255, 0.20);

  /* soft depth */
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.30),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -1px 0 rgba(0, 0, 0, 0.30),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

/* top shine strip */
.tickets-progress::after {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  top: 4px;
  height: 40%;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.00));
  pointer-events: none;
}

.progress {
  background-size: 200%;
  align-content: center;
  justify-content: center;
  display: flex;
}

.tickets {
  padding: 6px 10px 6px 14px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

/* number */
.tickets-value {
  font-family: 'Lexend Exa';
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1;
  white-space: nowrap;
}

/* icon circle */
.tickets-icon {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: grid;
  place-items: center;

  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.10),
    inset 0 -1px 0 rgba(0,0,0,0.25);
}

.tickets-icon img {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

/* profile sizing (keeps your intent) */
.wrapper.profile .tickets-progress {
  height: 34px;
}

/* keep your base p defaults without fighting the new class */
p {
  font-family: 'Lexend Exa';
  color: var(--color-font);
  overflow: hidden;
}
</style>
