<template>
    <div class="user-card">
        <div class="name-wrapper">
            <p>{{ userStore.user.name }}</p>
        </div>

        <div class="tickets-wrapper">
            <CurrentPoints :variant="'nav'"></CurrentPoints>
        </div>

        <div class="points-wrapper">
            <JEECPOT :variant="'nav'"></JEECPOT>
        </div>

        <div class="img-wrapper">
            <UserImage :image="userStore.user.picture" :variant="'nav'"></UserImage>
        </div>
    </div>
</template>

<script setup>
import CurrentPoints from './CurrentPoints.vue'
import JEECPOT from './JEECPOT.vue'
import UserImage from './UserImage.vue'

import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

</script>

<style scoped>
.user-card {
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

.user-card>.name-wrapper {
    grid-area: name;
    text-align: left;
    align-self: start;
    justify-self: start;
}

.user-card>.name-wrapper p {
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





.user-card>.tickets-wrapper {
    grid-area: tickets;
    display: flex;
    align-items: center;
    align-self: center;
    justify-self: start;
    margin: 0;
    padding: 0;
}

.user-card>.tickets-wrapper :deep(*) {
    border-radius: 999px;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

.user-card>.points-wrapper {
    grid-area: points;
    display: flex;
    align-items: center;
    padding-right: 0;
    align-self: start;
    justify-self: start;
    margin: 0;
    padding-top: 0.5rem;
    padding-bottom: 0;
    width: 100%;
    max-width: none;
}

.user-card>.points-wrapper :deep(*) {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

.user-card>.img-wrapper {
    height: auto;
    width: 80%;
    margin-left: 2rem;
}
</style>