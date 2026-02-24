<template>
  <div :class="[variant, { 'radient-border-passthrough': variant != 'nav' && variant != 'home' }]" class="user-card">
    <div class="name-wrapper" v-if="variant != 'profile'">
      <p>{{ userStore.user.name }}</p>
    </div>

    <div class="name-wrapper" v-else>
      <p>{{ userStore.user.name }}</p>
      <p class="username">{{ userStore.user.username }}</p>
    </div>

    <router-link v-if="variant === 'home'" class="logo-wrapper" to="/home" aria-label="Go to Home">
      <img alt="JEEC" class="jeec-logo" src="@/assets/jeec_horizontal_mobile_white.svg" />
    </router-link>

    <div class="tickets-wrapper">
      <CurrentPoints :variant="variant"></CurrentPoints>
    </div>

    <div class="points-wrapper">
      <JEECPOT :variant="variant"></JEECPOT>
    </div>

    <button v-if="variant === 'home'" class="notif-wrapper" type="button" aria-label="Notifications"
      :aria-expanded="stateStore.notificationsOpen" aria-controls="notifications-drawer" @click="openNotifications">
      <span class="notif-dot" :class="{
        green: stateStore.notificationsSubscribed === true,
        red: stateStore.notificationsSubscribed === false,
      }" aria-hidden="true"></span>
      <svg class="notif-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 1 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2Z"
          fill="currentColor" />
      </svg>
    </button>

    <NotificationsDrawer v-if="variant === 'home'" />

    <div class="notif-wrapper" v-else>
      <UserImage :image="userStore.user.picture" :variant="variant"></UserImage>
    </div>

    <div class="text-points-wrapper" v-if="variant == 'profile'">
      <p>Total Points: {{ userStore.userPoints.total_points }}</p>
      <p>JEECPOT Chances: {{ userStore.userPoints.jeecpot }}</p>
    </div>
  </div>
</template>

<script setup>
import NotificationsDrawer from '../NotificationsDrawer.vue'
import CurrentPoints from './CurrentPoints.vue'
import JEECPOT from './JEECPOT.vue'
import UserImage from './UserImage.vue'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import { useStateStore } from '@/stores/StateStore'
const stateStore = useStateStore()
const userStore = useUserStore()

import { defineProps } from 'vue'

import UserService from '../../services/user.service'

onMounted(() => {
  stateStore.refreshNotificationSubscription()
})

async function openNotifications() {
  stateStore.notificationsOpen = true

  let isSubscribed = false
  try {
    const { data } = await UserService.getIsSubscribed()
    isSubscribed = !!data?.subscribed
  } catch (e) {
    isSubscribed = false
  }

  stateStore.notificationsSubscribed = isSubscribed
}

defineProps({
  variant: {
    default: 'home',
  },
})
</script>

<style scoped>
.user-card.home {
  height: 12rem;

  position: relative;
  top: auto;
  right: auto;
  bottom: auto;

  width: 100%;
  max-width: none;

  z-index: auto;

  border-radius: 18px;
  display: grid;
  grid-template-areas:
    "name  logo"
    "tickets notif"
    "points notif";

  grid-template-columns: 1fr 96px;
  grid-template-rows: 42px auto auto;
  align-content: flex-start;
  padding: 30px;

  box-sizing: border-box;
  gap: 0px 10px;
}

.user-card.home>.name-wrapper {
  grid-area: name;
  text-align: left;
  align-self: start;
  justify-self: start;
}

.user-card.home>.name-wrapper p {
  font-family: "Lexend Exa";
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 1.5rem;
  line-height: 1.1;
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logo-wrapper {
  grid-area: logo;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  align-self: start;
  justify-self: end;
}

.jeec-logo {
  height: 1.7rem;
  width: auto;
  display: block;
  object-fit: contain;
}

.logo-text {
  font-family: "Lexend Exa";
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1;
  white-space: nowrap;
}

.logo-accent {
  color: #1a9cd8;
}

.user-card.home>.tickets-wrapper {
  grid-area: tickets;
  display: flex;
  align-items: center;
  align-self: center;
  justify-self: start;
  margin: 0;
  padding: 0;
}

.user-card.home>.tickets-wrapper :deep(*) {
  border-radius: 999px;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.user-card.home>.points-wrapper {
  grid-area: points;
  display: flex;
  align-items: center;
  padding-right: 0;
  align-self: start;
  justify-self: start;
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
  width: 100%;
  max-width: none;
}

.user-card.home>.points-wrapper :deep(*) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.notif-wrapper {
  grid-area: notif;
  grid-row: 2 / 4;
  align-self: center;
  justify-self: end;
  margin: 0;
  margin-top: 30px;
  background: transparent;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: transparent;
  box-shadow:
    inset 2px 2px 4px rgba(255, 255, 255, 0.40),
    /* top-left mais forte */
    inset -2px -2px 4px rgba(255, 255, 255, 0.25),
    /* bottom-right */
    inset 1px 1px 2px rgba(0, 0, 0, 0.15),
    /* cantos restantes mais suave */
    inset -1px -1px 2px rgba(0, 0, 0, 0.1);
  display: grid;
  place-items: center;

  position: relative;
  cursor: pointer;

}

.notif-icon {
  width: 26px;
  height: 26px;
}

.notif-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #33e08a;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.35);
}

.notif-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  height: 10px;
  border-radius: 999px;

  background: #ff3b3b;
  /* default quando ainda não sabes */
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.35);
}

.notif-dot.green {
  background: #33e08a;
}

.notif-dot.red {
  background: #ff3b3b;
}

@media screen and (max-width: 850px) {
  .user-card.home {
    left: 50%;
    translate: -50% 0;
  }
}
</style>
