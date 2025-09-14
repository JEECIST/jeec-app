<template>
  <div class="squad-section">
    <div class="squad-container">
      <div class="squad-header">
        <div class="squad-texts">
          <p class="squad-name">{{ squad.name }}</p>
          <div class="squad-motto-wrapper">{{ squad.cry }}</div>
        </div>
        <div class="squad-image-wrapper">
          <div class="squad-image">
            <img :src="jeec_brain_url + squad.image" alt="squad-image" />
          </div>
        </div>
      </div>

      <div class="jeecpot-wrapper" v-if="event && squad">
        <JEECPOTSquad :progress="progress()" />
      </div>

      <div class="squad-members">
        <h3 class="squad-sub-title">Members</h3>
        <!-- <Member v-for="member in orderedMembers" :key="member.username" :member="member"
          :captain_ist_id="squad.captain_ist_id" @kick="kick_member" /> -->

        <div v-if="squad && squad.members && squad.members.data" class="squad-members">
          <Member v-for="member in squad.members.data" :key="member.ist_id" :member="member" />
        </div>

        <!-- <button v-if="squad.members.data.length < 4 && !loading_add" @click.stop="add_members_dialog = true" -->
        <div
          class="squad-add-members member"
          v-if="
            squad &&
            squad.members &&
            squad.members.data &&
            squad.members.data.length < 4 &&
            !loading_add
          "
        >
          <div class="add-members-row" @click.stop="change_add_member_dialog">
            <div class="member-image plus-circle">
              <img
                v-if="!add_members_dialog"
                src="@/assets/add-member-button.png"
                alt="Add Member Icon"
                class="plus-icon-image"
              />
              <img
                v-else
                src="@/assets/minus.png"
                alt="Close Add Member"
                class="minus-icon-image"
              />
            </div>
            <p class="add-members-text">ADD MEMBERS</p>
          </div>

          <div v-if="add_members_dialog" class="squad-add-members-dialog">
            <input
              v-model="search"
              type="text"
              placeholder="Search username..."
              class="search-input"
            />
            <div class="join-decline">
              <button class="join" @click.stop="invite">Invite</button>
              <button class="decline" @click.stop="change_add_member_dialog">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <button @click.stop="leave_squad" class="squad-leave">
        <img :src="leave_squad_button" alt="Leave Squad Icon" />
      </button>
    </div>
  </div>
</template>

<script>
import Invite from '@/components/Squads/Invite.vue'
import SquadCreation from '@/components/Squads/SquadCreation.vue'
import Member from '@/components/Squads/Member.vue'
import JEECPOTSquad from '@/components/UserCard/JEECPOTSquad.vue'

import UserService from '../../services/user.service'
import { useUserStore } from '@/stores/UserStore'
import { mapState } from 'pinia'

import jeec_colour_no_edition_transparent from '@/assets/jeec_colour_no_edition_transparent.svg'
import squad_leave from '@/assets/squad-leave.svg'
import plus_sign from '@/assets/plus_sign.png'

export default {
  username: 'Squad',
  components: {
    Invite,
    SquadCreation,
    Member,
    JEECPOTSquad,
  },
  props: {
    squad: Object,
  },
  emits: ['delete', 'notification'],
  data: function () {
    return {
      button: 'my squad',
      invites: [],
      invites_sent: [],
      students3: [],
      loading_squad: true,
      jeec_brain_url: import.meta.env.VITE_APP_JEEC_BRAIN_URL,
      daily_max_points: 0,
      weekly_max_points: 0,
      squadmates: [],
      add_members_dialog: false,
      students: [],
      search: '',
      today_reward: {},
      event: {},
      default_image: jeec_colour_no_edition_transparent,
      width: window.innerWidth,
      loading_delete: false,
      loading_add: false,
      squads_aux: null,
      length: 0,
      champion_week: false,
      champion_daily: false,
      hover: false,
      members_with_squad: null,
      invited_members: null,
      leave_squad_button: squad_leave,
      plus_squad_button: plus_sign,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      students2: [],
      photos: [],
      message: '',
      type: '',
    }
  },
  methods: {
    handleClickOutside(event) {
      if (this.$refs.dialog && !this.$refs.dialog.contains(event.target)) {
        this.add_members_dialog = false
      }
    },
    showNotification(message, type) {
      this.message = message
      this.type = type

      this.$emit('notification', this.message, this.type)
    },

    invite() {
      UserService.inviteSquad(this.search).then(
        (response) => {
          this.loading_add = false
          this.showNotification('Invitation sent!', 'success')
          this.change_add_member_dialog()
        },
        (error) => {
          console.log(error)
          this.loading_add = false
          this.showNotification('Error sending invitation', 'error')
        },
      )

      this.$emit('delete')
    },

    leave_squad() {
      if (!confirm('Are you sure you want to leave the squad?')) {
        return
      }
      this.loading_squad = true
      UserService.leaveSquad().then(
        (response) => {
          this.$emit('delete')
          this.loading_squad = false
          this.$router.go()
        },
        (error) => {
          console.log(error)
          this.loading_squad = false
        },
      )
    },
    change_add_member_dialog() {
      this.add_members_dialog = !this.add_members_dialog
      this.search = ''
    },
    progress() {
      if (this.event && this.squad) {
        return Math.round((this.squad.total_points / this.event.squad_points) * 100)
      }
      return 0
    },
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    orderedMembers() {
      let members = [...this.squad.members.data]
      let captainIndex = members.findIndex((member) => member.is_captain)
      if (captainIndex > 0) {
        let [captain] = members.splice(captainIndex, 1)
        members.unshift(captain)
      }
      return members
    },
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)

    UserService.getEventInfo().then(
      (response) => {
        this.event = response.data
        console.log('event total poits', this.squad.total_points, this.event.squad_points)
      },
      (error) => {
        console.log(error)
      },
    )
  },
}
</script>

<style scoped>
.squad-section {
  padding-bottom: 120px;
  overflow: hidden;
}

.squad-container {
  background-color: #199cff1a;
  border: 1.5px solid #199cff;
  border-radius: 20px 60px 20px 20px;
  padding: 1rem 1.5rem;
  width: 90%;
  max-width: 650px;
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  font-family: 'Lexend', sans-serif;
  box-sizing: border-box;
  position: relative;
}

.squad-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.squad-texts {
  flex: 1;
}

.squad-name {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-align: left;
  letter-spacing: 0.1em;
}

.squad-motto-wrapper {
  font-size: 1rem;
  color: white;
  margin-top: 0.4rem;
  padding: 0.3rem 1rem;
  border: 2px solid #199cff;
  border-radius: 15px;
  font-family: 'Lexend', sans-serif;
  max-width: fit-content;
  text-align: left;
  align-self: flex-start;
}

.squad-image {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #199cff;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.squad-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.squad-sub-title {
  font-size: 1.05rem;
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 500;
  color: white;
  letter-spacing: 0.05em;
  margin: 0.4rem 0 0.3rem 0.1rem;
  text-align: left;
}

.squad-members {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.squad-add-members {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.add-members-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  margin-left: 0.1rem;
}

.plus-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #199cff;
  border: 2px solid #199cff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.plus-icon-image,
.minus-icon-image {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.minus-icon-image {
  filter: invert(1);
}

.add-members-text {
  font-size: 1.05rem;
  font-family: 'Lexend Exa', sans-serif;
  color: #199cff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  font-weight: 600;
}

.squad-add-members-dialog {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 0.6rem;
  margin-left: 0.1rem;
  padding-bottom: 5rem;
}

.squad-add-members-dialog .search-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 2px solid #199cff;
  background-color: transparent;
  font-family: 'Lexend Exa', sans-serif;
  font-size: 0.95rem;
  color: white;
  outline: none;
  transition: border-color 0.2s ease;
}

.squad-add-members-dialog .search-input::placeholder {
  color: #aaa;
  font-family: 'Lexend Exa', sans-serif;
  font-size: 0.9rem;
}

.squad-add-members-dialog .search-input:focus {
  border-color: #1a9cd8;
}

.join-decline {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.join-decline button {
  padding: 0.4rem 0.8rem;
  font-size: 0.95rem;
  border-radius: 50px;
  font-family: 'Lexend Exa';
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  min-width: 100px;
  text-align: center;
}

.join-decline button.join {
  background-color: #199cff;
  color: white;
  border: none;
}

.join-decline button.decline {
  background-color: transparent;
  color: white;
  border: 1.5px solid #199cff;
}

.join-decline button:hover {
  transform: scale(1.03);
}

.plus-icon-image {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.minus-icon-image {
  width: 16px;
  height: 16px;
  object-fit: contain;
  filter: invert(1);
}

.buttons-conteiner {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.buttons-conteiner > button {
  width: 100%;
  max-width: 100px;
  height: 25px;
  border-radius: 10px;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
}

.buttons-conteiner button.invite {
  background-color: #199cff;
  color: white;
  border: none;
}

.buttons-conteiner button.cancel {
  background-color: transparent;
  color: white;
  border: 1.5px solid #199cff;
}

.squad-add-click {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

.squad-add-click:hover {
  scale: 1.02;
}

.plus-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #199cff;
  border: 2px solid #199cff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.plus-circle p {
  margin: 0;
  padding: 0;
  line-height: 1;
  transform: translateY(-2px);
}

.add-members-text {
  font-size: 1.05rem;
  font-family: 'Lexend Exa', sans-serif;
  color: #199cff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  font-weight: 600;
}

.squad-leave {
  position: absolute;
  bottom: 20px;
  right: 7px;
  width: 60px;
  height: 60px;
  background: none;
  border: 2px solid #199cff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.squad-leave:hover {
  transform: scale(1.1);
}

.squad-leave img {
  width: 34px;
  height: 34px;
  filter: invert(57%) sepia(96%) saturate(3276%) hue-rotate(181deg) brightness(103%) contrast(103%);
  margin-left: 5px;
}

.jeecpot-wrapper {
  margin: 0.7rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
