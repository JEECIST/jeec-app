<template>
  <div class="create-squad expanded">
    <div class="create-modal">
      <div class="create-header">
        <p>CREATE SQUAD</p>
      </div>

      <div class="name-image">
        <input
          class="create-name"
          :class="{ input_exists: name.length }"
          type="text"
          placeholder="Your Squad Name..."
          v-model="name"
          @input="validateInput"
          maxlength="25"
          minlength="4"
        />

        <button class="create-image" @click.stop="input_click">
          <p v-if="!image_uploaded">ADD<br />PICTURE</p>
          <img
            v-if="image_uploaded"
            :src="currentImage"
            alt="uploaded-image"
            ref="uploaded_image"
          />
          <div class="plus-symbol">+</div>
          <input
            type="file"
            accept="image/*"
            ref="image_input"
            @change="input_file"
            style="display: none"
          />
        </button>
      </div>
      <div class="motto">
        <p>Motto</p>
        <div class="create-motto">
          <input
            :class="{ input_exists: cry.length }"
            type="text"
            placeholder="Your motto..."
            v-model="cry"
            maxlength="60"
          />
        </div>
      </div>

      <div class="join-decline" v-if="!loading">
        <button class="confirm" @click.stop="create_squad">Confirm</button>
        <button class="cancel" @click.stop="cancel">Cancel</button>
      </div>

      <p class="error-msg" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import UserService from '../../services/user.service'
import jeec_colour_no_edition_transparent from '@/assets/jeec_colour_no_edition_transparent.svg'
import jeec_mobile_white from '../../assets/jeec_mobile_white.svg'

export default {
  name: 'SquadCreation',
  emits: ['back', 'notification'],
  data: function () {
    return {
      files: [],
      image_uploaded: false,
      currentImage: jeec_colour_no_edition_transparent,
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
  // other computed properties...
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
    // Method to convert image URL to Blob
    async getDefaultImageBlob() {
      const response = await fetch(jeec_mobile_white)
      const data = await response.blob()
      return new File([data], 'default-image.svg', { type: 'image/svg' })
    },

    async create_squad() {
      if (!this.nameExists) {
        this.error = 'Invalid information for new squad - Name cannot be left blank'
        return
      } else if (!this.cryExists) {
        this.error = 'Invalid information for new squad - Motto cannot be left blank'
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
      formData.append('cry', this.cry)

      await UserService.createSquad(formData)
        .then((response) => {
          // handle success

          this.showNotification('Squad created successfully', 'success')

          this.$emit('back')
        })
        .catch((error) => {
          // handle error
          this.error = error.response.data.error
          console.log(error)
          this.loading = false
          this.error = 'Squad name already taken'
          // this.showNotification("Squad already exists", "error");
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
  background-color: #199cff1a;
  border: 1.5px solid #199cff;
  border-radius: 20px;
  width: 90%;
  max-width: 650px;
  margin: 1.5rem auto;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
}

.create-modal {
  display: flex;
  flex-direction: column;
  gap: 0rem;
  font-family: 'Lexend Exa', sans-serif;
}

.name-image {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.create-name {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: white;
  font-family: inherit;
  width: 100%;
}

.create-name::placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.create-image {
  width: 110px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 1.5px solid #199cff;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  position: relative;
  z-index: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.create-image p {
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  color: #199cff;
  text-transform: uppercase;
  line-height: 1rem;
}

.create-image .plus-symbol {
  position: absolute;
  bottom: -6px;
  left: 0px;
  background-color: #199cff;
  border-radius: 50%;
  color: white;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: none;
  z-index: 2;
}

.create-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.motto {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.motto p {
  color: white;
  font-family: inherit;
  font-size: 1rem;
  margin: 0;
  min-width: max-content;
}

.create-header p {
  color: white;
  font-family: inherit;
  font-size: 1rem;
  margin: 0;
  min-width: max-content;
}

.create-motto {
  flex: 1;
  border: 1.5px solid #199cff;
  border-radius: 25px;
  padding: 0.5rem 1rem;
  background: transparent;
}

.create-motto input {
  background: none;
  border: none;
  width: 100%;
  color: white;
  font-family: inherit;
  font-size: 1rem;
}

.buttons {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  flex-wrap: wrap;
}

.error-msg {
  color: red;
  font-size: 1rem;
  text-align: center;
  margin: 0;
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
