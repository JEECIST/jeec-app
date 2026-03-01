<template>
  <div class="desktop" v-if="!isMobile">
    <div class="view">
      <!-- <section class="header">
        <h1>SCHEDULE</h1>
        <h3>Join activities and win prizes!</h3>
        <h3>Every activity you participate in automatically enters you into a draw for a chance to get a prize!</h3>
      </section> -->
      <!-- <section class="tabs">
        <div v-for="(day, index) in days" :key="index" class="tab" :class="{ active: activeDay === index }"
          @click="setActiveDay(index)">
          {{ day }}
        </div>
      </section> -->
      <TabsSelection :tabs="days" :activeTab="activeDay" @tab="setActiveDay"></TabsSelection>
      <!-- <div class="loading-screen" v-if="loading">
        <div class="loading-spinner"></div>
        <p>Loading Schedule...</p>
      </div> -->
      <transition name="fade" mode="out-in">
        <section class="eletrolink" :key="activeDay" v-if="!loading">
          <div class="box">
            <h3>Eletrolink <img :src="eletrolinkIcon" alt="Eletrolink Icon" class="eletrolink-icon" /></h3>
            <div class="eletrolink-description" v-if="showEletrolinkInfo">
              {{ eletrolink_description }}
            </div>
            <p>Today's companies:</p>
            <template v-if="filteredEletrocomps.length">
              <transition name="eletrolink-toggle">
                <div v-if="!showEletrolinkInfo" class="row">
                  <div v-for="(eletrocomp, index) in filteredEletrocomps" :key="index" class="eletrocomp">
                    <img :src="base_path + eletrocomp.logo_companies" alt="Eletrocomp Logo" />
                  </div>
                </div>
              </transition>
            </template>

            <!-- Sem transição para o "NO COMPANIES" -->
            <template v-else>
              <transition name="no-companies-fade">
                <div v-if="!showEletrolinkInfo" class="no-companies">NO COMPANIES</div>
              </transition>
            </template>

            <!-- Visão detalhada -->
            <template v-if="filteredEletrocomps.length">
              <transition name="eletrolink-toggle">
                <div v-if="showEletrolinkInfo" class="eletrolink-content-grid">
                  <div v-for="(eletrocomp, index) in filteredEletrocomps" :key="index" class="eletrolink-grid-row">
                    <div class="eletrocomp">
                      <img :src="base_path + eletrocomp.logo_companies" alt="Eletrocomp Logo" />
                    </div>
                    <div class="eletrocomp-text">
                      <div class="eletrocomp-title">
                        <p>{{ eletrocomp.title }}</p>
                      </div>
                      <div class="eletrocomp-location">
                        <p>ELETROLINK ROOM</p>
                      </div>
                      <div class="eletrocomp-time">
                        <p>{{ eletrocomp.date }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </template>

            <!-- Sem transição para o "NO COMPANIES" -->
            <template v-else>
              <transition name="no-companies-fade">
                <div v-if="showEletrolinkInfo" class="no-companies">NO COMPANIES</div>
              </transition>
            </template>
            <button class="info" @click="toggleEletrolinkInfo">
              {{ showEletrolinkInfo ? '-info' : '+info' }}
            </button>
          </div>
        </section>
      </transition>
      <transition name="fade" mode="out-in">
        <section class="timeline" :key="activeDay" v-if="!loading">
          <div v-if="filteredActivities.length != 0" class="fixed-line"></div>
          <div v-for="(activity, index) in filteredActivities" :key="index">
            <div v-if="hasGap(index)" class="gap"></div>
            <div class="activity">
              <div class="time">
                <div class="start">
                  <div class="start-time">{{ activity.time.replace(':', 'h') }}</div>
                  <div class="circle-start"></div>
                </div>
                <div class="end">
                  <div class="end-time">{{ activity.end_time.replace(':', 'h') }}</div>
                  <div class="circle-end"></div>
                </div>
              </div>
              <div v-if="filteredActivities.length != 0" class="line"></div>
              <div class="content" :style="eventStyle(activity.type)">
                <div class="column">
                  <div class="type">
                    <span>{{ activity.type }}</span>
                    <img v-if="getActivityIcon(activity.type)" :src="getActivityIcon(activity.type)"
                      alt="Activity Type Icon" class="type-icon" />
                  </div>
                  <div class="title">{{ activity.title }}</div>
                  <transition name="expand-fade">
                    <div v-if="isExpanded(index)" class="expanded-info">
                      <p class="act_description">{{ activity.description }}</p>
                      <h3>{{ activity.location }}</h3>
                      <p>{{ activity.date }}</p>
                      <div v-if="activity.prize?.name" class="expanded-prize">
                        <p class="prize-label">Participate in this activity and you'll may win:</p>
                        <div class="prize-row">
                          <p class="prize-name">{{ activity.prize.name }}</p>
                          <div class="prize-image-container">
                            <img v-if="activity.prize.image" :src="activity.prize.image" alt="Prize Image"
                              class="prize-image" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                  <div class="actions-row">
                    <button class="info" @click="toggleActivityInfo(index)">
                      {{ isExpanded(index) ? '-info' : '+info' }}
                    </button>
                    <div class="calendar-dropdown">
                      <button class="calendar-btn" @click.stop="toggleCalendarMenu(index)" title="Add to calendar">
                        <svg class="calendar-icon" viewBox="0 0 14.2237 14.2237" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M3.11144 0C3.22932 0 3.34238 0.0468 3.42574 0.1302C3.5091 0.2135 3.55593 0.3266 3.55593 0.4445V0.889H10.6678V0.4445C10.6678 0.3266 10.7146 0.2135 10.798 0.1302C10.8813 0.0468 10.9944 0 11.1123 0C11.2302 0 11.3432 0.0468 11.4266 0.1302C11.5099 0.2135 11.5568 0.3266 11.5568 0.4445V0.889H12.4457C12.9173 0.889 13.3695 1.0763 13.703 1.4097C14.0364 1.7432 14.2237 2.1954 14.2237 2.667V12.4457C14.2237 12.9173 14.0364 13.3695 13.703 13.703C13.3695 14.0364 12.9173 14.2237 12.4457 14.2237H1.778C1.3064 14.2237 0.8542 14.0364 0.5208 13.703C0.1873 13.3695 0 12.9173 0 12.4457V2.667C0 2.1954 0.1873 1.7432 0.5208 1.4097C0.8542 1.0763 1.3064 0.889 1.778 0.889H2.667V0.4445C2.667 0.3266 2.7138 0.2135 2.7971 0.1302C2.8805 0.0468 2.9936 0 3.1114 0ZM1.778 3.1114C1.778 2.8661 1.9949 2.667 2.2625 2.667H11.9613C12.2279 2.667 12.4457 2.8661 12.4457 3.1114V4.0004C12.4457 4.2458 12.2288 4.4449 11.9604 4.4449H2.2625C1.9958 4.4449 1.778 4.2458 1.778 4.0004V3.1114ZM7.5564 7.5564C7.5564 7.4385 7.5095 7.3254 7.4262 7.242C7.3428 7.1587 7.2297 7.1119 7.1119 7.1119C6.994 7.1119 6.8809 7.1587 6.7976 7.242C6.7142 7.3254 6.6674 7.4385 6.6674 7.5564V8.8898H5.3339C5.216 8.8898 5.103 8.9367 5.0196 9.02C4.9362 9.1034 4.8894 9.2164 4.8894 9.3343C4.8894 9.4522 4.9362 9.5653 5.0196 9.6486C5.103 9.732 5.216 9.7788 5.3339 9.7788H6.6674V11.1123C6.6674 11.2302 6.7142 11.3432 6.7976 11.4266C6.8809 11.5099 6.994 11.5568 7.1119 11.5568C7.2297 11.5568 7.3428 11.5099 7.4262 11.4266C7.5095 11.3432 7.5564 11.2302 7.5564 11.1123V9.7788H8.8898C9.0077 9.7788 9.1208 9.732 9.2041 9.6486C9.2875 9.5653 9.3343 9.4522 9.3343 9.3343C9.3343 9.2164 9.2875 9.1034 9.2041 9.02C9.1208 8.9367 9.0077 8.8898 8.8898 8.8898H7.5564V7.5564Z"
                            fill="currentColor" />
                        </svg>
                      </button>
                      <transition name="expand-fade">
                        <div v-if="calendarMenuIndex === index" class="calendar-menu">
                          <button @click="addToICalendar(activity)">iCalendar</button>
                          <button @click="addToGoogleCalendar(activity)">Google Calendar</button>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
                <div class="logos">
                  <!-- Container fixo para o company logo -->
                  <div v-if="activity?.speakers?.length > 0" class="logo-container company-logo-container">
                    <transition name="logo-fade" mode="out-in">
                      <img v-if="
                        activity?.speakers?.[currentLogoIndex?.[activity.id] ?? 0]?.logo_company
                      " :key="'company-' + (currentLogoIndex?.[activity.id] ?? 0)" :src="base_path +
                        activity.speakers[currentLogoIndex[activity.id] ?? 0].logo_company
                        " class="logo-image" />
                    </transition>
                  </div>

                  <div class="logo-container speaker-logo-container">
                    <transition name="logo-fade" mode="out-in">
                      <template v-if="activity?.speakers?.length > 0">
                        <img v-if="
                          activity.speakers[currentLogoIndex?.[activity.id] ?? 0]?.logo_speaker
                        " :key="'speaker-' + (currentLogoIndex?.[activity.id] ?? 0)" :src="base_path +
                          activity.speakers[currentLogoIndex[activity.id] ?? 0].logo_speaker
                          " class="logo-image" />
                      </template>
                      <template v-else-if="activity?.logo_companies?.length > 0">
                        <img v-if="activity.logo_companies[currentLogoIndex?.[activity.id] ?? 0]"
                          :key="'company-' + (currentLogoIndex?.[activity.id] ?? 0)" :src="base_path + activity.logo_companies[currentLogoIndex[activity.id] ?? 0]
                            " class="logo-image" />
                      </template>
                      <template v-else>
                        <div class="logo-default"></div>
                      </template>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!loading && filteredActivities.length == 0" class="no-events">NO EVENTS</div>
        </section>
      </transition>
    </div>
  </div>

  <div class="mobile" v-else>
    <div class="view">
      <!-- <section class="header">
        <h1>SCHEDULE</h1>
        <h3>Join activities and win prizes!</h3>
        <h3>Every activity you participate in automatically enters you into a draw for a chance to get a prize!</h3>
      </section> -->
      <TabsSelection :tabs="days" :activeTab="activeDay" @tab="setActiveDay"></TabsSelection>
      <div class="loading-screen" v-if="loading">
        <div class="loading-spinner"></div>
        <p>Loading Schedule...</p>
      </div>
      <transition name="fade" mode="out-in">
        <section class="eletrolink" :key="activeDay" v-if="!loading">
          <div class="box">
            <h3>Eletrolink <img :src="eletrolinkIcon" alt="Eletrolink Icon" class="eletrolink-icon" /></h3>
            <div class="eletrolink-description" v-if="showEletrolinkInfo">
              {{ eletrolink_description }}
            </div>
            <p>Today's companies:</p>
            <template v-if="filteredEletrocomps.length">
              <transition name="eletrolink-toggle">
                <div v-if="!showEletrolinkInfo" class="row">
                  <div v-for="(eletrocomp, index) in filteredEletrocomps.slice(0, 2)" :key="index" class="eletrocomp">
                    <img :src="base_path + eletrocomp.logo_companies" alt="Eletrocomp Logo" />
                  </div>
                  <div v-if="filteredEletrocomps.length > 2" class="eletrocomp more-indicator">
                    +{{ filteredEletrocomps.length - 2 }} more
                  </div>
                </div>
              </transition>
            </template>

            <!-- Sem transição para o "NO COMPANIES" -->
            <template v-else>
              <transition name="no-companies-fade">
                <div v-if="!showEletrolinkInfo" class="no-companies">NO COMPANIES</div>
              </transition>
            </template>

            <!-- Visão detalhada -->
            <template v-if="filteredEletrocomps.length">
              <transition name="eletrolink-toggle">
                <div v-if="showEletrolinkInfo" class="eletrolink-content-grid">
                  <div v-for="(eletrocomp, index) in filteredEletrocomps" :key="index" class="eletrolink-grid-row">
                    <div class="eletrocomp">
                      <img :src="base_path + eletrocomp.logo_companies" alt="Eletrocomp Logo" />
                    </div>
                    <div class="eletrocomp-text">
                      <div class="eletrocomp-title">
                        <p>{{ eletrocomp.title }}</p>
                      </div>
                      <div class="eletrocomp-location">
                        <p>ELETROLINK ROOM</p>
                      </div>
                      <div class="eletrocomp-time">
                        <p>{{ eletrocomp.date }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </template>

            <!-- Sem transição para o "NO COMPANIES" -->
            <template v-else>
              <transition name="no-companies-fade">
                <div v-if="showEletrolinkInfo" class="no-companies">NO COMPANIES</div>
              </transition>
            </template>
            <button class="info" @click="toggleEletrolinkInfo">
              {{ showEletrolinkInfo ? '-info' : '+info' }}
            </button>
          </div>
        </section>
      </transition>
      <transition name="fade" mode="out-in">
        <section class="timeline-mobile" :key="activeDay" v-if="!loading">
          <div v-if="filteredActivities.length != 0" class="fixed-line"></div>
          <div v-for="(activity, index) in filteredActivities" :key="index" class="activity-mobile">
            <div class="teste">
              <div v-if="filteredActivities.length != 0" class="line-mobile"></div>
              <div class="circle-end-mobile"></div>
            </div>
            <div class="act-column">
              <div class="start-mobile">
                <div class="circle-start-mobile"></div>
                <div class="start-time-mobile">{{ activity.time }}</div>
              </div>
              <div class="content-mobile" :style="eventStyle(activity.type)">
                <div class="column-mobile">
                  <div class="type">
                    <span>{{ activity.type }}</span>
                    <img v-if="getActivityIcon(activity.type)" :src="getActivityIcon(activity.type)"
                      alt="Activity Type Icon" class="type-icon" />
                  </div>
                  <div class="title">{{ activity.title }}</div>
                  <transition name="expand-fade">
                    <div v-if="isExpanded(index)" class="expanded-info">
                      <p class="act_description">{{ activity.description }}</p>
                      <h3>{{ activity.location }}</h3>
                      <p>{{ activity.date }}</p>
                      <div v-if="activity.prize?.name" class="expanded-prize">
                        <p class="prize-label">Participate in this activity and you'll may win:</p>
                        <div class="prize-row">
                          <p class="prize-name">{{ activity.prize.name }}</p>
                          <div class="prize-image-container">
                            <img v-if="activity.prize.image" :src="activity.prize.image" alt="Prize Image"
                              class="prize-image" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                  <div class="actions-row">
                    <button class="info-mobile" @click="toggleActivityInfo(index)">
                      {{ isExpanded(index) ? '-info' : '+info' }}
                    </button>
                    <div class="calendar-dropdown">
                      <button class="calendar-btn" @click.stop="toggleCalendarMenu(index)" title="Add to calendar">
                        <svg class="calendar-icon" viewBox="0 0 14.2237 14.2237" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M3.11144 0C3.22932 0 3.34238 0.0468 3.42574 0.1302C3.5091 0.2135 3.55593 0.3266 3.55593 0.4445V0.889H10.6678V0.4445C10.6678 0.3266 10.7146 0.2135 10.798 0.1302C10.8813 0.0468 10.9944 0 11.1123 0C11.2302 0 11.3432 0.0468 11.4266 0.1302C11.5099 0.2135 11.5568 0.3266 11.5568 0.4445V0.889H12.4457C12.9173 0.889 13.3695 1.0763 13.703 1.4097C14.0364 1.7432 14.2237 2.1954 14.2237 2.667V12.4457C14.2237 12.9173 14.0364 13.3695 13.703 13.703C13.3695 14.0364 12.9173 14.2237 12.4457 14.2237H1.778C1.3064 14.2237 0.8542 14.0364 0.5208 13.703C0.1873 13.3695 0 12.9173 0 12.4457V2.667C0 2.1954 0.1873 1.7432 0.5208 1.4097C0.8542 1.0763 1.3064 0.889 1.778 0.889H2.667V0.4445C2.667 0.3266 2.7138 0.2135 2.7971 0.1302C2.8805 0.0468 2.9936 0 3.1114 0ZM1.778 3.1114C1.778 2.8661 1.9949 2.667 2.2625 2.667H11.9613C12.2279 2.667 12.4457 2.8661 12.4457 3.1114V4.0004C12.4457 4.2458 12.2288 4.4449 11.9604 4.4449H2.2625C1.9958 4.4449 1.778 4.2458 1.778 4.0004V3.1114ZM7.5564 7.5564C7.5564 7.4385 7.5095 7.3254 7.4262 7.242C7.3428 7.1587 7.2297 7.1119 7.1119 7.1119C6.994 7.1119 6.8809 7.1587 6.7976 7.242C6.7142 7.3254 6.6674 7.4385 6.6674 7.5564V8.8898H5.3339C5.216 8.8898 5.103 8.9367 5.0196 9.02C4.9362 9.1034 4.8894 9.2164 4.8894 9.3343C4.8894 9.4522 4.9362 9.5653 5.0196 9.6486C5.103 9.732 5.216 9.7788 5.3339 9.7788H6.6674V11.1123C6.6674 11.2302 6.7142 11.3432 6.7976 11.4266C6.8809 11.5099 6.994 11.5568 7.1119 11.5568C7.2297 11.5568 7.3428 11.5099 7.4262 11.4266C7.5095 11.3432 7.5564 11.2302 7.5564 11.1123V9.7788H8.8898C9.0077 9.7788 9.1208 9.732 9.2041 9.6486C9.2875 9.5653 9.3343 9.4522 9.3343 9.3343C9.3343 9.2164 9.2875 9.1034 9.2041 9.02C9.1208 8.9367 9.0077 8.8898 8.8898 8.8898H7.5564V7.5564Z"
                            fill="currentColor" />
                        </svg>
                      </button>
                      <transition name="expand-fade">
                        <div v-if="calendarMenuIndex === index" class="calendar-menu">
                          <button @click="addToICalendar(activity)">iCalendar</button>
                          <button @click="addToGoogleCalendar(activity)">Google Calendar</button>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
                <div class="logos-mobile">
                  <!-- Container para company logo (só aparece se existir speaker) -->
                  <div v-if="activity?.speakers.length > 0" class="logo-container company-logo-container">
                    <transition name="logo-fade" mode="out-in">
                      <img v-if="
                        activity?.speakers?.[currentLogoIndex?.[activity.id] ?? 0]?.logo_company
                      " :key="'company-' + (currentLogoIndex?.[activity.id] ?? 0)" :src="base_path +
                        activity.speakers[currentLogoIndex[activity.id] ?? 0].logo_company
                        " class="logo-image" />
                    </transition>
                  </div>
                  <!-- Container principal para speaker logo ou fallbacks -->
                  <div class="logo-container speaker-logo-container">
                    <transition name="logo-fade" mode="out-in">
                      <!-- 1. Prioridade: logos_speakers -->
                      <template v-if="activity?.speakers?.length > 0">
                        <img v-if="
                          activity.speakers[currentLogoIndex?.[activity.id] ?? 0]?.logo_speaker
                        " :key="'speaker-' + (currentLogoIndex?.[activity.id] ?? 0)" :src="base_path +
                          activity.speakers[currentLogoIndex[activity.id] ?? 0].logo_speaker
                          " class="logo-image" />
                      </template>
                      <template v-else-if="activity?.logo_companies?.length > 0">
                        <img v-if="activity.logo_companies[currentLogoIndex?.[activity.id] ?? 0]"
                          :key="'company-' + (currentLogoIndex?.[activity.id] ?? 0)" :src="base_path + activity.logo_companies[currentLogoIndex[activity.id] ?? 0]
                            " class="logo-image" />
                      </template>
                      <template v-else>
                        <div class="logo-default"></div>
                      </template>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredActivities.length == 0" class="no-events">NO EVENTS</div>
        </section>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import authHeader from '../services/auth-header'

import panelIcon from '@/assets/icons/panel_icon.svg'
import workshopIcon from '@/assets/icons/workshop_icon.svg'
import keynoteIcon from '@/assets/icons/keynote_icon.svg'
import fifteenIcon from '@/assets/icons/15_15_icon.svg'
import insideTalkIcon from '@/assets/icons/inside_talk_icon.svg'
import eletrolinkIcon from '@/assets/icons/eletrolink-icon.svg'
import pointsIcon from '@/assets/icons/flash_home22.svg'

import TabsSelection from '@/components/TabsSelection.vue'

const isMobile = ref(false)
const base_path = ref(null)

const activeDay = ref(0)
const expandedEvent = ref(null)
const showEletrolinkInfo = ref(false)
const loading = ref(false)
const currentLogoIndex = ref({})
const calendarMenuIndex = ref(null)
let globalInterval = null

const db_activities = ref([
  {
    id: null,
    title: null,
    description: null,
    dayOfWeek: null,
    date: null,
    time: null,
    end_time: null,
    type: null,
    location: null,
    logo_companies: null,
    speakers: null,
  },
])

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY']
const event_days = ['2026-02-09', '2026-02-10', '2026-02-11']
const eletrolink_description =
  'A new, exciting booth where students can engage in 1-on-1 conversations with companies and potentially find their next job or internship.'

const filteredActivities = computed(() => {
  const selectedDay = days[activeDay.value]
  return db_activities.value.filter(
    (activity) =>
      activity.dayOfWeek === selectedDay &&
      activity.type.toLowerCase() !== 'eletrolink' &&
      activity.type.toLowerCase() !== 'job fair',
  )
})

const filteredEletrocomps = computed(() => {
  const selectedDay = days[activeDay.value]
  return db_activities.value.filter(
    (eletrocomp) =>
      eletrocomp.dayOfWeek === selectedDay && eletrocomp.type.toLowerCase() === 'eletrolink',
  )
})

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 800
}

// Mudar o dia ativo
function setActiveDay(index) {
  activeDay.value = index
  expandedEvent.value = null
  showEletrolinkInfo.value = false
}

// Dia atual como padrão
function setDefaultDay() {
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  const index = event_days.findIndex((day) => day === todayString)
  activeDay.value = index !== -1 ? index : 0
}

// Expandir evento
function toggleActivityInfo(index) {
  expandedEvent.value = expandedEvent.value === index ? null : index
}

function isExpanded(index) {
  return expandedEvent.value === index
}

// Mostrar/esconder info eletrolink
function toggleEletrolinkInfo() {
  showEletrolinkInfo.value = !showEletrolinkInfo.value
}

// Map of event types to their icons
const activityTypeIcons = {
  'inside talks': insideTalkIcon,
  '15/15': fifteenIcon,
  'discussion panel': panelIcon,
  'keynote speaker': keynoteIcon,
  'workshop': workshopIcon,
}

function getActivityIcon(type) {
  return activityTypeIcons[type?.toLowerCase()] || keynoteIcon
}

// Map of event types to their accent colors (using global CSS variables)
const eventTypeColors = {
  'inside talks': { color: 'var(--color-violet)', bg: 'rgba(var(--color-violet-rgb), 0.1)' },
  '15/15': { color: 'var(--color-light-pink)', bg: 'rgba(var(--color-light-pink-rgb), 0.1)' },
  'discussion panel': { color: 'var(--color-jeec-blue)', bg: 'rgba(var(--color-jeec-blue-rgb), 0.1)' },
  'keynote speaker': { color: 'var(--color-jeec-blue)', bg: 'rgba(var(--color-jeec-blue-rgb), 0.1)' },
  'workshop': { color: 'var(--color-light-green)', bg: 'rgba(var(--color-light-green-rgb), 0.1)' },
  'opening ceremony': { color: 'var(--c-acc-lighter-dark-blue)', bg: 'rgba(var(--c-acc-lighter-dark-blue-rgb), 0.2)' }
}

// Default color used when a type is not in the map
const defaultEventColor = { color: 'var(--color-jeec-blue)', bg: 'rgba(var(--color-jeec-blue-rgb), 0.1)' }

function getEventColors(type) {
  return eventTypeColors[type?.toLowerCase()] || defaultEventColor
}

// Returns inline CSS variables for a given activity type
function eventStyle(type) {
  const { color, bg } = getEventColors(type)
  return { '--event-color': color, '--event-bg': bg }
}

function parseTime(timeString) {
  const [hours, minutes] = timeString.replace('h', ':').split(':').map(Number)
  return hours * 60 + minutes
}

function hasGap(index) {
  if (index === 0) return false

  const previousEndTime = filteredActivities.value[index - 1].end_time
  const currentStartTime = filteredActivities.value[index].time

  if (!previousEndTime || !currentStartTime) return false

  const previousEndMinutes = parseTime(previousEndTime)
  const currentStartMinutes = parseTime(currentStartTime)

  return currentStartMinutes - previousEndMinutes > 90
}

function formatActivityDate(day, startTime, endTime) {
  const date = new Date(day)
  const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase()
  const dayNum = date.getDate()
  return `${month} ${dayNum} | ${startTime.slice(-12, -7).replace(':', 'h')} - ${endTime.slice(-12, -7).replace(':', 'h')}`
}

function toggleCalendarMenu(index) {
  calendarMenuIndex.value = calendarMenuIndex.value === index ? null : index
}

function closeCalendarMenu() {
  calendarMenuIndex.value = null
}

function getCalendarDates(activity) {
  const dayIndex = days.findIndex((d) => d === activity.dayOfWeek)
  if (dayIndex === -1) return null
  const dateStr = event_days[dayIndex]

  const startParts = activity.time.replace('h', ':').split(':')
  const endParts = activity.end_time.replace('h', ':').split(':')

  const startDT = `${dateStr.replace(/-/g, '')}T${startParts[0].padStart(2, '0')}${startParts[1].padStart(2, '0')}00`
  const endDT = `${dateStr.replace(/-/g, '')}T${endParts[0].padStart(2, '0')}${endParts[1].padStart(2, '0')}00`

  return { startDT, endDT }
}

function addToICalendar(activity) {
  const dates = getCalendarDates(activity)
  if (!dates) return

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JEEC IST//Schedule//EN',
    'BEGIN:VEVENT',
    `DTSTART:${dates.startDT}`,
    `DTEND:${dates.endDT}`,
    `SUMMARY:${activity.title}`,
    `DESCRIPTION:${activity.description || ''}`,
    `LOCATION:${activity.location || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${activity.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`
  a.click()
  URL.revokeObjectURL(url)
  closeCalendarMenu()
}

function addToGoogleCalendar(activity) {
  const dates = getCalendarDates(activity)
  if (!dates) return

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: activity.title,
    dates: `${dates.startDT}/${dates.endDT}`,
    details: activity.description || '',
    location: activity.location || '',
  })

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank')
  closeCalendarMenu()
}

async function fetchData() {
  loading.value = true

  try {
    const [response] = await Promise.all([
      axios.get(import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/get_activity_by_day', {
        headers: authHeader(),
      }),
      new Promise((resolve) => setTimeout(resolve, 200)),
    ])
    const data = response.data
    base_path.value = import.meta.env.VITE_APP_JEEC_BRAIN_URL.replace('ist/', 'ist')
    db_activities.value = data.other_activities.map((activity) => ({
      id: activity.id,
      external_id: activity.external_id,
      title: activity.name,
      description: activity.description,
      day: activity.day,
      dayOfWeek: new Date(activity.day)
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toUpperCase(),
      date: formatActivityDate(activity.day, activity.time, activity.end_time),
      time: activity.time.slice(-12, -7).replace(':', 'h'),
      end_time: activity.end_time.slice(-12, -7).replace(':', 'h'),
      type: activity.activity_type.name,
      location: activity.activity_type.location,
      speakers:
        activity.speakers?.map((speaker) => ({
          ...speaker,
          logo_speaker: speaker.logo_speaker || null,
          logo_company: speaker.logo_company || null,
        })) || [],
      logo_companies: activity.companies || [],
      prize: activity.prize || {},
    }))
  } catch (error) {
    console.error('Erro ao buscar os dados:', error)
  } finally {
    loading.value = false
  }
}

function rotateAllLogos() {
  const activities = filteredActivities.value
  activities.forEach((activity) => {
    const hasMultipleCompanyLogos = activity.logo_companies && activity.logo_companies.length > 1
    const hasMultipleSpeakers = activity.speakers && activity.speakers.length > 1

    if (hasMultipleCompanyLogos || hasMultipleSpeakers) {
      if (currentLogoIndex.value[activity.id] === undefined) {
        currentLogoIndex.value[activity.id] = 0
      } else {
        const maxLength = hasMultipleCompanyLogos
          ? activity.logo_companies.length
          : activity.speakers.length

        currentLogoIndex.value[activity.id] = (currentLogoIndex.value[activity.id] + 1) % maxLength
      }
    }
  })
}

watch(
  filteredActivities,
  (newActivities) => {
    // Limpar intervalo existente
    if (globalInterval) {
      clearInterval(globalInterval)
      globalInterval = null
    }

    // Resetar índices
    currentLogoIndex.value = {}

    // Verificar se há atividades com múltiplos logos
    const hasMultipleLogos = newActivities.some(
      (activity) =>
        (activity.logo_companies && activity.logo_companies.length > 1) ||
        (activity.speakers && activity.speakers.length > 1),
    )

    // Iniciar intervalo global se necessário
    if (hasMultipleLogos) {
      globalInterval = setInterval(rotateAllLogos, 3000)

      // Inicializar todos os índices
      newActivities.forEach((activity) => {
        if (
          (activity.logo_companies && activity.logo_companies.length > 1) ||
          (activity.speakers && activity.speakers.length > 1)
        ) {
          currentLogoIndex.value[activity.id] = 0
        }
      })
    }
  },
  { deep: true },
)

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  document.addEventListener('click', closeCalendarMenu)

  globalInterval = setInterval(rotateAllLogos, 3000)

  setDefaultDay()
  fetchData()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
  document.removeEventListener('click', closeCalendarMenu)

  if (globalInterval) {
    clearInterval(globalInterval)
  }
})
</script>

<style scoped>
/*
  USEM AS VARIÁVEIS, NOMEADAMENTE A --acc-color
  quase nunca deve ser preciso por o código da cor à mão
  todas as cores que vamos precisar estão definidas no global.css

  assim temos consistência no site inteiro e caso marketing
  se lembre de mudar a palete outra vez, é só alterar na variável
*/
.view {
  padding-top: var(--header-height);
}

h1 {
  font-family: var(--font-schedule);
  text-align: center;
  text-shadow: 0px 0px 15px var(--acc-color);
  margin: 2rem auto;
  position: relative;
  width: min-content;
}


.header {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  overflow: hidden;
  padding: 5px;
  width: 100%;
  height: min-content;
  margin-bottom: 20px;
  top: -10px;
}

.header h1 {
  font-size: clamp(2.3rem, 3vw + 1rem, 4rem);
  font-weight: 900;
  color: var(--color-header-blue);
  text-shadow: 0px 0px 20px var(--color-jeec-blue);
  margin: 1rem auto;
}

.header h3 {
  font-family: var(--font-schedule);
  text-shadow: 0px 0px 15px var(--acc-color);
  text-align: center;
  margin: 10px auto;
  position: relative;
  width: 100%;
  font-weight: normal;
  font-size: 1rem;
}

.tabs {
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
  gap: 10px;
  padding: 3px;
  width: 100%;
  top: -10px;
}

.tab {
  text-align: center;
  flex: 1;
  padding-top: 10px;
  padding-bottom: 10px;
  letter-spacing: 0.1em;
  overflow: auto;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  position: relative;
  cursor: pointer;
  width: fit-content;
  transition: all 0.3s ease-in-out;
  font-family: var(--font-schedule);
  opacity: 0.3;
  --tab-color: var(--color-jeec-blue);
}

.tab::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
  transition: opacity 0.1s ease-in-out;
  opacity: 0.3;
  background: radial-gradient(ellipse at top center,
      var(--tab-color) 1%,
      rgba(255, 255, 255, 0) 75%);
  z-index: -3;
}

.tab.active {
  opacity: 1;
  font-size: 0.75rem;
  transform: scale(1.05);
}

.tab:hover::before {
  opacity: 0.5;
}

.tab.active::before {
  opacity: 0.5;
}

.tab:first-child {
  border-radius: 10px 0 0 0;
}

.tab:last-child {
  border-radius: 0 10px 0 0;
}

.tab:not(:first-child):not(:last-child) {
  border-radius: 0;
}

.tab::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-jeec-blue) 0%, var(--color-magenta) 51%, var(--color-light-green) 100%);
  border-radius: inherit;
  background-size: calc(300% + 20px) 100%;
  pointer-events: none;
}

.tab:nth-child(1)::after {
  background-position: 0% 0;
}

.tab:nth-child(2)::after {
  background-position: 50% 0;
}

.tab:nth-child(3)::after {
  background-position: 100% 0;
}

.timeline {
  /* The vertical line sits at the right edge of .time (width: --time-col) */
  --time-col: 20%;
  --line-left: var(--time-col);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  max-width: 1100px;
  margin: auto;
  gap: 40px;
  min-height: 100%;
  margin-top: 20px;
  margin-bottom: 30px;
}

.fixed-line {
  position: absolute;
  left: var(--line-left, 20%);
  top: 0;
  bottom: 0;
  width: 1px;
  background: white;
  border-radius: 1px;
  transform: translateX(-50%);
}

.line {
  width: 1px;
  background: white;
  border-radius: 1px;
  flex-shrink: 0;
  transform: translateX(-50%);
}

.activity {
  display: flex;
  align-content: space-around;
  justify-items: center;
  position: relative;
  width: 100%;
}

.time {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 20%;
  font-size: clamp(0.65rem, 0.5vw + 0.3rem, 0.8rem);
}

.start {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

.start-time {
  position: relative;
  top: -10px;
  color: white;
  font-weight: bold;
  font-family: var(--font-schedule);
}

.end {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

.end-time {
  text-align: right;
  position: relative;
  bottom: -10px;
  color: white;
  font-weight: bold;
  font-family: var(--font-schedule);
}

.circle-start,
.circle-end {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  background: white;
  border-radius: 50%;
}

.circle-start {
  /* Shift right by half its width to center on .time's right edge,
     and up by half its height to align with the top of the time column */
  transform: translate(50%, -50%);
}

.circle-end {
  /* Same horizontal centering, shift down to align with the bottom */
  transform: translate(50%, 50%);
}

.content {
  border-radius: 0px 70px 70px 10px;
  display: flex;
  justify-content: space-between;
  width: 65%;
  align-items: center;
  position: relative;
  margin-left: 30px;
  padding: 0.3rem 0.3rem 0.3rem 0.3rem;
  background: var(--event-bg, rgba(25, 156, 255, 0.1));
  border: 2px solid var(--event-color, var(--c-acc-blue));
}

.column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  justify-content: space-between;
  padding: 10px 5px 0px 10px;
}

.type {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: clamp(1rem, 1.2vw + 0.5rem, 1.3rem);
  color: var(--event-color, var(--c-acc-blue));
  font-family: var(--font-schedule);
}

.type-icon {
  width: clamp(0.9rem, 1.2vw + 0.4rem, 1.2rem);
  height: clamp(0.9rem, 1.2vw + 0.4rem, 1.2rem);
  object-fit: contain;
}

.title {
  font-size: clamp(0.85rem, 1vw + 0.4rem, 1.1rem);
  color: white;
  letter-spacing: 0.05em;
  font-weight: 400;
  font-family: var(--font-schedule);
}

.info {
  background: none;
  color: var(--event-color, var(--c-acc-blue));
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.8rem, 0.5vw + 0.3rem, 0.75rem);
  letter-spacing: 0.05em;
  text-decoration: underline;
  font-weight: 300;
}

.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.calendar-dropdown {
  position: relative;
}

.calendar-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: var(--event-color, var(--c-acc-blue));
  opacity: 0.7;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.calendar-btn:hover {
  opacity: 1;
  transform: scale(1.15);
}

.calendar-icon {
  width: 1.2em;
  height: 1.2em;
}

.calendar-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(20, 20, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 4px;
  z-index: 10;
  min-width: 160px;
}

.calendar-menu button {
  background: none;
  border: none;
  color: white;
  padding: 8px 12px;
  cursor: pointer;
  font-size: clamp(0.65rem, 0.5vw + 0.3rem, 0.8rem);
  text-align: left;
  border-radius: 6px;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.calendar-menu button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.icon {
  font-size: 1em;
}

.logos {
  display: flex;
  flex-shrink: 0;
  position: relative;
  align-items: center;
  align-self: center;
  justify-content: flex-end;
  min-width: clamp(8rem, 12vw, 11.5rem);
}

/* Base logo circle */
.logo-container {
  border-radius: 50%;
  border: 0.125rem solid var(--event-color, var(--c-acc-blue));
  overflow: hidden;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Speaker / main logo — responsive size */
.speaker-logo-container {
  width: clamp(6rem, 9.6vw, 9rem);
  height: clamp(6rem, 9.6vw, 9rem);
}

/* Company badge — positioned inside the reserved space */
.company-logo-container {
  position: absolute;
  width: clamp(2.7rem, 4.2vw, 3.9rem);
  height: clamp(2.7rem, 4.2vw, 3.9rem);
  left: 0;
  bottom: 0;
  z-index: 1;
}

.company-logo-container img {
  object-fit: contain;
}

/* Imagem dentro do container */
.logo-image {
  width: 100%;
  height: 100%;
  background-color: whitesmoke;
  object-fit: contain;
  display: block;
}

.logo-default {
  width: 100%;
  height: 100%;
  background-color: var(--event-color, var(--c-acc-blue));
}

.logo-image {
  object-fit: contain;
}

.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: opacity 0.5s ease;
}

.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
}

.expanded-info {
  font-weight: 300;
  letter-spacing: 0.05rem;
  font-size: clamp(0.65rem, 0.5vw + 0.3rem, 0.8rem);
}

.expanded-info h3 {
  font-family: var(--font-schedule);
  font-weight: 600;
  letter-spacing: 0.05rem;
  font-size: clamp(0.75rem, 0.6vw + 0.35rem, 0.95rem);
}

.act_description {
  margin-top: 10px;
  margin-bottom: 10px;
}

.expanded-prize {
  margin-top: 12px;
  margin-bottom: 12px;
  border-radius: 10px;
}

.prize-label {
  color: var(--event-color, var(--c-acc-blue));
  font-weight: 600;
  margin-bottom: 8px;
}

.prize-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.prize-name {
  font-family: var(--font-schedule);
  font-weight: 700;
  font-size: clamp(0.75rem, 0.55vw + 0.32rem, 0.95rem);
  color: white;
  max-width: 70%;
  flex-shrink: 1;
}

.prize-image-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--event-color, var(--c-acc-blue));
}

.prize-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-events {
  color: white;
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.5rem);
  font-weight: bold;
  text-align: center;
  font-family: var(--font-schedule);
  margin-top: 20px;
}

.eletrolink {
  width: auto;
  padding: 10px;
  display: flex;
  justify-content: center;
}

.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 700px;
  min-width: 300px;
  padding: 15px;
  background: solid;
  background-color: rgba(var(--color-magenta-rgb), 0.1);
  border-radius: 10px;
  border: 2px solid var(--color-magenta);
  gap: 5px;
}

.eletrolink h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-schedule);
  color: var(--color-magenta);
  font-size: clamp(1.2rem, 1.5vw + 0.5rem, 1.6rem);
  letter-spacing: 0.05em;
  font-weight: bold;
}

.eletrolink-icon {
  width: clamp(1.3rem, 1.5vw + 0.4rem, 1.4rem);
  height: clamp(1.3rem, 1.5vw + 0.4rem, 1.4rem);
  object-fit: contain;
}

.eletrolink p {
  color: white;
  letter-spacing: 0.1em;
  font-size: clamp(0.75rem, 0.6vw + 0.35rem, 0.95rem);
}

.points-info {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
}

.points-icon {
  width: clamp(1.5rem, 1.5vw + 0.4rem, 1.4rem);
  height: clamp(1.5rem, 1.5vw + 0.4rem, 1.4rem);
  object-fit: contain;
  align-content: center;
}


.eletrolink button {
  color: var(--color-magenta);
  text-align: left;
}

.eletrolink-description {
  font-size: clamp(0.65rem, 0.5vw + 0.3rem, 0.8rem);
  font-weight: 300;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: var(--font-schedule);
}

.eletrolink-content {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease-in-out;
}

.eletrolink-grid-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 5px;
  gap: 10px;
}

.eletrolink-signup-btn {
  margin-left: auto;
  font-family: 'Lexend Exa';
  background-color: var(--color-magenta);
  color: var(--color-font);
  font-size: clamp(0.6rem, 0.6vw + 0.35rem, 0.95rem);
  font-weight: 500;
  padding: 3px 6px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  text-decoration: none;
  white-space: nowrap;
}

.eletrolink-signup-btn:hover {
  transform: scale(1.05);
  opacity: 0.85;
}

.eletrocomp-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
  width: 50%;
}

.eletrocomp-title p {
  font-size: clamp(0.8rem, 0.8vw + 0.4rem, 1.2rem);
}

.eletrocomp-location p {
  font-size: clamp(0.65rem, 0.6vw + 0.35rem, 0.95rem);
  font-weight: 300;
}

.eletrocomp-time p {
  font-size: clamp(0.55rem, 0.5vw + 0.3rem, 0.8rem);
  font-weight: 300;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 5px;
  gap: 10px;
  width: 100%;
  height: 100%;
}

.eletrocomp {
  overflow: hidden;
  flex: 1;
  padding: 10px;
  background: solid;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  height: 60px;
}

.eletrocomp img {
  height: 100%;
  max-width: 100%;
}

.no-companies {
  color: white;
  font-size: clamp(0.8rem, 0.6vw + 0.4rem, 1rem);
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  font-family: var(--font-schedule);
}

.eletrolink-toggle-enter-active,
.eletrolink-toggle-leave-active {
  transition: all 0.4s ease;
  overflow: hidden;
}

.eletrolink-toggle-enter-from,
.eletrolink-toggle-leave-to {
  opacity: 0;
  max-height: 0;
  max-width: 0;
  transform: scale(0.9, 0.9);
  /* Afeta X e Y */
}

.eletrolink-toggle-enter-to,
.eletrolink-toggle-leave-from {
  opacity: 1;
  max-height: 500px;
  max-width: 600px;
  transform: scale(1, 1);
  /* Escala normal */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.expand-fade-enter-active,
.expand-fade-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-fade-enter-from,
.expand-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0.95);
}

.expand-fade-enter-to,
.expand-fade-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: scaleY(1);
}

.no-companies-fade-enter-active,
.no-companies-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.no-companies-fade-enter-from,
.no-companies-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0.95);
}

.no-companies-fade-enter-to,
.no-companies-fade-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: scaleY(1);
}

/* Estilos para o carrossel mobile */
.mobile .tabs-container {
  position: relative;
  width: 100%;
  padding: 10px 0;
}

.mobile .tabs {
  display: flex;
  gap: 10px;
  gap: 10px;
}

/* Estilos específicos para mobile */
.mobile .timeline-mobile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  gap: 25px;
  min-height: 100%;
  margin-top: 20px;
  margin-bottom: 150px;
  padding: 0 1.5vw;
  /* Padding relativo à largura da tela */
}

.mobile .line-mobile {
  width: 1px;
  background: white;
  border-radius: 1px;
  flex: 1;
  transform: translateX(-50%);
}

.mobile .fixed-line {
  position: absolute;
  left: 1.5vw;
  top: 0;
  bottom: 0;
  width: 1px;
  background: white;
  border-radius: 1px;
  transform: translateX(-50%);
}

.mobile .act-column {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 100%;
}

.mobile .activity-mobile {
  display: flex;
  width: 100%;
  position: relative;
}

.mobile .circle-start-mobile {
  position: relative;
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  background: white;
  border-radius: 50%;
  left: -8px;
  transform: translate(-50%, -4px);
}

.mobile .circle-end-mobile {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  /* Center on the line (left edge of .teste) */
  transform: translateX(-50%);
}

.mobile .start-time-mobile {
  position: relative;
  top: -10px;
  right: 5px;
  color: white;
  font-weight: 600;
  font-family: var(--font-schedule);
  font-size: clamp(0.65rem, 0.5vw + 0.3rem, 0.8rem);
}

.mobile .start-mobile {
  display: flex;
  gap: 5px;
}

.mobile .content-mobile {
  border-radius: 0px 50px 50px 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
  margin-left: 5px;
  top: -5px;
  padding: 0.2rem 0.2rem 0.2rem 0.2rem;
  background: var(--event-bg, rgba(25, 156, 255, 0.1));
  border: 2px solid var(--event-color, var(--c-acc-blue));
}

.mobile .logos-mobile {
  display: flex;
  flex-shrink: 0;
  position: relative;
  align-self: flex-start;
  justify-content: flex-end;
  min-width: clamp(5.5rem, 25vw, 8.5rem);
}

.mobile .speaker-logo-container {
  width: clamp(4.2rem, 21.6vw, 6.75rem);
  height: clamp(4.2rem, 21.6vw, 6.75rem);
}

.mobile .column-mobile {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  align-items: flex-start;
  padding: 10px 5px 0px 10px;
  width: calc(100% - 70px);
}

.mobile .type {
  font-size: clamp(0.7rem, 2vw + 0.3rem, 1rem);
}

.mobile .title {
  font-size: clamp(0.65rem, 1.8vw + 0.25rem, 0.9rem);
}

.mobile .info-mobile {
  background: none;
  color: var(--event-color, var(--c-acc-blue));
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.75rem, 1.5vw + 0.2rem, 0.9rem);
  text-decoration: underline;
  font-weight: 300;
}

.mobile .eletrocomp.more-indicator {
  color: var(--color-background);
  background-color: white;
  font-size: clamp(0.7rem, 1.8vw + 0.3rem, 0.9rem);
  font-weight: bold;
}

.mobile .expanded-info p {
  font-size: clamp(0.7rem, 1.5vw + 0.2rem, 0.7rem);
}

.mobile .expanded-info h3 {
  font-size: clamp(0.75rem, 1.5vw + 0.2rem, 0.7rem);
}

.mobile .act_description {
  margin: 5px 0;
}

.mobile .no-events {
  font-size: 4.5vw;
  margin-top: 5vw;
}

.gap {
  height: 50px;
}

.teste {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.end-of-page {
  height: 20%;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: white;
  text-align: center;
  margin-top: 5%;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid rgba(var(--color-magenta-rgb), 1);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
