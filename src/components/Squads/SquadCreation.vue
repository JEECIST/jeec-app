<template>
  <div class="create-squad">
    <div class="create-modal">

      <!-- VIEW 1: name + avatar -->
      <div v-if="view === 'name'">
        <h1 class="title">Create a squad</h1>
        <button class="avatar" @click.stop="input_click" aria-label="Upload squad picture">
          <img :src="currentImage" :alt="image_uploaded ? 'Squad' : 'Default squad'" />
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

      <!-- VIEW 2: squad card + circles + member names -->
      <div v-else-if="view === 'slots'">
        <p class="section-label">Your Squad</p>

        <div class="squad-card">
          <div class="squad-header">
            <div class="squad-big-avatar">
              <img :src="currentImage" alt="Squad" />
            </div>

            <div class="squad-name">
              {{ (squad && squad.name) ? squad.name : name }}
            </div>
          </div>

          <div class="member-grid">
            <!-- Slot 0: creator (non-interactive) -->
            <div class="member-slot creator-slot">
              <div class="member-circle creator-circle">
                <img v-if="slots[0] && slots[0].avatar" :src="slots[0].avatar" alt="" />
                <span v-else-if="slots[0] && slots[0].name" class="creator-initials">{{ initials(slots[0].name)
                }}</span>
                <span v-else class="plus">👤</span>
              </div>
              <div class="member-label creator-label">
                {{ slots[0] && slots[0].name ? slots[0].name.split(' ')[0] : 'You' }}
              </div>
            </div>

            <!-- Slots 1, 2 & 3: add-member buttons -->
            <button v-for="i in [1, 2, 3]" :key="i" class="member-slot" type="button" @click="openPicker(i)">
              <div class="member-circle">
                <img v-if="slots[i] && slots[i].avatar" :src="slots[i].avatar" alt="" />
                <span v-else class="plus">+</span>
              </div>
              <div class="member-label">
                {{ slots[i] && slots[i].name ? slots[i].name : 'Add member' }}
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- VIEW 3: members list -->
      <div v-else-if="view === 'picker'">
        <p class="section-label">Add members</p>

        <div class="member-search">
          <input class="member-search-input" type="text" v-model="memberQuery" placeholder="search name" autofocus />
        </div>

        <div class="member-list">
          <div class="member-row" v-for="m in filteredMembers" :key="m.id">
            <span class="member-name">{{ m.name }}</span>
            <button class="member-add" type="button" @click="selectMember(m)">
              Add member
            </button>
          </div>
        </div>

        <button class="create-btn" type="button" @click="backToSlots">
          Back
        </button>
      </div>

      <p class="error-msg" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
// SquadCreation.vue
// Handles the full squad creation flow in three views:
//   1. 'name'   – user sets squad name and optional cover image
//   2. 'slots'  – shows squad card with creator + 3 add-member circles
//   3. 'picker' – searchable list to pick a member for an open slot

import UserService from '../../services/user.service'
import jeec_mobile_white from '../../assets/jeec_mobile_white.svg'

export default {
  name: 'SquadCreation',

  // 'back'         – emitted when the user cancels or finalises creation
  // 'notification' – emitted with (message, type) to surface toast messages in the parent
  emits: ['back', 'notification'],

  data() {
    return {
      // ── Image upload ──────────────────────────────────────────────────────
      files: [],              // FileList from the file input
      image_uploaded: false,  // true once the user has picked a custom image
      currentImage: jeec_mobile_white, // preview src; defaults to JEEC logo

      // ── View state ───────────────────────────────────────────────────────
      // Controls which step of the wizard is rendered
      view: 'name', // 'name' | 'slots' | 'picker'

      // ── Squad data ───────────────────────────────────────────────────────
      name: '',    // squad name typed by the user
      squad: null, // squad object returned (or faked) after creation

      // ── Member slots ─────────────────────────────────────────────────────
      // slots[0] is always the creator (populated on mount from the API).
      // slots[1–3] are the three add-member slots the user can fill.
      slots: [null, null, null, null],
      pickingIndex: null, // index of the slot currently being filled in 'picker' view
      memberQuery: '',    // live search query in the picker
      members: [],        // list of students fetched from the API for the picker

      // ── Misc ─────────────────────────────────────────────────────────────
      error: '',    // inline error message shown below the active view
      loading: false,

      // TODO: remove if unused once backend integration is complete
      cry: '',
    }
  },

  computed: {
    // True when all four member slots (creator + 3) are filled
    isSquadFull() {
      return this.slots.every(function (s) {
        return s !== null
      })
    },

    // Returns the members list filtered by the current search query.
    // Shows the full list when the query is empty.
    filteredMembers() {
      var q = this.memberQuery.trim().toLowerCase()
      if (!q) return this.members

      return this.members.filter(function (m) {
        return (m.name || '').toLowerCase().includes(q)
      })
    },
  },

  mounted() {
    // Populate slot 0 with the logged-in user's data so the creator circle
    // is shown immediately when the 'slots' view is rendered.
    UserService.getUserStudent().then(
      (response) => {
        var s = response.data.data
        this.slots.splice(0, 1, {
          id: s.username || s.id || 0,
          name: s.name || 'You',
          // Try multiple possible avatar field names from the API response
          avatar: s.photo || s.profile_picture || s.avatar || '',
        })
      },
      () => {
        // Fallback: show a generic 'You' label if the request fails
        this.slots.splice(0, 1, { id: 0, name: 'You', avatar: '' })
      },
    )
  },

  methods: {
    // Returns the first two initials of the given name in uppercase.
    // Used as a text fallback when the user has no avatar image.
    initials(name) {
      if (!name) return '?'
      return name
        .split(' ')
        .slice(0, 2)
        .map(function (w) { return w[0] })
        .join('')
        .toUpperCase()
    },

    // Proxy to emit a toast notification to the parent (Profile.vue)
    showNotification(message, type) {
      this.$emit('notification', message, type)
    },

    // Programmatically opens the hidden file input for the squad avatar
    input_click() {
      if (this.$refs.image_input) this.$refs.image_input.click()
    },

    // Reads the selected image file and updates the avatar preview
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

    // Validates the squad name and calls the API to create the squad,
    // then advances to the 'slots' view so the user can invite members.
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

        // Only send a file if the user actually uploaded one
        if (this.files && this.files.length > 0) {
          formData.append('file', this.files[0])
        }

        await UserService.createSquad(formData)

        this.squad = { name: trimmedName }
        this.showNotification('Squad created successfully', 'success')
        this.view = 'slots'
      } catch (err) {
        console.log('createSquad error:', err)
        console.log('STATUS:', err && err.response && err.response.status)
        console.log('DATA:', err && err.response && err.response.data)

        var msg = 'Failed to create squad'
        if (err && err.response && err.response.data) {
          msg = err.response.data.error || err.response.data.message || msg
        }
        this.error = msg
      } finally {
        this.loading = false
      }

      // fake success:
      this.squad = { id: 'local-' + Date.now(), name: trimmedName }
      this.showNotification('Squad created successfully (local)', 'success')
      this.view = 'slots'
    },

    // Opens the member picker for the given slot index.
    // Slot 0 is the creator and cannot be replaced.
    openPicker(i) {
      if (i === 0) return  // creator slot is locked
      this.pickingIndex = i
      this.memberQuery = ''
      this.view = 'picker'
    },

    // Called when the user taps 'Add member' next to a search result.
    // Guards against adding the same person twice, then fills the slot.
    selectMember(m) {
      if (this.pickingIndex === null) return

      // Prevent the same user from occupying more than one slot
      for (var k = 0; k < this.slots.length; k++) {
        var s = this.slots[k]
        if (s && s.id === m.id) return
      }

      // Normalise to the slot shape used by the template
      var picked = {
        id: m.id,
        name: m.name,
        // Try multiple possible avatar field names from the API response
        avatar: m.avatar || m.photo || m.image || m.profile_picture || ''
      }

      this.slots.splice(this.pickingIndex, 1, picked)
      this.pickingIndex = null
      this.view = 'slots'
    },

    // Cancels member picking and returns to the slots view
    backToSlots() {
      this.pickingIndex = null
      this.view = 'slots'
    },

    // Confirms the completed squad and notifies the parent
    finalise_squad() {
      this.showNotification('Squad finalised', 'success')
      this.$emit('back')
    },

    // Discards the creation flow and returns control to the parent
    cancel() {
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

.avatar img {
  width: auto;
  height: auto;
  object-fit: contain;
  box-sizing: border-box;
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
