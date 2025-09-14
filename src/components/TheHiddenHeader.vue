<template>
  <div class="hidden_header">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['title'])
</script>

<style scoped>
.hidden_header {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(0px 0px 99.9% 99.9%);
  overflow: hidden;
  height: 1px;
  width: 1px;
  padding: 0;
  border: 0;
}
</style>
