<template>
  <div :class="[variant, { 'radient-border-passthrough': variant != 'nav' }]" class="user-card">
    <div class="help-info" v-if="variant == 'home'">
      <router-link to="/help">
        <img src="@/assets/help-info.svg" aria-hidden="true" />
      </router-link>
    </div>
    <div class="name-wrapper" v-if="variant != 'home'">
      <p>{{ userStore.user.name }}</p>
      <p v-if="variant == 'profile'" class="username">{{ userStore.user.username }}</p>
    </div>
    <div class="qr-wrapper" v-if="variant == 'home'">
      <QrCodeButton></QrCodeButton>
    </div>
    <div class="tickets-wrapper">
      <CurrentPoints :variant="variant"></CurrentPoints>
    </div>
    <div class="points-wrapper">
      <JEECPOT :variant="variant"></JEECPOT>
    </div>
    <div class="user-wrapper">
      <UserImage :image="userStore.user.picture" :variant="variant"></UserImage>
    </div>
    <div class="text-points-wrapper" v-if="variant == 'profile'">
      <p>Total Points: {{ userStore.userPoints.total_points }}</p>
      <p>JEECPOT Chances: {{ userStore.userPoints.jeecpot }}</p>
    </div>
  </div>
</template>
<script setup>
import QrCodeButton from './QrCodeButton.vue'
import CurrentPoints from './CurrentPoints.vue'
import JEECPOT from './JEECPOT.vue'
import UserImage from './UserImage.vue'

import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

import { defineProps } from 'vue'

const props = defineProps({
  variant: {
    default: 'nav',
  },
})
</script>
<style scoped>
.help-info {
  position: absolute;
  bottom: calc(var(--height));
  padding: 5px;
  z-index: 50;
}
.help-info a {
  display: block; /* Ensure the link takes up the full area */
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px); /* Apply blur effect directly to the image */
  -webkit-backdrop-filter: blur(10px); /* Add webkit prefix for Safari support */
  background: rgba(25, 156, 255, 0.1);
  border-radius: 50%; /* Ensure the background has 50% border radius */
}

.help-info img {
  display: block; /* Ensure the image doesn't interfere with the layout */
}

.user-card.home {
  --background: #199cff1a;
  --border-background: #199cff;
  --height: 80px;

  --border-radius: 45px;
  --border-width: 1.5px;

  grid-template-areas:
    'qr tickets user'
    'qr points user';
  grid-template-rows: min-content 1fr;
  grid-template-columns: var(--height) 1fr var(--height);
  position: fixed;
  bottom: 10px;
  width: calc(100% - 20px);
  right: 10px;
  height: var(--height);
  max-width: 450px;
  z-index: 50;
  backdrop-filter: blur(10px);
  /* Note: backdrop-filter has minimal browser support */
  -webkit-backdrop-filter: blur(10px);
  border-radius: 43px;
  justify-content: center;
  box-sizing: border-box; /* Include padding in the element's dimensions */
}

.user-card.home::before {
  content: '';
}

.user-card.home > .qr-wrapper {
  padding: 5px;
}

.user-card.home > .tickets-wrapper {
  padding-right: 5px;
}

.user-card.home > .points-wrapper {
  padding-right: 5px;
}

.user-card.home > .user-wrapper {
  padding: 5px;
}

.user-card.nav {
  /* layout like the screenshot: name left, logo/user right, then pill, then bar */
  grid-template-areas:
    "name user"
    "tickets tickets"
    "points points";
  grid-template-rows: min-content min-content min-content;
  grid-template-columns: 1fr 80px;
  width: 100%;
  height: auto;
  padding: 14px 16px;
  gap: 10px;

}

.user-card.nav > .name-wrapper {
  align-self: center;
}

.user-card.nav > .name-wrapper p {
  font-family: "Lexend Exa";
  font-size: 1.6rem;
  padding: 0;
  margin: 0;
  color: white;
}

.user-card.nav > .user-wrapper {
  justify-self: end;
  align-self: start;
  padding: 0; /* the screenshot logo is tight to the corner */
}
.user-card.nav > .tickets-wrapper :deep(*), .points-wrapper :deep(*) {
  justify-content: flex-start !important;
}

.user-card.nav > .qr-wrapper {
  padding: 17px;
}

.user-card.nav > .tickets-wrapper,
.user-card.nav > .points-wrapper {
  padding: 0;
  margin: 0;
  width: 100%;
  justify-content: flex-start;
}

.user-card.nav > .user-wrapper {
  padding: 8px;
}

.user-card.profile {
  --border-radius: 45px;
  --border-width: 2px;

  grid-template-areas:
    'name user'
    'tickets user'
    'points points'
    'tpoints tpoints';
  grid-template-rows: min-content min-content min-content 1fr;
  grid-template-columns: 1fr min-content;

  padding: 1rem 0 1rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

@media screen and (max-width: 600px) {
  .user-card.profile {
    grid-template-areas:
      'name user'
      'tickets tickets'
      'points points'
      'tpoints tpoints';
  }
  .user-card.profile > .tickets-wrapper {
    margin-right: 3rem !important;
  }
}

.user-card.profile::before {
  content: '';
}

.user-card.profile > .name-wrapper {
  height: 100%;
}

.user-card.profile > .name-wrapper p:first-child {
  font-family: 'Lexend Exa';
  letter-spacing: 2px;
  font-size: clamp(1.2rem, 6vw, 2rem);
  text-align: start;
  padding-right: 2ch;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.user-card.profile > .name-wrapper .username {
  font-size: clamp(0.9rem, 4vw, 1.1rem);
  text-align: left;
  padding-left: 0.3rem;
  color: #1a9cd8;
  padding-bottom: 0.5rem;
}

.user-card.profile > .tickets-wrapper {
  margin-right: 2rem;
  margin-bottom: 0.5rem;
}

.user-card.profile > .user-wrapper {
  position: relative;
  margin-right: 1rem;
  width: max-content;
  aspect-ratio: 1;
  max-width: calc(100% - 1rem);
  display: flex;
}

.user-card.profile > .points-wrapper {
  margin-right: 3rem;
  margin-bottom: 0.2rem;
}

.user-card.profile > .text-points-wrapper p {
  padding-top: 0.3rem;
  font-family: 'Lexend Exa';
  letter-spacing: 1px;
  padding-left: 1ch;
  font-size: clamp(1rem, 4.5vw, 1.2rem);
}

.user-card {
  display: grid;
}

.name-wrapper {
  grid-area: name;
  text-align: left;
}

.qr-wrapper {
  grid-area: qr;
}

.tickets-wrapper {
  grid-area: tickets;
}

.points-wrapper {
  grid-area: points;
}

.user-wrapper {
  grid-area: user;
}

.text-points-wrapper {
  grid-area: tpoints;
}

@media screen and (max-width: 850px) {
  .user-card.home {
    left: 50%;
    translate: -50% 0;
  }
}
</style>
