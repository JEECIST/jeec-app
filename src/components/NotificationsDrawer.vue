<template>
    <teleport to="body">
      <div
        class="notifications-wrapper"
        :class="{ open: stateStore.notificationsOpen }"
        :aria-hidden="!stateStore.notificationsOpen"
        :inert="!stateStore.notificationsOpen"
      >
        <div class="notifications-backdrop" @click="close"></div>
  
        <div id="notifications-drawer">
          <div class="notifications-header">
            <h2>Notifications</h2>
            <button class="close-btn" @click="close" aria-label="Fechar">✕</button>
          </div>
  
          <div class="notifications-body">
            <p v-if="isLoading">Loading</p>
  
            <template v-else>
              <template v-if="stateStore.notificationsSubscribed === false">
                <p class="sub-text">Subscribe to get notifications from JEEC</p>
  
                <button class="sub-btn" type="button" @click="handleSubscribe">
                  Subscribe Notifications
                </button>
              </template>
  
              <template v-else>
                <p v-if="errorMsg">{{ errorMsg }}</p>
                <p v-else-if="notifications.length === 0">There are no Notifications</p>
  
                <ul v-else class="notif-list">
                  <li v-for="n in notifications" :key="n.id" class="notif-item">
                    <div class="notif-top">
                      <strong class="notif-title">{{ n.title }}</strong>
                      <span class="notif-date">{{ formatDate(n.scheduled_at) }}</span>
                    </div>
                    <p class="notif-message">{{ n.message }}</p>
                  </li>
                </ul>
              </template>
            </template>
          </div>
        </div>
      </div>
    </teleport>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import axios from 'axios'
  import authHeader from '@/services/auth-header'
  import { useStateStore } from '@/stores/StateStore'
  import { useUserStore } from '@/stores/UserStore'
  
  const stateStore = useStateStore()
  const userStore = useUserStore()
  
  const isLoading = ref(false)
  const errorMsg = ref('')
  const notifications = ref([])
  
  function close() {
    stateStore.notificationsOpen = false
  }
  
  function formatDate(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('pt-PT')
  }
  
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
    return outputArray
  }
  
  const fetchNotifications = async () => {
    try {
      isLoading.value = true
      errorMsg.value = ''
  
      const response = await axios.get(
        `${import.meta.env.VITE_APP_JEEC_BRAIN_URL}/student/get_allnotifications`,
        { headers: authHeader() },
      )
  
      notifications.value = response.data?.notifications ?? []
  
      if (response.data?.error && notifications.value.length === 0) {
        errorMsg.value = response.data.error
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      errorMsg.value = 'Falha ao carregar notificações.'
      notifications.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  async function handleSubscribe() {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        alert('Your browser does not support notification push')
        return
      }
  
      const vapid_public_key = import.meta.env.VITE_APP_VAPID_PUBLIC_KEY
      const registration = await navigator.serviceWorker.register('/sw.js')
  
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        alert('Permission denied')
        stateStore.notificationsSubscribed = false
        return
      }
  
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid_public_key),
      })
  
      const username = userStore.user.username
  
      await axios.post(
        `${import.meta.env.VITE_APP_JEEC_BRAIN_URL}/student/push/subscribe`,
        { subscription, username },
        { headers: { ...authHeader() } },
      )
  
      stateStore.notificationsSubscribed = true
      await stateStore.refreshNotificationSubscription()
  
    } catch (e) {
      console.error(e)
      stateStore.notificationsSubscribed = false
      alert('Error')
    }
  }
  
  watch(
    () => [stateStore.notificationsOpen, stateStore.notificationsSubscribed],
    ([open, subscribed]) => {
      if (!open) return
  
      if (subscribed === true) fetchNotifications()
  
      if (subscribed === false) {
        notifications.value = []
        errorMsg.value = ''
        isLoading.value = false
      }
    },
  )
  </script>
  
  <style scoped>
  .notifications-wrapper {
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    height: 100svh;
    visibility: hidden;
    z-index: 101;
    overflow: hidden;
  }
  
  .notifications-wrapper.open {
    visibility: visible;
  }
  
  .notifications-backdrop {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: cubic-bezier(0.445, 0.05, 0.55, 0.95) 0.17s;
    background: rgba(0, 0, 0, 0.4);
  }
  
  .notifications-wrapper.open .notifications-backdrop {
    opacity: 1;
    transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s;
  }
  
  #notifications-drawer {
    position: absolute;
    right: 0;
    top: 0;
    width: calc(100% - 30px);
    max-width: 500px;
    height: 100%;
    background-color: var(--color-background-sec);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 70px;
    translate: 100% 0;
    transition: cubic-bezier(0.445, 0.05, 0.55, 0.95) 0.17s;
    border-radius: 20px 0 0 20px;
    z-index: 999;
  }
  
  .notifications-wrapper.open #notifications-drawer {
    translate: 0 0;
    transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s;
  }
  
  .notifications-header {
    position: absolute;
    top: 18px;
    left: 5%;
    right: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  
  .notifications-header h2 {
    margin: 0;
    font-family: 'Lexend Exa';
    font-size: 1.4rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  
  .close-btn {
    border: 0;
    background: transparent;
    cursor: pointer;
    font-size: 1.6rem;
    line-height: 1;
    padding: 0.2rem 0.6rem;
    border-radius: 10px;
  }
  
  .notifications-body {
    width: 100%;
    padding: 1rem 1.5rem;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .notif-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    display: grid;
    gap: 12px;
  }
  
  .notif-item {
    width: 100%;
    border-radius: 14px;
    padding: 12px 14px;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.03);
  }
  
  .notif-item::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    padding: 2px;
  
    background:
      linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%),
      radial-gradient(circle at 50% 0%, #3262F1 0%, #030712 75%);
  
    border-top: 1px solid rgba(100, 150, 255, 0.4);
    box-shadow: inset 0px 15px 25px -10px rgba(50, 100, 255, 0.6);
  
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  
    pointer-events: none;
  }
  
  .notif-item > * {
    position: relative;
    z-index: 1;
  }
  
  .notif-item:nth-child(even) {
        width: 100%;
        border-radius: 14px;
        padding: 12px 14px;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.03);
    }
  

  .notif-item:nth-child(even)::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    padding: 2px;
  
    background:
      linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%),
      radial-gradient(circle at 50% 0%, #32c4f1 0%, #030712 75%);
  
    border-top: 1px solid rgba(100, 150, 255, 0.4);
    box-shadow: inset 0px 15px 25px -10px #319df5;
  
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  
    pointer-events: none;
  }
  .notif-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }
  
  .notif-title {
    font-family: 'Lexend Exa';
    font-weight: 600;
    letter-spacing: 0.02em;
    margin: 0;
  }
  
  .notif-date {
    font-family: 'Lexend Exa';
    font-size: 0.82rem;
    opacity: 0.75;
    white-space: nowrap;
  }
  
  .notif-message {
    margin: 0;
    font-family: 'Lexend Exa';
    opacity: 0.9;
    line-height: 1.35;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  
  .sub-btn {
    background: #199cff;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 0.55rem 0.9rem;
    font-weight: 700;
    cursor: pointer;
    min-height: 3rem;
    width: 50%;
  }
  </style>
  