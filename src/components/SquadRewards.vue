<template>
  <!-- Property of Duarte Santos -->
  <div class="squads-rewards" v-if="squads_rewards" style="height: auto">
    <div class="day-box" v-if="now.getDay() == 1 && squads_rewards[0]">
      <div class="today-name">Today</div>
      <div class="today-prize">
        <div class="today-squad-rank">
          <p><b>Prize:</b></p>
          <p v-if="squad != null">
            <small> {{ daily_max_points - squad_points }} xp to 1<sup>st</sup>! </small>
          </p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[0].reward.image" />
      </div>
    </div>
    <div class="day-box" v-if="now.getDay() != 1 && squads_rewards[0]">
      <div class="day-name">Monday</div>
      <div class="day-prize">
        <div class="squad-rank">
          <p><b>Prize:</b></p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[0].reward.image" />
      </div>
    </div>

    <div class="day-box" v-if="now.getDay() == 2 && squads_rewards[1]">
      <div class="today-name">Today</div>
      <div class="today-prize">
        <div class="today-squad-rank">
          <p><b>Prize:</b></p>
          <p v-if="squad != null">
            <small> {{ daily_max_points - squad_points }} xp to 1<sup>st</sup>! </small>
          </p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[1].reward.image" />
      </div>
    </div>
    <div class="day-box" v-if="now.getDay() != 2 && squads_rewards[1]">
      <div class="day-name">Tuesday</div>
      <div class="day-prize">
        <div class="squad-rank">
          <p><b>Prize:</b></p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[1].reward.image" />
      </div>
    </div>

    <div class="day-box" v-if="now.getDay() == 3 && squads_rewards[2]">
      <div class="today-name">Today</div>
      <div class="today-prize">
        <div class="today-squad-rank">
          <p><b>Prize:</b></p>
          <p v-if="squad != null">
            <small> {{ daily_max_points - squad_points }} xp to 1<sup>st</sup>! </small>
          </p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[2].reward.image" />
      </div>
    </div>
    <div class="day-box" v-if="now.getDay() != 3 && squads_rewards[2]">
      <div class="day-name">Wednesday</div>
      <div class="day-prize">
        <div class="squad-rank">
          <p><b>Prize:</b></p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[2].reward.image" />
      </div>
    </div>

    <div class="day-box" v-if="now.getDay() == 4 && squads_rewards[3]">
      <div class="today-name">Today</div>
      <div class="today-prize">
        <div class="today-squad-rank">
          <p><b>Prize:</b></p>
          <p v-if="squad != null">
            <small> {{ daily_max_points - squad_points }} xp to 1<sup>st</sup>! </small>
          </p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[3].reward.image" />
      </div>
    </div>
    <div class="day-box" v-if="now.getDay() != 4 && squads_rewards[3]">
      <div class="day-name">Thursday</div>
      <div class="day-prize">
        <div class="squad-rank">
          <p><b>Prize:</b></p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[3].reward.image" />
      </div>
    </div>

    <div class="day-box" v-if="now.getDay() == 5 && squads_rewards[4]">
      <div class="today-name">Today</div>
      <div class="today-prize">
        <div class="today-squad-rank">
          <p><b>Prize:</b></p>
          <p v-if="squad != null">
            <small> {{ daily_max_points - squad_points }} xp to 1<sup>st</sup>! </small>
          </p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[4].reward.image" />
      </div>
    </div>
    <div class="day-box" v-if="now.getDay() != 5 && squads_rewards[4]">
      <div class="day-name">Friday</div>
      <div class="day-prize">
        <div class="squad-rank">
          <p><b>Prize:</b></p>
        </div>
        <img class="reward-img" :src="jeec_brain_url + squads_rewards[4].reward.image" />
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'SquadRewards',
  props: {
    squad: Object,
    squads_rewards: Array,
    squad_points: Number,
  },
  data() {
    return {
      model: 0,
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      jeec_brain_url: import.meta.env.VITE_APP_JEEC_BRAIN_URL,
      now: new Date(),
    }
  },
  computed: {
    window_width() {
      return window.innerHeight
    },
    selected_date() {
      return this.squads_rewards[this.model]
        ? new Date(this.squads_rewards[this.model].date.substring(0, 11))
        : null
    },
  },
  methods: {
    image_index(i) {
      return (i + this.squads_rewards.length) % this.squads_rewards.length
    },
    rewardClass(index) {
      if (this.squads_rewards[index].winner) return 'win_reward'

      var selected_date = this.squads_rewards[index]
        ? new Date(this.squads_rewards[index].date.substring(0, 11))
        : null

      var millisecondsPerDay = 1000 * 60 * 60 * 24
      var millisBetween = this.now.getTime() - selected_date.getTime()
      var days = millisBetween / millisecondsPerDay

      days = Math.floor(days)

      if (days > 0) return 'lost_reward'
      else if (days < 0) return 'future_reward'
      else return 'current_reward'
    },
  },
  created() {
    var now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var event_day = this.squads_rewards
      .map((day) => new Date(day.date.substring(0, 11)).getTime())
      .indexOf(now.getTime())
    this.model = event_day !== -1 ? event_day : 0

    UserService.getDailySquadsRanking().then(
      (response) => {
        let daily_squads = response.data.data
        if (!Array.isArray(this.daily_squads)) this.daily_squads = [this.daily_squads]
        this.loading_daily = false
        this.daily_max_points = daily_squads[0].daily_points
        this.weekly_max_points = daily_squads[0].total_points
      },
      (error) => {
        
        this.loading_daily = false
      },
    )
  },
}
</script>

<style scoped>
.squads-rewards {
  font-weight: 600;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-bottom: 10vh;
}

.day-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5vh;
}

.day-name {
  width: 90vw;
  height: 39px;
  background-color: rgba(26, 156, 216, 0.4);
  border-radius: 35px 35px 0px 0px;
  text-align: center;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 39px;
  letter-spacing: 0.01em;
  color: #03618c;
}

.today-name {
  width: 90vw;
  height: 39px;
  background-color: #03618c;
  border-radius: 35px 35px 0px 0px;
  text-align: center;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 39px;
  letter-spacing: 0.01em;
  color: #ffffff;
}

.day-prize {
  width: 90vw;
  height: auto;
  background-color: rgba(26, 156, 216, 0.2);
  border-radius: 0px 0px 35px 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.today-prize {
  width: 90vw;
  height: auto;
  background-color: #1a9cd8;
  border-radius: 0px 0px 35px 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.reward-img {
  border-radius: 50%;

  position: relative;
  width: 12.5vh;
  height: 12.5vh;

  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 3px solid #03618c;
}

.squad-rank {
  margin-top: 5vh;
  margin-bottom: 5vh;
  width: auto;
}

.squad-rank p {
  color: #03618c;
  text-align: left;
  font-family: 'Montserrat';
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 0;
}

.today-squad-rank {
  margin-top: 5vh;
  margin-bottom: 5vh;
  width: auto;
}

.today-squad-rank p {
  color: #ffffff;
  text-align: left;
  font-family: 'Montserrat';
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 0;
}

@media screen and (max-width: 1100px) {
  .first,
  .third,
  .rect,
  .browser {
    display: none;
  }
}

@media screen and (min-width: 1100px) {
  .mobile {
    display: none;
  }

  .squads-rewards {
    margin-top: 18vh !important;
  }
}
</style>
