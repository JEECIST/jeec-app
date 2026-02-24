<template>
  <div v-if="ready" class="rankings">
    <!-- <div class="main-button-container">
      <button
        @click.stop="click_daily()"
        class="main-button radient-border-passthrough"
        :class="{ active: daily }"
      >
        SOLO
      </button>
      <button
        @click.stop="click_week()"
        class="main-button radient-border-passthrough"
        :class="{ active: !daily }"
      >
        SQUAD
      </button>
      <div class="underline" :class="{ right: !daily }"></div>
    </div> -->

    <TabsSelection :tabs="tabs" :activeTab="activeTab" @tab="setActiveTab"></TabsSelection>

    <div class="spacing"></div>

    <div v-if="daily">
      <div>
        <p class="prize-title daily">TODAY</p>

        <div class="spacing"></div>

        <RankingsPodium :other_rankingdata="students_daily" :user_ranking="userdata_individual.ranking_daily"
          :user_points="userdata_individual.daily_points" :identity="'You'" :flag="true" :extend="false"
          :type="'Student'">
        </RankingsPodium>

        <div class="spacing"></div>
      </div>

      <div>
        <p class="prize-title daily">WEEK</p>

        <div class="spacing"></div>

        <RankingsPodium :other_rankingdata="students_weekly" :user_ranking="userdata_individual.ranking_weekly"
          :user_points="userdata_individual.total_points" :identity="'You'" :flag="true" :extend="true"
          :type="'Student'">
        </RankingsPodium>
      </div>
    </div>
    <div v-else>
      <div>
        <p class="prize-title daily">TODAY</p>

        <div class="spacing"></div>

        <RankingsPodium :other_rankingdata="squads_daily" :user_ranking="userdata_squad.ranking_daily"
          :user_points="userdata_squad.daily_points" :identity="identityy" :flag="user_squad_flag" :extend="true"
          :type="'Squad'">
        </RankingsPodium>

        <div class="spacing"></div>
      </div>

      <div>
        <p class="prize-title daily">WEEK</p>

        <div class="spacing"></div>

        <RankingsPodium :other_rankingdata="squads_weekly" :user_ranking="userdata_squad.ranking_weekly"
          :user_points="userdata_squad.total_points" :identity="identityy" :flag="user_squad_flag" :extend="true"
          :type="'Squad'">
        </RankingsPodium>
      </div>
    </div>
  </div>
  <div style="height: 20vh"></div>
</template>

<script>
import RankingsPodium from '@/components/RankingsPodium.vue'
import UserService from '../services/user.service'
import { useUserStore } from '@/stores/UserStore'
import { mapState } from 'pinia'
import arrow from '../assets/chevron-compact-down.svg'

import TabsSelection from '@/components/TabsSelection.vue'

export default {
  name: 'Rankings',
  components: {
    RankingsPodium,
    TabsSelection,
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },

  data: function () {
    return {
      students_weekly: [],
      students_daily: [],
      userdata_individual: [],
      userdata_squad: [],
      squads_weekly: [],
      squads_daily: [],
      tabs: ["Solo", "Squad"],
      activeTab: 0,
      jeec_brain_url: import.meta.env.VITE_APP_JEEC_BRAIN_URL,
      arrow: arrow,
      show: false,
      daily: true,
      identityy: String,
      rankingdata: [],
      user_squad_flag: true,
      ready: false,
    }
  },
  methods: {
    nameArray() { },
    Personal() {
      this.personal = true
      this.squad = false
    },
    Squad() {
      this.personal = false
      this.squad = true
    },
    ProcessImg(image) {
      let photo = 'data:image/png;base64,' + image
      return photo
    },
    click_daily() {
      this.daily = true
    },
    click_week() {
      this.daily = false
    },
    setActiveTab(index) {
      this.activeTab = index;
      if (index === 0) {
        this.daily = true
      } else {
        this.daily = false
      }
    }
  },
  created() {
    if (!this.user) {
      this.$router.push('/')
    }

    UserService.getAllRanking().then((response) => {
      this.rankingdata = response.data

      this.students_weekly = this.rankingdata.individual_top10_weekly

      this.students_daily = this.rankingdata.individual_top10_daily

      this.userdata_individual = this.rankingdata.individual_ranking

      this.squads_weekly = this.rankingdata.squad_top10_weekly

      this.squads_daily = this.rankingdata.squad_top10_daily

      if (this.rankingdata.squad_ranking == null) {
        this.user_squad_flag = false
        this.identityy = 'merda'
      } else {
        this.user_squad_flag = true
        this.userdata_squad = this.rankingdata.squad_ranking
        this.identityy = 'Your Squad'
        //Already have a condition in endpoint that dont let two squads have the same name

        for (let i = 0; i < this.squads_weekly.length; i++) {
          if (this.squads_weekly[i].name == this.userdata_squad.name) {
            this.squads_weekly[i].name = 'Your Squad'
          }
        }

        for (let i = 0; i < this.squads_daily.length; i++) {
          if (this.squads_daily[i].name == this.userdata_squad.name) {
            this.squads_daily[i].name = 'Your Squad'
          }
        }
      }

      for (let i = 0; i < this.students_weekly.length; i++) {
        if (this.students_weekly[i].username == this.user.username) {
          this.students_weekly[i].name = 'You'
        }
      }

      for (let i = 0; i < this.students_daily.length; i++) {
        if (this.students_daily[i].username == this.user.username) {
          this.students_daily[i].name = 'You'
        }
      }

      this.ready = true
    })
  },
}
</script>

<style scoped>
.spacing {
  height: 3vh;
}

.center {
  display: flex;
  justify-content: center;
}

.main-button-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  gap: 10px;
  position: relative;
  /* necessário */
}

.main-button-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;

  background: linear-gradient(to right,
      transparent,
      var(--color-jeec-blue),
      transparent);
}

.main-button {
  width: 100%;
  font-size: 1.3rem;
  letter-spacing: 1px;
  padding: 0.2rem;
  border: none;
  cursor: pointer;
  background: none;
}

.main-button.active {
  background: none;
  border: 1px solid var(--color-jeec-blue);
  border-radius: 15px 15px 0 0;
  box-shadow: inset 0 0 8px var(--color-jeec-blue);
  /* sombra interna */
}

/* 🔥 underline animado */
.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 2px;
  background: linear-gradient(to right,
      transparent,
      var(--color-jeec-blue),
      transparent);
  transition: transform 0.35s ease;
}

.underline.right {
  transform: translateX(100%);
}

.prize-title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
}

.weekly {
  color: #f72585;
  text-shadow: 0px 0px 15px #f72585;
}

.daily {
  color: #4cc9f0;
  text-shadow: 0px 0px 15px #4cc9f0;
}
</style>
