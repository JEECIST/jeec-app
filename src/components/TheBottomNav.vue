<template>
  <nav class="bottom-nav" aria-label="Bottom navigation">
    <button
      v-for="item in items"
      :key="item.key"
      class="nav-btn"
      :class="{ center: item.center, active: isActive(item) }"
      type="button"
      :aria-current="isActive(item) ? 'page' : undefined"
      @click="go(item)"
    >
      <img :src="item.icon" :alt="item.label" />
    </button>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"

import homeIcon from "@/assets/home.svg"
import profileIcon from "@/assets/user.svg"
import scanIcon from "@/assets/qr-code.svg"
import mapIcon from "@/assets/map.svg"
import menuIcon from "@/assets/hamburger.svg"

const route = useRoute()
const router = useRouter()

/**
 * IMPORTANT:
 * - `matchNames` are the route.name values that should light this tab.
 * - `to` is where clicking goes (by name if possible, else by path).
 *
 * Adjust matchNames/to to YOUR existing route names/paths.
 */
const items = [
  {
    key: "home",
    label: "Home",
    icon: homeIcon,
    matchNames: ["Home", "home", "HomeView"],
    to: { name: "Home" },
  },
  {
    key: "profile",
    label: "Profile",
    icon: profileIcon,
    matchNames: ["Profile", "profile", "User", "Account"],
    to: { name: "Profile" },
  },
  {
    key: "scan",
    label: "Scan",
    icon: scanIcon,
    center: true,
    matchNames: ["Scan", "QR", "Qr", "QrCode"],
    to: { name: "Scan" },
  },
  {
    key: "map",
    label: "Map",
    icon: mapIcon,
    matchNames: ["Map", "map"],
    to: { name: "Map" },
  },
  {
    key: "menu",
    label: "Menu",
    icon: menuIcon,
    matchNames: ["Menu", "menu"],
    to: { name: "Menu" },

  },
]

function isActive(item) {
  // 1) Prefer route.name matching (most stable given your App.vue)
  const currentName = route.name != null ? String(route.name) : ""
  if (item.matchNames && item.matchNames.includes(currentName)) return true

  // 2) Fallback: path prefix matching if you uncomment fallbackPath
  if (item.fallbackPath && route.path && route.path.startsWith(item.fallbackPath)) return true

  return false
}

function go(item) {
  if (isActive(item)) return

  // Try navigation by name first (no router changes needed)
  if (item.to?.name) {
    router.push(item.to).catch(() => {})
    return
  }

  // Optional fallback by path (if you set fallbackPath)
  if (item.fallbackPath) {
    router.push(item.fallbackPath).catch(() => {})
  }
}
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
  z-index: 1000;
  background: #14548c;
  background: linear-gradient(0deg, rgba(20, 84, 140, 1) 0%, rgba(13, 40, 71, 1) 17%, rgba(5, 10, 16, 1) 100%);}

.bottom-nav::before {
  content: "";
  position: absolute;
  top: -14px;
  left: 0;
  right: 0;
  height: 28px;
  pointer-events: none;
}

.nav-btn {
  position: relative;
  background: transparent;
  border: none;
  padding: 10px 14px;
  border-radius: 14px;
  cursor: pointer;
  opacity: .9;
  display: grid;
  place-items: center;
}

.nav-btn img {
  width: 26px;
  height: 26px;
  position: relative;
  z-index: 1;
}

.nav-btn.center img {
  width: 28px;
  height: 28px;
}

/* Active circle highlight */
.nav-btn.active {
  opacity: 1;
}

.nav-btn.active::before {
  content: "";
  position: absolute;
  width: 54px;
  height: 54px;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 40%,
    rgba(255,255,255,.12) 0%,
    rgba(255,255,255,.06) 45%,
    rgba(0,0,0,0) 70%);
  box-shadow:
    0 0 0 1px rgba(255,255,255,.06) inset,
    0 10px 26px rgba(0, 140, 255, .18);
  z-index: 0;
}
</style>
