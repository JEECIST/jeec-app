<template>
  <div
    class="nav-wrapper"
    :class="{ open: stateStore.navOpen }"
    :aria-hidden="!stateStore.navOpen"
    :inert="!stateStore.navOpen"
  >
    <div class="nav-backdrop" @click="stateStore.navOpen = false"></div>
    <div id="nav-drawer">
      <button class="nav-logout" @click="userStore.logOut()">Logout</button>
      <TheUserInfo variant="nav"></TheUserInfo>
      <nav>
        <ul>
          <li>
            <router-link to="/home">home</router-link>
            <div class="link-underline"></div>
          </li>
          <li>
            <router-link to="/profile">profile</router-link>
            <div class="link-underline"></div>
          </li>
          <li>
            <router-link to="/schedule">schedule</router-link>
            <div class="link-underline"></div>
          </li>
          <li>
            <router-link to="/eletrolink">eletrolink</router-link>
            <div class="link-underline"></div>
          </li>
          <li>
            <router-link to="/draw">draw</router-link>
            <div class="link-underline"></div>
          </li>
          <li>
            <router-link to="/shop">shop</router-link>
            <div class="link-underline"></div>
          </li>
          <li>
            <router-link to="/rankings">rankings</router-link>
            <div class="link-underline"></div>
          </li>
          <li>
            <router-link to="/map">map</router-link>
            <div class="link-underline"></div>
          </li>
        </ul>
        <div class="help-info">
          <router-link to="/help">
            <img src="@/assets/help-info.svg" aria-hidden="true" />
            Help and Info
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>
<script setup>
import TheUserInfo from './UserCard/TheUserInfo.vue'

import { useStateStore } from '@/stores/StateStore'
import { useUserStore } from '@/stores/UserStore'

const stateStore = useStateStore()
const userStore = useUserStore()
</script>
<style scoped>
.nav-wrapper {
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  height: 100svh;
  visibility: hidden;
  z-index: 101;
  overflow: hidden;
}

.nav-wrapper.open {
  visibility: visible;
}

.nav-backdrop {
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: cubic-bezier(0.445, 0.05, 0.55, 0.95) 0.17s;
  background: rgba(0, 0, 0, 0.4);
}

.nav-wrapper.open .nav-backdrop {
  opacity: 1;
  transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s;
}

#nav-drawer {
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100% - 30px);
  max-width: 500px;
  height: 100%;
  background-color: var(--color-background-sec);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 70px;
  translate: 100% 0;
  transition: cubic-bezier(0.445, 0.05, 0.55, 0.95) 0.17s;
  border-radius: 20px 0 0 20px;
}

.nav-wrapper.open #nav-drawer {
  translate: 0 0;
  transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s;
}

.nav-logout {
  position: absolute;
  top: 19px;
  left: 5%;
  border: 3px solid #f72585;
  cursor: pointer;
  border-radius: 10px;
  padding: 0.4rem 1.3ch;
  font-family: 'Lexend Exa';
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(110deg, #f72585 -100%, #f725840a 110%);
}

.placeholder-profile {
  width: 100%;
  min-height: 150px;
  max-height: 150px;
  background-color: rgba(0, 0, 255, 0.147);
}

nav {
  width: 100%;
  flex-grow: 1;
  padding-bottom: 5rem;
  overflow-y: auto;
}

ul {
  list-style-type: none;
  text-align: end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 1rem;
}

li {
  padding: 1rem 0;
  width: min-content;
}

li a {
  text-decoration: none;
  text-transform: uppercase;
  font-family: 'Russo One';
  font-size: 2.2rem;
  padding: 0 0.5ch;
  position: relative;
  overflow: hidden;
  display: block;
}

li a.active-link::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  translate: -50% 50%;
  border-radius: 50%;
  background: radial-gradient(50% 50%, #4ccaf043, #7109b700);
  width: 100%;
  height: 60px;
  z-index: -1;
}

.link-underline {
  width: 100%;
  height: 2.3px;
  background: var(--color-jeec-blue);
  opacity: 0.6;
  border-radius: 3px;
}

.help-info {
  width: 100%;
  height: 5rem;
  position: absolute;
  background-color: var(--color-background-sec);
  bottom: 0;
  right: 0;
}

.help-info img {
  height: 3rem;
}

.help-info a {
  font-size: 1.6rem;
  text-decoration: none;
  font-family: 'Lexend Exa';
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1ch;
}
</style>
