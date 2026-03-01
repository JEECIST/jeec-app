<template>
  <div class="create-squad">
    <div class="create-modal">

      <div>
        <h1 class="title">Create a squad</h1>
        <button class="avatar" @click.stop="input_click" aria-label="Upload squad picture">
          <img :src="currentImage" :alt="image_uploaded ? 'Squad' : 'Default squad'"
            :class="image_uploaded ? 'uploaded-img' : 'default-img'" />
          <span v-if="!image_uploaded" class="avatar-plus">+</span>

          <input type="file" accept="image/*" ref="image_input" @change="input_file" style="display: none" />
        </button>

        <div class="field">
          <input id="squad-name" class="name-input" :class="{ input_exists: name.length }" type="text" v-model="name"
            maxlength="25" minlength="2" placeholder="Your squad name" />
        </div>

        <button class="create-btn" :disabled="loading || name.trim().length < 4" @click="create_squad">
          Create Squad
        </button>
      </div>

      <p class="error-msg" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>

import UserService from '../../services/user.service'
import jeec_mobile_white from '../../assets/jeec_mobile_white.svg'

export default {
  name: 'SquadCreation',

  emits: ['back'],

  data() {
    return {
      files: [],
      image_uploaded: false,
      currentImage: jeec_mobile_white,

      name: '',
      squad: null,
      slots: [null, null, null, null],
      pickingIndex: null,
      memberQuery: '',
      members: [],


      error: '',
      loading: false,
    }
  },

  computed: {

  },

  mounted() {

    UserService.getUserStudent().then(
      (response) => {
        var s = response.data.data
        this.slots.splice(0, 1, {
          id: s.username || s.id || 0,
          name: s.name || 'You',

          avatar: s.photo || s.profile_picture || s.avatar || '',
        })
      },
      () => {
        this.slots.splice(0, 1, { id: 0, name: 'You', avatar: '' })
      },
    )
  },

  methods: {

    input_click() {
      if (this.$refs.image_input) this.$refs.image_input.click()
    },


    input_file(event) {
      this.files = (event && event.target && event.target.files) ? event.target.files : []

      if (this.files.length === 1) {
        var reader = new FileReader()
        reader.onload = (e) => {
          this.currentImage = e.target.result
          this.image_uploaded = true
        }
        reader.readAsDataURL(this.files[0])
      }
    },


    async create_squad() {
      this.error = ''

      var trimmedName = this.name.trim()
      if (trimmedName.length < 4) {
        this.error = 'Squad name must be at least 4 characters'
        return
      }

      this.loading = true

      try {
        var formData = new FormData()
        formData.append('name', trimmedName)


        if (this.files && this.files.length > 0) {
          formData.append('file', this.files[0])
        }

        const response = await UserService.createSquad(formData)

        this.squad = { name: trimmedName }

        this.finalise_squad()

      } catch (err) {
        alert("Could not create squad, please talk with our staff!")
      } finally {
        this.loading = false
      }

    },

    finalise_squad() {
      this.$emit('back')
    },
  },
}

</script>

<style scoped>
.create-squad {
  width: 100%;
  max-width: 420px;
  margin: 1.5rem auto;
  padding: 1.2rem 1.2rem 1.6rem;
  border-radius: 22px;

  display: flex;
  justify-content: center;
  font-family: "Lexend Exa", sans-serif;

  background: transparent;
}

.create-modal {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  margin: .2rem 0 0;
  font-weight: 100;
  font-size: 1.8rem;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
}

.avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  border: 1px solid #199cff;
  background: transparent;

  display: grid;
  place-items: center;
  position: relative;
  padding: 0;
  cursor: pointer;

  margin-top: 1.2rem;
  margin-left: auto;
  margin-right: auto;
}

/* Base styles for the image regardless of state */
.avatar img {
  display: block;
  box-sizing: border-box;
}

/* Styles specifically for the default JEEC logo (SVG fix) */
.default-img {
  width: 54px;
  /* Strict width prevents the SVG from exploding */
  height: 54px;
  object-fit: contain;
  /* No border-radius needed here since the logo just floats in the middle */
}

/* Styles specifically for user-uploaded photos */
.uploaded-img {
  position: absolute;
  /* Detaches it from the grid so it can't stretch the container */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
  object-fit: cover;
  /* Ensures the image fills the circle without squishing */
}

.avatar-default {
  opacity: 0.9;
}

.avatar-plus {
  position: absolute;
  left: -2px;
  bottom: -6px;

  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #199cff;
  color: white;

  display: block;
  place-items: center;
  font-size: 1.1rem;
}

.field-label {
  margin: 0.9rem 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
}

.name-input {
  min-width: 240px;
  text-align: center;

  background: transparent;
  border: none;
  outline: none;

  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.85);
  padding: 1.5rem 0 0.35rem;

  border-bottom: 1px solid rgba(25, 156, 255, 0.45);
  font-family: inherit;
}

.name-input::placeholder {
  font-family: inherit;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
}

.section-label {
  width: 100%;
  margin: 0 0 0.55rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
  text-align: left;
}

.squad-card {
  width: min(520px, 92%);
  margin: 14px auto 0;
  padding: 16px 18px 18px;
  border-radius: 18px;

  background: linear-gradient(180deg,
      rgba(10, 24, 55, 0.90) 0%,
      rgba(7, 14, 32, 0.88) 55%,
      rgba(6, 10, 22, 0.92) 100%);

  border: 1.5px solid transparent;
  background-clip: padding-box;
  position: relative;

  box-shadow:
    0 0 0 1px rgba(46, 85, 255, 0.10) inset,
    0 0 18px rgba(46, 85, 255, 0.12),
    0 0 26px rgba(184, 161, 255, 0.10);
}

.squad-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 18px;
  padding: 1.5px;
  /* border thickness */
  background: linear-gradient(90deg,
      rgba(46, 85, 255, 0.45) 0%,
      rgba(184, 161, 255, 0.95) 100%);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.squad-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.squad-big-avatar {
  width: 68px;
  height: 68px;
  border-radius: 999px;
  border: 1px solid rgba(46, 85, 255, 0.45);
  overflow: hidden;
  flex: 0 0 auto;
}

.squad-big-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.squad-name {
  font-weight: 700;
  letter-spacing: .02em;
  text-transform: uppercase;
  font-size: 16px;
  color: #B8A1FF;
  text-shadow:
    0 0 6px rgba(184, 161, 255, .55),
    0 0 14px rgba(184, 161, 255, .30);
}

.member-grid {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.member-slot {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: center;
  width: 100%;
}

.member-circle {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 1px solid rgba(46, 85, 255, 0.45);
  background: rgba(8, 14, 20, 0.35);
  display: grid;
  place-items: center;
  margin: 0 auto;
}

.member-circle img {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
  display: block;
}

.member-circle .plus {
  font-size: 24px;
  line-height: 1;
  opacity: 0.9;
}

.creator-slot {
  cursor: default;
}

.creator-circle {
  border-color: rgba(184, 161, 255, 0.65);
  background: rgba(184, 161, 255, 0.08);
}

.creator-initials {
  font-size: 1rem;
  font-weight: 700;
  color: #B8A1FF;
  line-height: 1;
}

.creator-label {
  color: #B8A1FF !important;
  font-weight: 700;
}

.member-label {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.member-search {
  width: 334px;
  height: 28px;
  border-radius: 999px;
  border: .5px solid #00E5FF;
  padding: 0 12px;
  display: flex;
  align-items: center;
}

.member-search-input {
  width: 334px;
  height: 28px;
  background: transparent;
  border: none;
  outline: none;

  font-size: .8rem;
  color: #EBE9F7;
  font-family: inherit;
}

.member-list {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.member-row {
  width: 334px;
  height: 28px;
  border: .5px solid #00E5FF;
  border-radius: 18px;
  padding: 0.55rem 0.9rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.member-name {
  color: #EBE9F7;
  font-size: 0.7rem;
  padding: auto;
}

.member-add {
  background: transparent;
  border: none;
  color: #EBE9F7;
  font-family: inherit;
  font-size: 0.6rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
}

.member-add:hover {
  color: rgba(255, 255, 255, 0.85);
}

.create-btn {
  margin-top: 30px;
  padding: 9px 16px;
  border-radius: 999px;

  background:
    radial-gradient(130% 120% at 50% 0%, rgba(0, 229, 255, 0.36)0%, rgba(0, 0, 0, 0)100%);
  border: 1.5px solid rgba(0, 229, 255, 0.78);

  color: rgba(255, 255, 255, 0.78);
  font-family: "Lexend Exa", sans-serif;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: .3px;

  box-shadow:
    0 0 0 1px rgba(0, 229, 255, 0.28) inset,
    0 0 8px rgba(0, 229, 255, 0.18);

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.create-btn:hover {
  box-shadow:
    0 0 0 1px rgba(0, 229, 255, 0.36) inset,
    0 0 10px rgba(0, 229, 255, 0.24);
}

.create-btn:active {
  transform: translateY(0);
  opacity: 0.92;
}

.create-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow:
    0 0 0 2px rgba(0, 229, 255, 0.10) inset,
    0 0 10px rgba(0, 229, 255, 0.12);
}

.error-msg {
  margin-top: 0.9rem;
  color: #ff5a5a;
  font-size: 0.95rem;
  text-align: center;
}

.join-decline {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
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

.join-decline button.confirm {
  background-color: #199cff;
  color: white;
  border: none;
}

.join-decline button.cancel {
  background-color: transparent;
  color: white;
  border: 1.5px solid #199cff;
}

.join-decline button:hover {
  transform: scale(1.03);
}
</style>
