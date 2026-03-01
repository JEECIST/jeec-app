<template>
  <Transition name="slide" appear>
    <div v-if="isOpen" class="popup" @click="close">
      <button class="close-button" @click.stop="close">&times;</button>

      <div class="carousel" @click.stop>
        <div class="slides" :style="{ transform: `translateX(-${current * 100}%)` }">
          <div v-for="(s, i) in slides" :key="i" class="slide" :class="s.kind">
            <h2 v-html="s.title"></h2>
            <p v-html="s.text"></p>
            <button class="cta" v-if="s.cta" @click="s.onClick()">{{ s.cta }}</button>
          </div>
        </div>

        <div v-if="slides.length > 1" class="nav">
          <button class="arrow left" @click="prev" aria-label="Previous">&#10094;</button>
          <button class="arrow right" @click="next" aria-label="Next">&#10095;</button>
        </div>

        <div v-if="slides.length > 1" class="dots">
          <button v-for="(s, i) in slides" :key="`dot-${i}`" :class="['dot', { active: i === current }]" @click="go(i)"
            :aria-label="`Go to slide ${i + 1}`" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import UserService from '@/services/user.service'
import axios from 'axios'
import authHeader from '@/services/auth-header'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
const router = useRouter()
const isOpen = ref(false)
const current = ref(0)
const slides = ref([])
let autoSlideTimer = null

const close = () => {
  isOpen.value = false
  stopAutoSlide()
}
const next = () => (current.value = (current.value + 1) % slides.value.length)
const prev = () => (current.value = (current.value - 1 + slides.value.length) % slides.value.length)
const go = (i) => (current.value = i)

const startAutoSlide = () => {
  stopAutoSlide()
  if (slides.value.length > 1) {
    autoSlideTimer = setInterval(() => {
      next()
    }, 6000) //6 segundos
  }
}
const stopAutoSlide = () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
}

onBeforeUnmount(() => stopAutoSlide())

watch(isOpen, (open) => {
  if (open) startAutoSlide()
  else stopAutoSlide()
})


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}


async function subscribe() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const vapid_public_key = import.meta.env.VITE_APP_VAPID_PUBLIC_KEY;
    const registration = await navigator.serviceWorker.register("/sw.js");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Permission denied");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapid_public_key)
    });

    const username = userStore.user.username
    await axios.post(import.meta.env.VITE_APP_JEEC_BRAIN_URL + "/student/push/subscribe", { subscription, username }, {
      headers: {
        ...authHeader(),
      }
    });
  }
}

onMounted(async () => {
  try {
    const res = await UserService.getUserStudent()
    const s = res.data?.data ?? {}

    const needsCv = s.uploaded_cv === false || s.uploaded_cv === undefined

    let isSubscribed = false
    try {
      const { data } = await UserService.getIsSubscribed()
      isSubscribed = !!data?.subscribed
    } catch (e) {
      isSubscribed = false
    }

    const needsSub = !isSubscribed

    slides.value = []

    if (needsCv) {
      slides.value.push({
        kind: 'cv',
        title: "You still haven't added your CV!",
        text: "Upload now to get <b>300 points</b> and get you closer to the JEECPOT.",
        cta: 'Upload CV',
        onClick: () => {
          const el = document.getElementById('cvInput')
          if (el) el.click()
          isOpen.value = false
          stopAutoSlide()
          router.push('/profile')
        },
      })
    }

    if (needsSub) {
      slides.value.push({
        kind: 'sub',
        title: 'Turn on the notifications!',
        text: "Subscribe and get <b>X points</b> and don't miss any surprises.",
        cta: 'Turn on Notifications',
        onClick: async () => {
          try {
            subscribe()
          } finally {
            isOpen.value = false
            stopAutoSlide()
          }
        },
      })
    }

    if (slides.value.length > 0) {
      isOpen.value = true
      current.value = 0
      startAutoSlide()
    }
  } catch (e) {
    
  }
})

</script>

<style scoped>
.popup {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 900px;
  background: #1e1e2f;
  z-index: 100;
  border-radius: 25px;
  border: 2px solid #199cff;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 0.75rem 2ch 1rem;
  cursor: default;
  box-shadow: 0 10px 24px rgba(0, 0, 0, .35);
  color: #fff;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 0.5;
  position: absolute;
  top: 0.35rem;
  right: 0.6rem;
  cursor: pointer;
}

.carousel {
  overflow: hidden;
  position: relative;
}

.slides {
  display: flex;
  width: 100%;
  transition: transform 0.3s ease;
}

.slide {
  min-width: 100%;
  padding: 1.5rem .5rem 1rem;
  border-top: 3px solid #199cff;
}

.slide h2 {
  margin: .25rem 0 .5rem;
  font-size: 1.25rem;
  font-weight: 800;
}

.slide p {
  margin: 0 0 .9rem;
  opacity: .9;
}

.cta {
  background: #199cff;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: .55rem .9rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 3rem;
}

.slide.cv .cta {
  background: #ff6a6a;
}

.slide.sub .cta {
  background: #199cff;
}

.nav .arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(25, 156, 255, .12);
  border: 1px solid rgba(25, 156, 255, .35);
  color: #fff;
  border-radius: 12px;
  padding: .35rem .6rem;
  cursor: pointer;
  user-select: none;
}

.nav .left {
  left: .5rem;
}

.nav .right {
  right: .5rem;
}

.dots {
  margin-top: .5rem;
  display: flex;
  justify-content: center;
  gap: .5rem;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ffffff55;
  border: none;
  cursor: pointer;
}

.dot.active {
  background: #fff;
}

.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
