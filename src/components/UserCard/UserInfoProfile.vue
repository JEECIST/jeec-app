<template>
    <div class="user-card">
        <div class="left-col">
            <div class="name-wrapper">
                <p>{{ userStore.user.name }}</p>
            </div>

            <div class="tickets-wrapper">
                <CurrentPoints :variant="'nav'"></CurrentPoints>
            </div>

            <div class="points-wrapper">
                <JEECPOT :variant="'nav'"></JEECPOT>
            </div>
        </div>

        <div class="right-col">
            <router-link class="logo-wrapper" to="/home" aria-label="Go to Home">
                <img alt="JEEC" class="jeec-logo" src="@/assets/jeec_horizontal_mobile_white.svg" />
            </router-link>

            <div class="img-wrapper">
                <UserImage :image="userStore.user.picture" :variant="'nav'"></UserImage>
            </div>
        </div>
    </div>
    <NotificationsDrawer />
</template>

<script setup>
import NotificationsDrawer from '../NotificationsDrawer.vue'
import CurrentPoints from './CurrentPoints.vue'
import JEECPOT from './JEECPOT.vue'
import UserImage from './UserImage.vue'

import { onMounted } from 'vue'

import { useUserStore } from '@/stores/UserStore'
import { useStateStore } from '@/stores/StateStore'

import UserService from '@/services/user.service'
const stateStore = useStateStore()

const userStore = useUserStore()

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

onMounted(() => {
    stateStore.refreshNotificationSubscription()
})
</script>

<style scoped>
/* Find .user-card and update it */
.user-card {
    /* --- NEW FIXED POSITIONING --- */
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    /* Keeps it above other content */
    background-color: var(--color-background);
    /* Matches your app background so text doesn't overlap */

    /* Existing styles */
    height: 12rem;
    width: 100%;
    border-radius: 18px;
    /* You might want 0px for a true header, but 18px keeps your style */
    padding: 30px;
    box-sizing: border-box;

    display: flex;
    justify-content: space-between;
    align-items: stretch;
}

/* --- Left Column Structure --- */
.left-col {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
    /* Takes up remaining space */
    overflow: hidden;
    /* Keeps long names from breaking layout */

    /* 🔥 CHANGE THIS VALUE TO ADJUST THE VERTICAL GAP 🔥 */
    /* Try 8px, 10px, or 12px to see what matches the design best */
    gap: 16px;
}

/* --- Right Column Structure --- */
.right-col {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    /* Pushes logo to top, avatar to bottom */
    width: 96px;
    margin-left: 10px;
}

/* --- Individual Element Styling --- */
.name-wrapper {
    width: 100%;
}

.name-wrapper p {
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

.tickets-wrapper,
.points-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
}

/* Forces inner components to strip margins that might ruin your flex gap */
.tickets-wrapper :deep(*),
.points-wrapper :deep(*) {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    border-radius: 999px;
}

.logo-wrapper {
    display: flex;
    justify-content: flex-end;
}

.jeec-logo {
    height: 1.7rem;
    width: auto;
    display: block;
    object-fit: contain;
}

.img-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
}

/* --- Unused/Extra CSS preserved from your original code --- */
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

.notif-wrapper {
    background: transparent;
    width: 56px;
    height: 56px;
    border-radius: 999px;
    border: transparent;
    box-shadow:
        inset 2px 2px 4px rgba(255, 255, 255, 0.40),
        inset -2px -2px 4px rgba(255, 255, 255, 0.25),
        inset 1px 1px 2px rgba(0, 0, 0, 0.15),
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
    background: #ff3b3b;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.35);
}

.notif-dot.green {
    background: #33e08a;
}

.notif-dot.red {
    background: #ff3b3b;
}
</style>