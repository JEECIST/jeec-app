<template>
  <div class="eletrolink">
    <h2 style="padding-bottom: 30px"></h2>
    <div v-for="activity in eletrolink_activities" :key="activity.id">
      <div class="box">
        <div class="box-header">
          <h3 class="box-title">Eletrolink</h3>
          <button class="info" @click="toggleEletrolinkInfo(activity.id)">
            {{ activeEletrolinkId === activity.id ? '−info' : '+info' }}
          </button>
        </div>

        <transition name="description-toggle">
          <div class="eletrolink-description" v-if="activeEletrolinkId === activity.id">
            {{ activity.description }}
          </div>
        </transition>

        <transition name="eletrolink-toggle" mode="out-in">
          <div
            :key="
              activeEletrolinkId === activity.id
                ? 'expanded-' + activity.id
                : 'collapsed-' + activity.id
            "
          >
            <div v-if="activeEletrolinkId === activity.id" class="eletrolink-content-grid">
              <div class="eletrolink-grid-row">
                <div class="eletrocomp">
                  <img :src="activity.image_base64" alt="Eletrocomp Logo" />
                </div>
                <div>
                  <div class="eletrocomp-title">
                    <p>{{ activity.name }}</p>
                  </div>
                  <div class="eletrocomp-location">Eletrolink Room</div>
                  <div class="eletrocomp-time">
                    <p>{{ activity.day }} | {{ activity.time }} - {{ activity.end_time }}</p>
                  </div>
                </div>
              </div>
              <div class="required-text">
                <p>Required people:</p>
                <p>{{ activity.company_registrations }}</p>
              </div>
              <div class="required-text">
                <p>Registered people:</p>
                <p>{{ activity.n_registrations }}/{{ activity.registration_limit }}</p>
              </div>
              <button
                v-if="
                  activity.n_registrations >= activity.registration_limit &&
                  activity.registered == false
                "
                class="registration"
                id="close"
              >
                Closed Registration
              </button>
              <button
                @click="reg_eletrolink(activity)"
                v-if="
                  activity.n_registrations < activity.registration_limit &&
                  activity.registered == false
                "
                class="registration"
                id="reg"
              >
                Register in Eletrolink
              </button>
              <button
                @click="unreg_eletrolink(activity)"
                v-if="activity.registered == true"
                class="registration"
                id="unreg"
              >
                Unregister in Eletrolink
              </button>
            </div>
            <div v-else class="eletrolink-grid-row">
              <div class="eletrocomp">
                <img :src="activity.image_base64" alt="Eletrocomp Logo" />
              </div>
              <div>
                <div class="eletrocomp-title">
                  <p>{{ activity.name }}</p>
                </div>
                <div class="eletrocomp-time">
                  <p>{{ activity.day }} | {{ activity.time }} - {{ activity.end_time }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import authHeader from '@/services/auth-header'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const eletrolink_activities = ref([])
const student = userStore.user

const jeec_brain_url = import.meta.env.VITE_APP_JEEC_BRAIN_URL.slice(0, -1)

const activeEletrolinkId = ref(null)

function toggleEletrolinkInfo(id) {
  activeEletrolinkId.value = activeEletrolinkId.value === id ? null : id
}

function fetchData() {
  axios
    .post(
      import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/get_eletrolink_activities',
      { username: userStore.user.username },
      {
        headers: authHeader(),
      },
    )
    .then((response) => {
      eletrolink_activities.value = response.data.activities
    })
}

function reg_eletrolink(activity) {
  axios
    .post(
      import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/register_in_eletrolink',
      {
        username: userStore.user.username,
        activity_id: activity.id,
      },
      {
        headers: authHeader(),
      },
    )
    .then((response) => {
      eletrolink_activities.value = response.data.activities
    })
}

function unreg_eletrolink(activity) {
  axios
    .post(
      import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/unregister_in_eletrolink',
      {
        username: userStore.user.username,
        activity_id: activity.id,
      },
      {
        headers: authHeader(),
      },
    )
    .then((response) => {
      eletrolink_activities.value = response.data.activities
    })
}

onMounted(fetchData)
</script>

<style scoped>
.eletrolink {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 130px;
}

.box {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid;
  border-radius: 8px;
  border-color: var(--color-yellow);
  background-color: rgba(var(--color-yellow-rgb), 0.15);
}

.eletrolink-description {
  margin-bottom: 1rem;
}

.eletrolink-grid-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.eletrocomp {
  width: 50px;
  height: 50px;
  background-color: #eee;
  border-radius: 8px;
}

.eletrocomp > img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.required-text {
  display: flex;
  justify-content: start;
  padding-bottom: 5px;
}

.required-text p {
  padding-right: 5px;
}

.eletrocomp-title p,
.eletrocomp-location p,
.eletrocomp-time p {
  margin: 0.2rem 0;
}

.eletrolink-content-grid {
  margin-top: 1rem;
}

.info {
  background: none;
  color: var(--c-acc-yellow);
  border: none;
  border-radius: 5px;
  align-self: flex-start;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
  font-weight: 300;
}

.eletrolink-toggle-enter-active,
.eletrolink-toggle-leave-active {
  transition: all 0.3s ease;
}

.eletrolink-toggle-enter-from,
.eletrolink-toggle-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.description-toggle-enter-active,
.description-toggle-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.description-toggle-enter-from,
.description-toggle-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Closed (registration full) */
button#close {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  opacity: 0.6;
  pointer-events: none;
  /* Prevents click events */
}

/* Open (registration available) */
button#reg {
  background-color: var(--color-jeec-blue);
  color: white;
  cursor: pointer;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button#reg:hover {
  background-color: var(--color-jeec-blue);
}

button#unreg {
  background-color: var(--color-strong-pink);
  color: white;
  cursor: pointer;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button#unreg:hover {
  background-color: var(--color-strong-pink);
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.box-header h3 {
  color: var(--color-yellow);
}

.box-title {
  margin: 0;
}
</style>
