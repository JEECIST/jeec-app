<template>
  <div>
    <QRCodeVue3
      width="200"
      height="200"
      :value="userStore.user.student_external_id"
      :image="jeec_logo_mobile"
      :imageOptions="{ imageSize: 0.4, margin: 2 }"
      imgclass="qrcode-image"
      :dotsOptions="{
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 2,
          colorStops: [
            { offset: 0, color: '#1a9cd8' },
            { offset: 1, color: 'black' },
          ],
        },
      }"
      :backgroundOptions="{ color: 'white' }"
      :cornersSquareOptions="{ type: 'extra-rounded', color: '#072a3a' }"
      :cornersDotOptions="{ type: 'square', color: '#1476a3' }"
      alt="Show this QR Code"
    ></QRCodeVue3>
    <!-- <QRCodeVue3 
      width="200" 
      height="200" 
      :value="userStore.user.student_external_id"
      :dotsOptions="{
          type: 'square',
          color: '#000000'
      }"
      :backgroundOptions="{color: 'white'}"
      :cornersSquareOptions="{type: 'square', color: '#000000'}"
      :cornersDotOptions="{type: 'square', color: '#000000'}"
      alt="Show this QR Code"
    ></QRCodeVue3> -->
  </div>
</template>

<script setup>
import QRCodeVue3 from 'qrcode-vue3'

import { useUserStore } from '@/stores/UserStore'
import jeec_logo_mobile from '@/assets/jeec_logo_mobile.svg'
const userStore = useUserStore()
</script>

<style>
.qrcode-image {
  border-radius: 16px;
}
</style>
