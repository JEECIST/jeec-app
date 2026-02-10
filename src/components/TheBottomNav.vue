<template>
  <nav class="bottom-nav" aria-label="Bottom navigation">
    <button
      v-for="item in items"
      :key="item.key"
      class="nav-btn"
      :class="{ center: item.center, active: isActive(item) }"
      type="button"
      :aria-current="item.to && isActive(item) ? 'page' : undefined"
      :aria-expanded="item.action === 'drawer' ? stateStore.navOpen : undefined"
      :aria-controls="item.action === 'drawer' ? 'nav-drawer' : undefined"
      @click="item.center ? undefined : go(item)"
    >
      <div v-if="item.center" class="qr-hang">
        <QrCodeButton class="qr-pop" />
      </div>

      <img v-else class="nav-icon" :src="item.icon" :alt="item.label" />
    </button>
  </nav>

  <NavDrawer />
</template>


<script setup>
import { onBeforeUnmount, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStateStore } from "@/stores/StateStore"

import NavDrawer from "@/components/NavDrawer.vue"
import QrCodeButton from "@/components/UserCard/QrCodeButton.vue"

import homeIcon from "@/assets/home.svg"
import profileIcon from "@/assets/user.svg"
import scanIcon from "@/assets/qr-code.svg"
import mapIcon from "@/assets/map.svg"
import menuIcon from "@/assets/hamburger.svg"

const route = useRoute()
const router = useRouter()
const stateStore = useStateStore()

const items = [
  { key: "home", label: "Home", icon: homeIcon, matchNames: ["Home", "home", "HomeView"], to: { name: "Home" } },
  { key: "profile", label: "Profile", icon: profileIcon, matchNames: ["Profile", "profile", "User", "Account"], to: { name: "Profile" } },

  // This becomes the hanging QR button. The popup behavior comes from QrCodeButton.
  { key: "scan", label: "Scan", center: true, matchNames: ["Scan", "QR", "Qr", "QrCode"], to: { name: "Scan" } },

  { key: "map", label: "JEEC Fair Map", icon: mapIcon, matchNames: ["Map", "map", "JEEC Fair Map"], to: { name: "JEEC Fair Map" } },
  { key: "menu", label: "Menu", icon: menuIcon, action: "drawer" },
]

function isActive(item) {
  if (item.action === "drawer") return stateStore.navOpen
  const currentName = route.name != null ? String(route.name) : ""
  if (item.matchNames?.includes(currentName)) return true
  if (item.fallbackPath && route.path?.startsWith(item.fallbackPath)) return true
  return false
}

function go(item) {
  if (item.action === "drawer") {
    stateStore.navOpen = !stateStore.navOpen
    return
  }

  if (stateStore.navOpen) stateStore.navOpen = false
  if (isActive(item)) return

  if (item.to?.name) router.push(item.to).catch(() => {})
  else if (item.fallbackPath) router.push(item.fallbackPath).catch(() => {})
}

function onKeydown(e) {
  if (e.key === "Escape" && stateStore.navOpen) stateStore.navOpen = false
}

onMounted(() => window.addEventListener("keydown", onKeydown))
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown))
</script>


<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 78px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 2000;
  background: #14548c;
  background: linear-gradient(
    0deg,
    rgba(20, 84, 140, 1) 0%,
    rgba(13, 40, 71, 1) 17%,
    rgba(5, 10, 16, 1) 100%
  );
  overflow: visible;
}

.nav-btn {
  position: relative;
  background: transparent;
  border: none;
  width: 54px;
  height: 54px;
  border-radius: 14px;
  cursor: pointer;
  opacity: 0.9;
  display: grid;
  place-items: center;
}

.nav-icon {
  width: 26px !important;
  height: 26px !important;
  max-width: 26px !important;
  max-height: 26px !important;
  object-fit: contain;
  display: block;
}

.nav-btn.center {
  width: 54px;
  height: 54px;
  opacity: 1;
}

.qr-hang {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) translateY(-22px);
  width: 64px;
  height: 64px;
  z-index: 10;
}

.qr-pop {
  width: 100%;
  height: 100%;
  display: block;
}

.qr-pop {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.qr-pop :deep(img),
.qr-pop :deep(svg) {
  width: 34px;
  height: 34px;
  object-fit: contain;
  display: block;
}

.qr-pop :deep(button),
.qr-pop :deep(.qr-code-button) {
  position: static !important;
  width: 100%;
  height: 100%;
}


.nav-btn.active {
  opacity: 1;
}

.nav-btn.active::before {
  content: "";
  position: absolute;
  width: 54px;
  height: 54px;
  border-radius: 999px;
  background: radial-gradient(
    circle at 50% 40%,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.06) 45%,
    rgba(0, 0, 0, 0) 70%
  );
  z-index: 0;
}
</style>

