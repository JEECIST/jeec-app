<template>
  <router-link to="/profile" class="radient-border-passthrough" :class="variant">
    <img :src="image ? image : jeec25" alt="user image" />
    <!-- <img :src="image" alt="user image"> -->
  </router-link>
</template>
<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue'
import jeec25 from '@/assets/jeec25.png'
const props = defineProps({
  image: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: '',
  },
})
</script>
<style scoped>
a.profile {
  width: auto;
  height: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
a {
  --border-background: #199cff;
  --border-width: 1.5px;
  --border-radius: 50%;

  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  display: block;
}
a::before {
  content: '';
}
a img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
