<template>
  <transition name="fade">
    <div v-if="visible" class="toast" :class="type">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ToastNotification',
  props: ['message', 'type', 'visible'],
  mounted() {
    if (this.visible) {
      setTimeout(() => {
        this.$emit('close')
      }, 6000)
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.$emit('close')
        }, 6000)
      }
    },
  },
}
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  translate: -50% 0;
  transform: translateY(100%);
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 1.5rem;
  animation: slide-up 0.5s ease-out forwards;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: calc(100% - 20px);
  max-width: 400px;
  text-align: center;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast.success {
  background-color: #4caf50;
}
.toast.error {
  background-color: #f44336;
}
.toast.points {
  background-color: #2196f3;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
