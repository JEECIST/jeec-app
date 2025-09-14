<template>
  <div
    class="qrcode-wrapper"
    :class="{ open: stateStore.qrCodeOpen }"
    :aria-hidden="!stateStore.qrCodeOpen"
    :inert="!stateStore.qrCodeOpen"
  >
    <div class="qrcode-backdrop" @click="exitQRCode()"></div>
    <div id="qrcode" class="qrcode-card">
      <button @click="exitQRCode()" aria-label="Close the QR Code">
        <div></div>
        <div></div>
      </button>
      <h2>Scan Me</h2>
      <div class="scan">
        <TheQrCode class="qrcode"></TheQrCode>
      </div>
    </div>
  </div>
</template>
<script setup>
import TheQrCode from './TheQrCode.vue'

import { useStateStore } from '@/stores/StateStore'
import { useUserStore } from '@/stores/UserStore'
const stateStore = useStateStore()
const userStore = useUserStore()

function exitQRCode() {
  stateStore.qrCodeOpen = false
  userStore.getPoints()
}
</script>
<style scoped>
.qrcode-wrapper {
  position: fixed;
  z-index: 200;
  right: 0;
  top: 0;
  width: 100%;
  height: 100svh;
  visibility: hidden;
}
.qrcode-wrapper.open {
  visibility: visible;
}
.qrcode-backdrop {
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: cubic-bezier(0.445, 0.05, 0.55, 0.95) 0.17s;
  background: rgba(0, 0, 0, 0.7);
}
.qrcode-card {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  width: 100%;
  max-width: 300px;
  height: 400px;
  background-color: var(--color-background-sec);
  border-radius: 20px;
  border: 6px solid var(--color-background);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qrcode-card > button {
  align-self: flex-end;
  border: none;
  background: none;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: block;
  position: relative;
  flex-shrink: 0;
  margin: 10px 10px 0 0;
}
.qrcode-card > button > div {
  height: 3px;
  width: 141%;
  background-color: var(--color-background);
  background-color: var(--color-font);
  position: absolute;
  transform-origin: center;
  border-radius: 3px;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}
.qrcode-card > button > div:first-child {
  rotate: 45deg;
}
.qrcode-card > button > div:last-child {
  rotate: -45deg;
}
.qrcode-card > button:hover {
  scale: 1.1;
}
.qrcode-card > h2 {
  text-transform: uppercase;
  font-size: 2.2rem;
  padding-top: 1rem;
  color: var(--color-background);
  color: var(--color-font);
}
.scan {
  height: 100%;
  width: 210px;
  height: 210px;
  margin: 0 auto;
  margin-top: 1.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #404040;
  border-radius: 20px;
}
.qrcode {
  position: relative;
  top: 1.35px;
  scale: 1;
}
</style>
