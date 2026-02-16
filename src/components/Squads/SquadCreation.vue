<template>
  <div class="create-squad">
    <div class="create-modal">
      <h1 class="title">Create a squad</h1>

      <button class="avatar" @click.stop="input_click" aria-label="Upload squad picture">
        <img v-if="image_uploaded" :src="currentImage" alt="Squad" />
        <img v-else :src="currentImage" alt="Default squad" class="avatar-default" />
        <span class="avatar-plus">+</span>

        <input
          type="file"
          accept="image/*"
          ref="image_input"
          @change="input_file"
          style="display: none"
        />
      </button>

      <p class="field-label">Your squad name</p>
      <input
        class="name-input"
        :class="{ input_exists: name.length }"
        type="text"
        v-model="name"
        maxlength="25"
        minlength="4"
      />

      <p class="section-label">Add members</p>

      <div class="member-search">
        <input
          class="member-search-input"
          type="text"
          v-model="memberQuery"
          placeholder="Name"
        />
      </div>

      <div class="member-list">
        <div class="member-row" v-for="m in filteredMembers" :key="m.id">
          <span class="member-name">{{ m.name }}</span>
          <button class="member-add" type="button" @click="addMember(m)">
            Add member
          </button>
        </div>
      </div>

      <button class="create-btn" :disabled="loading" @click.stop="create_squad">
        Create Squad
      </button>

      <p class="error-msg" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import UserService from '../../services/user.service'
import jeec_mobile_white from '../../assets/jeec_mobile_white.svg'

export default {
  name: 'SquadCreation',
  emits: ['back', 'notification'],
  data: function () {
    return {
      files: [],
      image_uploaded: false,
      currentImage: jeec_mobile_white,
      name: '',
      cry: '',
      error: '',
      loading: false,
      locked: true,
      expanded: true,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
    }
  },

  methods: {
    showNotification(message, type) {
      this.$emit('notification', message, type)
    },

    input_click() {
      this.$refs.image_input.click()
    },
    input_file(event) {
      this.files = event.target.files

      if (this.files.length == 1) {
        var reader = new FileReader()

        reader.onload = (e) => {
          this.currentImage = e.target.result
          this.image_uploaded = true
        }

        reader.readAsDataURL(this.files[0])
      }
    },

    async getDefaultImageBlob() {
      const response = await fetch(jeec_mobile_white)
      const data = await response.blob()
      return new File([data], 'default-image.svg', { type: 'image/svg' })
    },

    async create_squad() {
      if (!this.nameExists) {
        this.error = 'Invalid information for new squad - Name cannot be left blank'
        return
      } 
      this.loading = true

      let imageData
      if (this.files.length > 0) {
        imageData = this.files[0]
      } else {
        imageData = await this.getDefaultImageBlob()
      }

      const formData = new FormData()
      formData.append('file', imageData)
      formData.append('name', this.name)

      await UserService.createSquad(formData)
        .then((response) => {
          this.showNotification('Squad created successfully', 'success')
          this.$emit('back')
        })
        .catch((error) => {
          this.error = error.response.data.error
          console.log(error)
          this.loading = false
          this.error = 'Squad name already taken'
        })
    },
    async cancel() {
      this.$emit('back')
    },
  },
  computed: {
    nameExists() {
      return this.name.trim().length > 0
    },
    cryExists() {
      return this.cry.trim().length > 0
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
  margin: 0.2rem 0 1.2rem;
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

  display: grid;
  place-items: center;
  font-size: 1.05rem;
  line-height: 1;
}

.field-label {
  margin: 0.9rem 0 0.35rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
}

.name-input {
  width: 70%;
  min-width: 240px;
  text-align: center;

  background: transparent;
  border: none;
  outline: none;

  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  padding: 0.35rem 0.2rem;

  border-bottom: 1px solid rgba(25, 156, 255, 0.45);
}

.section-label {
  width: 100%;
  margin: 4rem 0 0.55rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
  text-align: left;
}

.member-search {
  width: 100%;
  height: 36px;
  border-radius: 999px;
  border: 1px solid #00E5FF;
  padding: 0 12px;
  display: flex;
  align-items: center;
}

.member-search-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;

  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  font-family: inherit;
}

.member-list {
  width: 100%;
  margin-top: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.member-row {
  width: 100%;
  border: 2px solid rgba(25, 156, 255, 0.55);
  border-radius: 18px;
  padding: 0.55rem 0.9rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.member-name {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
}

.member-add {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
}

.member-add:hover {
  color: rgba(255, 255, 255, 0.85);
}

.create-btn{
  padding: 9px 16px;
  border-radius: 999px;

  background: rgba(8,14,20,0.55);
  border: 2px solid rgba(0,229,255,0.78);

  color: rgba(255,255,255,0.78);
  font-family: "Lexend Exa", sans-serif;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: .8px;

  box-shadow:
    0 0 0 1px rgba(0,229,255,0.28) inset, 
    0 0 8px rgba(0,229,255,0.18);       

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.create-btn:hover{
  box-shadow:
    0 0 0 1px rgba(0,229,255,0.36) inset,
    0 0 10px rgba(0,229,255,0.24);
}

.create-btn:active{
  transform: translateY(0);
  opacity: 0.92;
}

.create-btn:disabled{
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