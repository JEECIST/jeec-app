<template>
  <div>
    <HomePopup></HomePopup>
    <HomeActivities class="card radient-border-passthrough"></HomeActivities>
    <HomePrizes class="card radient-border-passthrough prizes-card"></HomePrizes>
  </div>
</template>

<script setup>
import HomePopup from '@/components/HomeCards/HomePopup.vue'
import HomeActivities from '@/components/HomeCards/HomeActivities.vue'
import HomePrizes from '@/components/HomeCards/HomePrizes.vue'

</script>

<style scoped>
.card {
  --border-radius: 15px;
  --border-width: 2px;
  backdrop-filter: blur(2px);

  width: 80%;
  max-width: 800px;
  min-height: 130px;
  padding: 0 1.5ch;
  margin: 0 auto;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
  align-content: center;

  font-family: 'Lexend Exa';
}
.card::before {
  content: '';
}

.h2 {
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.card:last-child {
  margin-bottom: 120px;
}

@media screen and (max-width: 700px) {
  .card {
    width: 90%;
  }
}

.prizes-card {
  overflow: visible !important;
  margin-top: 8rem;
}

@media screen and (max-width: 500px) {
  .card {
    width: 95%;
  }
  
  .prizes-card {
    width: 80%;
  }
}
</style>
