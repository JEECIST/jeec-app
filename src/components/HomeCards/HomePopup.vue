<template>
  <Transition name="slide" appear>
    <div @click="isOpen = false" class="popup" v-if="isOpen">
      <button class="close-button">&times;</button>
      <h2>You still haven't added your CV!</h2>
      <p>Upload now to get 300 points and get you closer to the JEECPOT</p>
    </div>
  </Transition>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import UserService from '@/services/user.service'

const isOpen = ref(false)

onMounted(() => {
  UserService.getUserStudent().then(
    (response) => {
      if (!response.data.data.uploaded_cv) {
        //Bueda estupido o .data.data mas so assim funciona com o endpoint
        isOpen.value = true
      }
    },
    (error) => {
      console.log(error)
    },
  )
})
</script>
<style scoped>
.popup {
  position: fixed;
  top: 70px;
  left: 50%;
  translate: -50% 0;
  width: 100%;
  max-width: 900px;
  background: rgb(255, 0, 0);
  z-index: 100;
  border-radius: 25px;
  border: 4px solid rgb(176, 0, 0);
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  translate: translateY(0);
  padding: 0.5rem 2ch;
  cursor: pointer;
}

.popup h2 {
  padding: 0.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 0.5;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
}

.close-button:hover {
  scale: 1.1;
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
