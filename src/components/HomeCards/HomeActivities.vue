<template>
  <div
    class="schedule-card"
    :style="{
      '--border-background': currentActivityStyle.color,
      '--accent-color': currentActivityStyle.color,
    }"
  >
    <template v-if="nextActivity.name != ''">
      <div class="event-content">
        <div class="left-section">
          <div class="left-accent" :style="{ backgroundColor: currentActivityStyle.color }"></div>
          <div class="event-info">
            <h3 class="event-type">
              {{ nextActivity.activity_type }}
            </h3>
            <h4 class="event-title">{{ nextActivity.name }}</h4>
            <div class="event-date">
              {{ nextActivity.day }}
            </div>
          </div>
        </div>

        <div class="event-time">
          <div class="time-start">
            <span class="time-value">{{ formatTimeValue(nextActivity.start_time) }}</span>
            <span class="time-period">{{ formatTimePeriod(nextActivity.start_time) }}</span>
          </div>
          <span class="time-end">{{ formatTimeValue(nextActivity.end_time) }}</span>
        </div>
      </div>

      <div class="event-venue">
        <span class="venue-label">Venue</span>
        <span class="venue-name" :style="{ color: currentActivityStyle.color }">
          {{ nextActivity.location }}
        </span>
      </div>
    </template>
    <template v-else>
      <div class="no-activity">
        <h2>No more activities scheduled</h2>
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

function parseTime(time) {
  if (!time) return { value: '', period: '' }
  // If already has AM/PM, split it
  if (time.includes('PM') || time.includes('AM')) {
    const parts = time.trim().split(' ')
    return { value: parts[0], period: parts[1] || '' }
  }
  // Convert 24h to 12h
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return { value: `${hour12}:${minutes}`, period }
}

function formatTimeValue(time) {
  return parseTime(time).value
}

function formatTimePeriod(time) {
  return parseTime(time).period
}

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
.schedule-card {
  background: linear-gradient(180deg,
    rgba(100, 140, 255, 0.70) 0%,
    rgba(46, 85, 255, 0.45) 20%,
    rgba(46, 85, 255, 0.18) 50%,
    rgba(46, 85, 255, 0.04) 80%,
    rgba(46, 85, 255, 0.01) 100%
  );
  border-radius: 20px;
  padding: 0;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.schedule-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
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

.event-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  padding: 1.3rem 1.5rem 1rem 1.2rem;
}

.left-section {
  display: flex;
  align-items: stretch;
  gap: 0.9rem;
  flex: 1;
  min-width: 0;
}

.left-accent {
  width: 3.5px;
  flex-shrink: 0;
  border-radius: 3px;
  background-color: var(--accent-color, #2e55ff);
  align-self: stretch;
}

.event-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  text-align: left;
  min-width: 0;
}

.event-type {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(1.4rem, 4.5vw, 1.8rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 0;
  color: var(--color-font);
  text-transform: capitalize;
  line-height: 1.2;
}

.event-title {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(0.95rem, 3vw, 1.15rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  margin: 0;
  color: var(--color-font);
  opacity: 0.9;
  line-height: 1.3;
}

.event-date {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(0.85rem, 2.8vw, 1rem);
  color: var(--color-font);
  opacity: 0.6;
  margin-top: 0.15rem;
}

.event-time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  font-family: 'Lexend Exa', sans-serif;
  flex-shrink: 0;
  padding-top: 0.1rem;
}

.time-start {
  display: flex;
  align-items: flex-start;
  gap: 0.15rem;
}

.time-value {
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 600;
  color: var(--color-font);
  line-height: 1;
}

.time-period {
  font-size: clamp(0.65rem, 2vw, 0.8rem);
  font-weight: 500;
  color: var(--color-font);
  opacity: 0.85;
  line-height: 1;
  margin-top: 0.1rem;
}

.time-end {
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 500;
  color: var(--color-font);
  opacity: 0.85;
  line-height: 1;
  margin-top: 0.15rem;
}

.event-venue {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem 1.1rem 1.2rem;
  margin-top: 0;
}

.event-venue::before {
  content: '';
  position: absolute;
  top: 0;
  left: 1.2rem;
  right: 1.2rem;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
}

.venue-label {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(0.9rem, 3vw, 1.05rem);
  color: var(--color-font);
  opacity: 0.6;
}

.venue-name {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(1rem, 3.2vw, 1.2rem);
  font-weight: 600;
  letter-spacing: 0.03em;
}

.no-activity {
  padding: 2.5rem 1rem;
  text-align: center;
}

.no-activity h2 {
  font-family: 'Lexend Exa', sans-serif;
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  text-transform: uppercase;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: var(--color-font);
}

@media screen and (max-width: 450px) {
  .event-content {
    padding: 1rem 1rem 0.8rem 1rem;
  }

  .event-venue {
    padding: 0.7rem 1rem 1rem 1rem;
  }

  .event-venue::before {
    left: 1rem;
    right: 1rem;
  }
}
</style>
