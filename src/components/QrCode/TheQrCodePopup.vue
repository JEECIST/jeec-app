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
  inset: 0;
  width: 100%;
  height: 100svh;
  visibility: hidden;
}

.qrcode-wrapper.open {
  visibility: visible;
}

.qrcode-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
}
.qrcode-card {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;

  width: min(92vw, 520px);
  height: auto;

  padding: 22px 22px 26px;
  border-radius: 34px;

  /* dark glass panel */
  background: linear-gradient(
    180deg,
    rgba(8, 14, 22, 0.96) 0%,
    rgba(5, 10, 16, 0.96) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* blue outline */
  border: 2px solid rgba(25, 156, 255, 0.95);

  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.65),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  color: white;
}

.qrcode-card > button {
  position: absolute;
  top: 18px;
  right: 18px;

  border: none;
  background: transparent;
  cursor: pointer;

  width: 34px;
  height: 34px;
  border-radius: 10px;

  display: grid;
  place-items: center;

  opacity: 0.9;
}

.qrcode-card > button:hover {
  opacity: 1;
  transform: scale(1.05);
}
.qrcode-card > button > div {
  height: 3px;
  width: 70%;
  background-color: rgba(255, 255, 255, 0.9);
  position: absolute;
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
  width: 100%;
  margin: 0;
  padding: 18px 52px 0 32px; /* left space for accent, right for close button */

  text-transform: none;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
}
.scan {
  width: min(320px, 74vw);
  aspect-ratio: 1;
  margin: 0;

  display: grid;
  place-items: center;

  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
.qrcode {
  position: relative;
  top: 1.35px;
  scale: 1;
}
</style>
