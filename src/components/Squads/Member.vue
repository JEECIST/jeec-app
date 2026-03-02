<template>
  <div class="member" v-if="not_kick">
    <div class="member-image">
      <img :src="member.photo" alt="profile photo" class="profile-photo" />
    </div>
    <div class="member-info">
      <p class="name">{{ member.name }}</p>
      <p v-if="member.is_captain" class="captain">Captain</p>
    </div>
    <button
      class="kick-member"
      v-if="can_kick && !loading_kick && !member.is_captain"
      @click.stop="kick"
    >
      <div></div>
      <div></div>
    </button>
  </div>
</template>

<script>
import UserService from '../../services/user.service'
import { useUserStore } from '@/stores/UserStore'
import { mapState } from 'pinia'
import recycle_icon from '@/assets/icons/recycle-icon.svg'

export default {
  name: 'Member',
  props: {
    member: Object,
  },
  data: function () {
    return {
      loading_kick: false,
      kick_img: recycle_icon,
      not_kick: true,
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    nameArray() {
      var names = this.member.username

      if (names.length > 1) return names
      else return [this.member.username, '']
    },

    can_kick() {
      return false
    },
  },
  methods: {
    kick() {
      if (!confirm('Are you sure you want to proceed?')) {
        return
      }

      this.not_kick = false

      this.loading_kick = true

      UserService.kickMember(this.member.username).then(
        (response) => {
          var squad = response.data.data
          this.$emit('kick', squad)
        },
        (error) => {
          
          this.loading_kick = false
        },
      )
    },
  },
}
</script>

<style scoped>
.member {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alinha os itens à esquerda */
  gap: 0.7rem;
  margin-top: 0rem;
  margin-left: 0.1rem;
}

.member-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #199cff;
  flex-shrink: 0;
}

.member-image::before {
  content: '';
}

.member-image img {
  height: 100%;
  width: 100%;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-info p {
  font-family: 'Lexend Exa';
}

.member-info .captain {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
}

.member-info .name {
  font-size: 1.05rem;
  font-family: 'Lexend Exa', sans-serif;
  color: white;
  margin: 0;
}

.member-info .username {
  font-size: 0.75rem;
  font-family: 'Lexend Exa', sans-serif;
  color: #1a9cd8;
  margin: 0;
}

.kick-member {
  position: absolute;
  left: 4%;
  top: 50%;
  translate: -50% -50%;
  height: fit-content;
  cursor: pointer;
  background: none;
  border: none;
  height: 30px;
  width: 30px;
}

.kick-member:hover {
  scale: 1.1;
}

.kick-member div {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  height: 5px;
  width: 24px;
  border-radius: 10px;
  rotate: 45deg;
  transform-origin: 50% 50%;
  background-color: #f72585;
  box-shadow: 0 0 3px #f72585;
}

.kick-member div:last-child {
  rotate: -45deg;
}
</style>
