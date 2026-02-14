<template>
  <!-- <TheHeader v-if="header" :title="pageName" :inert="stateStore.qrCodeOpen"></TheHeader> -->
  <TheHiddenHeader v-if="!header" :title="pageName"></TheHiddenHeader>
  <TheQrCodePopup v-if="stateStore.qrCodeOpen"></TheQrCodePopup>
  <Loading />
  <main :inert="stateStore.navOpen || stateStore.qrCodeOpen">
    <router-view />
  </main>
  <TheBottomNav />
</template>

<script setup>
import TheHeader from './components/TheHeader.vue'
import TheHiddenHeader from './components/TheHiddenHeader.vue'
import TheBottomNav from './components/TheBottomNav.vue'
import TheQrCodePopup from './components/QrCode/TheQrCodePopup.vue'
import Loading from './components/Loading.vue'

import { useStateStore } from '@/stores/StateStore'
import { useUserStore } from '@/stores/UserStore'
import { usePrizeStore } from '@/stores/PrizeStore'

const stateStore = useStateStore()
const userStore = useUserStore()
const prizeStore = usePrizeStore()

function gettersStatic() {
  prizeStore.getRewards()
  userStore.getPoints()
  userStore.getMilestones()
}

watch(
  () => userStore.loggedIn,
  () => {
    if (userStore.loggedIn) {
      gettersStatic()
      // userStore.logOut() //remover para prod
    }
  },
)

import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pageName = ref('')
const header = ref(false)
const userPopup = ref(false)

function onRouteChange() {
  pageName.value = route.name
  stateStore.navOpen = false
  stateStore.qrCodeOpen = false

  if (route.meta.header !== undefined && route.meta.header === false) {
    header.value = false
  } else {
    header.value = true
  }

  if (route.meta.userPopup !== undefined && route.meta.userPopup === false) {
    userPopup.value = false
  } else {
    userPopup.value = true
  }
}

onMounted(async () => {
  // userStore.logOut()
  await router.isReady()
  onRouteChange()
  watch(() => route.fullPath, onRouteChange)
})
</script>

<style scoped>
main {
  padding: 0 2ch;
  padding-top: 90px;
  z-index: 1;
  position: relative;
}
</style>
