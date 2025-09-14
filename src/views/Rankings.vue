<template>
  <div v-if="ready" class="rankings">
    <div class="main-button-container">
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
    </div>

    <div class="spacing"></div>

    <div v-if="daily">
      <div>
        <p class="prize-title daily">TODAY</p>

        <div class="spacing"></div>

        <RankingsPodium
          :other_rankingdata="students_daily"
          :user_ranking="userdata_individual.ranking_daily"
          :user_points="userdata_individual.daily_points"
          :identity="'You'"
          :flag="true"
          :type="'Student'"
        >
        </RankingsPodium>

        <div class="spacing"></div>
      </div>

      <div>
        <p class="prize-title daily">WEEK</p>

        <div class="spacing"></div>

        <RankingsPodium
          :other_rankingdata="students_weekly"
          :user_ranking="userdata_individual.ranking_weekly"
          :user_points="userdata_individual.total_points"
          :identity="'You'"
          :flag="true"
          :type="'Student'"
        >
        </RankingsPodium>
      </div>
    </div>
    <div v-else>
      <div>
        <p class="prize-title daily">TODAY</p>

        <div class="spacing"></div>

        <RankingsPodium
          :other_rankingdata="squads_daily"
          :user_ranking="userdata_squad.ranking_daily"
          :user_points="userdata_squad.daily_points"
          :identity="identityy"
          :flag="user_squad_flag"
          :type="'Squad'"
        >
        </RankingsPodium>

        <div class="spacing"></div>
      </div>

      <div>
        <p class="prize-title daily">WEEK</p>

        <div class="spacing"></div>

        <RankingsPodium
          :other_rankingdata="squads_weekly"
          :user_ranking="userdata_squad.ranking_weekly"
          :user_points="userdata_squad.total_points"
          :identity="identityy"
          :flag="user_squad_flag"
          :type="'Squad'"
        >
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

export default {
  name: 'Rankings',
  components: {
    RankingsPodium,
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
    nameArray() {},
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
  height: 5vh;
}

.center {
  display: flex;
  justify-content: center;
}

.main-button-container {
  display: flex;
  justify-content: space-around;
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  gap: 10px;
}

.main-button {
  width: 100%;
  font-size: 1.3rem;
  padding: 0.3rem;
  border: none;
  cursor: pointer;
  --background: none;
  --border-width: 2px 0 0 0;
}

.main-button:first-of-type {
  --border-background: linear-gradient(100deg, #4cc9f0, #7209b7);
  --border-radius: 20px 0 0 0;
}

.main-button:last-of-type {
  --border-background: linear-gradient(100deg, #7209b7, #f72585);
  --border-radius: 0 20px 0 0;
}

.main-button.active {
  font-size: 1.4rem;
  font-weight: 700;
  --background: radial-gradient(ellipse 60% 120% at 50% 0, #4ccaf032, #7109b70e 90%, #7109b700);
}

.main-button::before {
  content: '';
}

.prize-title {
  text-align: center;
  padding-bottom: 10px;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 5px;
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
