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
                    <p v-if="isLoading">A carregar notificações…</p>
            
                    <p v-else-if="errorMsg">{{ errorMsg }}</p>
            
                    <p v-else-if="notifications.length === 0">Sem notificações por agora.</p>
            
                    <ul v-else class="notif-list">
                        <li v-for="n in notifications" :key="n.id" class="notif-item">
                        <div class="notif-top">
                            <strong class="notif-title">{{ n.title }}</strong>
                            <span class="notif-date">{{ formatDate(n.scheduled_at) }}</span>
                        </div>
                        <p class="notif-message">{{ n.message }}</p>
                        </li>
                    </ul>
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
  
  const stateStore = useStateStore()
  
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
    return d.toLocaleString()
  }
  
  const fetchNotifications = async () => {
    try {
      isLoading.value = true
      errorMsg.value = ''
  
      const response = await axios.get(
        `${import.meta.env.VITE_APP_JEEC_BRAIN_URL}student/get_allnotifications`,
        { headers: authHeader() },
      )
  
      notifications.value = response.data?.notifications ?? []
  
      if (response.data?.error && notifications.value.length === 0) {
        // opcional: mostrar a msg do backend quando não há resultados
        // se preferires nunca mostrar "No results found", comenta a linha abaixo
        errorMsg.value = response.data.error
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      errorMsg.value = "Falha ao carregar notificações."
      notifications.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  watch(
    () => stateStore.notificationsOpen,
    (open) => {
      if (open) fetchNotifications()
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
  }
  
  .notif-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  
  .notif-item {
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
  
  .notif-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: baseline;
  }
  
  .notif-title {
    font-family: 'Lexend Exa';
  }
  
  .notif-date {
    opacity: 0.75;
    font-size: 0.85rem;
    white-space: nowrap;
  }
  
  .notif-message {
    margin: 6px 0 0 0;
    opacity: 0.9;
    font-family: 'Lexend Exa';
  }
  </style>
  