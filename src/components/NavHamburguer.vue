<template>
  <button
    @click="toggleNav"
    :class="{ active: stateStore.navOpen }"
    class="nav__toggle"
    :aria-expanded="stateStore.navOpen"
    aria-label="Open navigation drawer"
    aria-controls="nav-drawer"
  >
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </button>
</template>
<script setup>
import { useStateStore } from '@/stores/StateStore'

const stateStore = useStateStore()

function toggleNav() {
  stateStore.navOpen = !stateStore.navOpen
}
</script>
<style scoped>
.nav__toggle {
  border: none;
  background: none;
  width: 32px;
  height: 23px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  display: inline;
  z-index: 102;
}

.nav__toggle span {
  background-color: var(--color-jeec-blue);
  width: 100%;
  height: 3px;
  display: block;
  position: absolute;
  border-radius: 3px;
  rotate: 0;
  box-shadow: 0px 0px 3px var(--color-jeec-blue);
  transition:
    all 0.5s,
    box-shadow 0s;
}

.nav__toggle.active span {
  transition:
    all 0.5s,
    box-shadow 0s;
}

.nav__toggle span:nth-child(1) {
  top: 0;
  left: 0%;
}

.nav__toggle span:nth-child(2) {
  top: 10px;
}

.nav__toggle span:nth-child(3) {
  top: 10px;
  box-shadow: 0px 0px 0px var(--color-jeec-blue);
}

.nav__toggle span:nth-child(4) {
  top: 20px;
  left: 0%;
}

.nav__toggle.active span:nth-child(1) {
  width: 0%;
  left: 50%;
  top: 10px;
}

.nav__toggle.active span:nth-child(2) {
  rotate: 45deg;
  height: 4px;
}

.nav__toggle.active span:nth-child(3) {
  rotate: -45deg;
  box-shadow: 0px 0px 3px var(--color-jeec-blue);
  height: 4px;
}

.nav__toggle.active span:nth-child(4) {
  width: 0%;
  left: 50%;
  top: 10px;
}
</style>
