<template>
  <div>
    <h2>Show this code everywhere!</h2>
    <TheQrCode class="center"></TheQrCode>
  </div>
</template>
<script setup>
import TheQrCode from '@/components/QrCode/TheQrCode.vue'
</script>
<style scoped>
h2 {
  margin: 0 auto;
  width: fit-content;
  padding-top: 4rem;
  padding-bottom: 3rem;
}
.center {
  display: flex;
  justify-content: center;
}
</style>
