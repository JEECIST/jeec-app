<template>
  <div>
    <QRCodeVue3 width="200" height="200" :value="userStore.user.student_external_id" :image="jeec_logo_mobile"
      :imageOptions="{ imageSize: 0.6, margin: 2 }" imgclass="qrcode-image" :dotsOptions="{
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 2,
          colorStops: [
            { offset: 0, color: '#FFFFFF' },
          ],
        },
      }" :backgroundOptions="{ color: 'transparent' }"
      :cornersSquareOptions="{ type: 'extra-rounded', color: '#FFFFFF' }"
      :cornersDotOptions="{ type: 'square', color: '#FFFFFF' }" alt="Show this QR Code"></QRCodeVue3>
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
import jeec_logo_mobile from '@/assets/jeec_mobile_white.svg'
const userStore = useUserStore()
</script>

<style>
.qrcode-image {
  border-radius: 16px;
}
</style>
