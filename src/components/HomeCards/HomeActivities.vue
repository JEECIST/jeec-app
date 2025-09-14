<template>
  <div
    class="next-activity"
    :style="{
      '--background': backgroundColorWithTransparency,
      '--border-background': currentActivityStyle.color,
    }"
  >
    <template v-if="nextActivity.name != ''">
      <div class="activity-container">
        <h2>Up Next</h2>
        <div class="activity">
          <div class="activity-info">
            <div class="activity-type">
              <h3 :style="{ color: currentActivityStyle.color }">
                {{ nextActivity.activity_type }}
              </h3>
              <div class="activity-type-icon">
                <img :src="currentActivityStyle.icon" alt="Activity Type Icon" />
              </div>
            </div>
            <h4>
              {{ nextActivity.name }}
            </h4>
            <h5>
              {{ nextActivity.location }}
            </h5>
            <p>
              {{ nextActivity.day }} | {{ nextActivity.start_time }} - {{ nextActivity.end_time }}
            </p>
          </div>
          <div
            class="activity-image radient-border-passthrough"
            :class="{ 'single-image': nextActivity.images.length < 2 }"
            :style="{
              '--background': 'transparent',
              '--border-background': currentActivityStyle.color,
            }"
          >
            <div
              class="circle circle-1 radient-border-passthrough"
              :style="{
                '--background': 'transparent',
                '--border-background': currentActivityStyle.color,
              }"
            >
              <img class="image" :src="nextActivity.images[0]" />
            </div>
            <div
              v-if="nextActivity.images.length > 1"
              class="circle circle-2 radient-border-passthrough"
              :style="{
                '--background': 'transparent',
                '--border-background': currentActivityStyle.color,
              }"
            >
              <img class="image" :src="nextActivity.images[1]" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="no-activity">
        <h2>There are no more activities scheduled</h2>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import authHeader from '@/services/auth-header'
import { useUserStore } from '@/stores/UserStore'
import { onMounted } from 'vue'
const userStore = useUserStore()
const student = userStore.user

import panelIcon from '@/assets/icons/panel_icon.svg'
import workshopIcon from '@/assets/icons/workshop_icon.svg'
import keynoteIcon from '@/assets/icons/keynote_icon.svg'
import fifteenIcon from '@/assets/icons/15_15_icon.svg'
import insideTalkIcon from '@/assets/icons/inside_talk_icon.svg'

const nextActivity = ref({
  name: '',
  location: '',
  start_time: '',
  end_time: '',
  day: '',
  activity_type: '',
  images: [],
})

const activityTypeMapping = {
  Panel: {
    color: '#2E55FF',
    icon: panelIcon,
  },
  Workshop: {
    color: '#FB5607',
    icon: workshopIcon,
  },
  'Keynote Speakers': {
    color: '#2E55FF',
    icon: keynoteIcon,
  },
  '15/15': {
    color: '#A300FF',
    icon: fifteenIcon,
  },
  'Inside Talks': {
    color: '#FF006E',
    icon: insideTalkIcon,
  },
}

// Computed property to get the current activity's color and icon
const currentActivityStyle = computed(() => {
  const mapping = activityTypeMapping[nextActivity.value.activity_type] || {}
  return {
    color: mapping.color || '#199CFF', // Default color
    icon: mapping.icon || panelIcon, // Default icon
  }
})

// Computed property to add "1A" transparency to the color
const backgroundColorWithTransparency = computed(() => {
  return (currentActivityStyle.value.color || '#199CFF') + '1A'
})

function getNextActivity() {
  axios
    .get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/next_activity', {
      headers: {
        ...authHeader(),
        student: student,
      },
    })
    .then((response) => {
      if (response.data.activity != null) {
        nextActivity.value = response.data.activity
      }
    })
    .catch((error) => {
      console.error('Error fetching Activity data:', error)
    })
}

onMounted(() => {
  getNextActivity()
})
</script>

<style scoped>
.activity-container {
  padding: 0.5rem 0 0.9rem 0;
}

.activity-container h2 {
  font-size: clamp(1.4rem, 3.1vw, 1.8rem);
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: 'Lexend Exa';
  text-transform: uppercase;
}

.activity {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  padding-top: 0.5rem;
}

.activity-info {
  text-align: start;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 0 0.5rem 0.5rem;
  gap: 0.3rem;
}

.activity-info h3 {
  font-family: 'Lexend Exa';
  font-size: clamp(1rem, 3.2vw, 1.1rem);
  font-weight: 700;
  overflow: hidden;
  letter-spacing: 0.05em;
}

.activity-type {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.activity-type-icon {
  width: clamp(0.8rem, 3.2vw, 1.1rem);
  height: clamp(0.8rem, 3.2vw, 1.1rem);
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-info h4 {
  font-family: 'Lexend Exa';
  font-size: clamp(1.1rem, 3.7vw, 1.3rem);
  font-weight: 400;
  letter-spacing: 0.05em;
}

.activity-info h5 {
  font-family: 'Lexend Exa';
  font-size: clamp(0.8rem, 3.1vw, 1.2rem);
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.activity-info p {
  display: flex;
  justify-content: flex-start;
  font-family: 'Lexend Exa';
  font-size: clamp(0.9rem, 3.1vw, 0.8em);
}

.activity-image {
  width: 100%;
  min-width: 60px;
  max-width: 80px;
  position: relative;
  align-self: center;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  --border-radius: 50%;
}

.activity-image::before {
  content: '';
}

.activity-image .image {
  height: 100%;
  width: 100%;
  object-fit: contain;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  /* Add shadow */
}

.single-image {
  width: 100%;
  max-width: 100px;
  /* Adjust as needed */
  aspect-ratio: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.single-image .circle-1 {
  transform: translate(0, 0);
  /* Center the image */
  width: 100%;
  height: 100%;
}

.single-image .circle-2 {
  display: none;
  /* Hide the second circle */
}

.circle {
  width: 55%;
  height: 55%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  --border-width: 2px;
  --border-radius: 50%;
}

.circle::before {
  content: '';
}

.circle-1 {
  transform: translate(-30%, -30%);
  overflow: hidden;
}

.circle-2 {
  transform: translate(30%, 30%);
  overflow: hidden;
}

.no-activity {
  padding: 3rem 0.3rem;
}

.no-activity h2 {
  font-family: 'Lexend Exa';
  font-size: clamp(1.2rem, 3.1vw, 1.8rem);
  text-transform: uppercase;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-align: center;
}
</style>
