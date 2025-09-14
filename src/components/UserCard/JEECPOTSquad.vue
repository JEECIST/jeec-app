<template>
  <div class="wrapper" :class="variant">
    <p>SQUAD JEECPOT chances</p>
    <div class="points radient-border-passthrough">
      <div
        class="progress radient-border-passthrough_child"
        :style="'--progress:' + progress + '%;'"
      ></div>
      <div
        class="progress-fill"
        :style="{
          '--progress': progress + '%',
          ...(progress < 100 && {
            'clip-path': 'polygon(10% 0%, 100% 0%, 100% 100%, 5% 100%)',
          }),
        }"
      ></div>
      <p v-if="progress >= 100" class="points-total">Eligible!</p>
      <p v-else class="points-total">{{ progress }}%</p>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps(['variant', 'progress'])
</script>
<style scoped>
.wrapper {
  font-family: 'Lexend Exa';
  width: 100%;
  /* height: 100%; */
  text-align: right;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding: auto;
  gap: 3px;
}
.wrapper.profile {
  text-align: left;
}
.wrapper.nav > p {
  font-size: 1.4rem;
}
.wrapper.profile > p {
  font-size: 0.8rem;
  font-weight: 00;
  color: #e7e7e7;
  padding-bottom: 0.1rem;
}
p {
  font-family: 'Lexend Exa';
  font-size: 0.6rem;
  /* Your JEECPOT chances */
  font-style: normal;
  font-weight: 300;
  text-align: right;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.9);
  margin-right: 2px;
}
.wrapper.profile > .points {
  height: 23px;
}
.points {
  width: 100%;
  height: 16px;
  overflow: hidden;
  background: linear-gradient(0deg, rgba(25, 156, 255, 0.1), rgba(25, 156, 255, 0.1)), #1f1f1f;
  --border-background: #199cff;
  --border-width: 1.5px;
  --border-radius: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.progress {
  overflow: hidden;
}
.progress-fill {
  width: calc(var(--border-width) + var(--progress)) !important;
  height: calc(100% - var(--border-width));
  background-color: var(--color-jeec-blue);
  transition: width 0.3s ease-in-out;
}

.points-total {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  padding-right: 1ch;
  z-index: 2;
}
</style>
