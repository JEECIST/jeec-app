<template>
  <div class="squad-invite">
    <h3>You've been invited to</h3>

    <div class="invite">
      <div class="squad-header">
        <div class="squad-image">
          <img :src="jeec_brain_url + invite.squad_image" alt="squad-image" />
        </div>
        <div class="squad-info">
          <p>Squad {{ invite.squad_name }}</p>
        </div>
      </div>
    </div>

    <div v-if="!loading" class="join-decline">
      <button class="join" @click.stop="accept">Join</button>
      <button class="decline" @click.stop="reject">Decline</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Invite',
  props: {
    invite: Object,
  },
  emits: ['accept', 'reject'],
  data: function () {
    return {
      jeec_brain_url: import.meta.env.VITE_APP_JEEC_BRAIN_URL,
      loading: false,
    }
  },
  methods: {
    accept() {
      this.loading = true
      this.$emit('accept', this.invite.external_id)
    },
    reject() {
      this.loading = true
      this.$emit('reject', this.invite.external_id)
    },
  },
}
</script>

<style scoped>
.squad-invite {
  background-color: rgba(25, 156, 255, 0.1);
  border: 1.5px solid #199cff;
  border-radius: 20px;
  padding: 1rem 1.5rem;
  width: 90%;
  max-width: 650px;
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.squad-invite h3 {
  font-family: 'Lexend Exa';
  font-size: 0.9rem;
  font-weight: 500;
  color: #e7e7e7;
  text-align: center;
  margin-bottom: 0.8rem;
}

.squad-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1rem;
}

.squad-image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 2px solid #199cff;
  overflow: hidden;
  flex-shrink: 0;
}

.squad-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.squad-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  color: white;
}

.squad-info p {
  font-family: 'Lexend Exa';
  margin: 0;
  line-height: 1.2;
}

.squad-info p:first-child {
  font-weight: 500;
  font-size: 1.1rem;
}

.squad-info p:last-child {
  font-size: 0.9rem;
  color: #e7e7e7;
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
  text-transform: none;
  white-space: nowrap;
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
</style>
