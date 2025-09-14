<template>
  <button
    @click="stateStore.qrCodeOpen = true"
    aria-label="Show the QR Code"
    :aria-expanded="stateStore.qrCodeOpen"
    aria-controls="qrcode"
  >
    <img src="@/assets/qrcode-button.svg" aria-hidden="true" />
  </button>
</template>
<script setup>
import { useStateStore } from '@/stores/StateStore'
const stateStore = useStateStore()
</script>
<style scoped>
button {
  border: none;
  background: none;
  width: 100%;
  aspect-ratio: 1;
  cursor: pointer;
}
button:before {
  content: '';
  float: left;
  padding-top: 100%;
}
button > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
