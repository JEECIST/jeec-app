<template>
  <div class="profile">
    <div class="user-card">
      <div class="top-section">
        <div class="left-section">
          <h2 class="user-name">{{ student.name || 'First Last' }}</h2>
          <p class="user-username">{{ student.username || 'username' }}</p>
          <div class="user-stats">
            <span class="ticket">
              <span class="ticket-text" :style="{ opacity: hasTicket ? '0' : '1' }">No Ticket</span>
              <img
                v-if="hasTicket"
                src="@/assets/icons/daily_ticket.svg"
                alt="Ticket"
                class="ticket-icon"
              />
            </span>
            <span class="points">
              {{ student.current_points || 0 }}
              <img src="@/assets/icons/flash_home.svg" alt="Energy" />
            </span>
          </div>
        </div>

        <div class="user-wrapper">
          <UserImage :image="student.photo" variant="profile" />
        </div>
      </div>

      <div class="text-points-wrapper">
        <JEECPOT variant="profile" />
      </div>
    </div>

    <div class="profile-buttons-jeec">
      <button class="linkedin-button" @click="toggleModal">
        <img class="icon" src="@/assets/linkedin_button_img.svg" alt="LinkedIn" />
        <div class="button-text">
          <div class="button-text">
            <p v-if="student.linkedin_url == '' || student.linkedin_url == null">
              Submit<br />LinkedIn
            </p>
            <p v-else>LinkedIn<br />Submitted</p>
          </div>
        </div>
      </button>

      <button class="cv-button" @click.stop="toggleModal2">
        <img class="icon" src="@/assets/cv_button_img.svg" alt="CV" />
        <div class="button-text">
          <div class="button-text">
            <p v-if="!student.uploaded_cv">Upload<br />your CV</p>
            <p v-else-if="student.approved_cv">CV<br />Approved</p>
            <p v-else>CV<br />Uploaded</p>
          </div>
        </div>
      </button>
    </div>

    <div class="squad-section">
      <h2 class="squad-title">SQUAD</h2>
      <!-- <div v-if="!isInSquad"> -->
      <div v-if="!isInSquad()">
        <div v-if="!isCreatingSquad">
          <div class="profile-buttons-jeec">
            <button @click="change_Create" class="create-squad-button">
              <p>CREATE SQUAD</p>
            </button>
          </div>

          <div class="invites">
            <Invite
              v-for="invite in invites"
              :key="invite.id"
              :invite="invite"
              @accept="handleAcceptInvite"
              @reject="handleRejectInvite"
            />
          </div>
        </div>
        <div v-else>
          <SquadCreation @back="creationReturn" @notification="showNotification" />
        </div>
      </div>
      <div v-else>
        <Squad :squad="squad" @delete="fetchProfile" @notification="showNotification" />
      </div>
    </div>

    <div style="position: absolute">
      <!-- LinkedIn Modal -->
      <div class="modal" v-if="modalVisible == true">
        <div class="modal-backdrop" @click="toggleModal"></div>
        <div class="modal-content custom-modal">
          <div class="modal-header">
            <h2 class="modal-title">
              {{
                student.linkedin_url == '' || student.linkedin_url == null
                  ? 'Add LinkedIn'
                  : 'Edit LinkedIn'
              }}
            </h2>
            <button class="modal-close" @click="toggleModal">&times;</button>
          </div>
          <form @submit="add_linkedin">
            <div class="modal-body">
              <input
                type="url"
                v-model="linkedin_url"
                class="modal-input"
                placeholder="https://www.linkedin.com/in/XXXXX/"
                pattern="^https?://((www|\\w\\w)\\.)?linkedin.com/((in/[^/]+/?)|(pub/[^/]+/((\\w|\\d)+/?){3}))$"
                autofocus
              />
            </div>
            <div class="modal-submit center-submit">
              <button class="invite-button" type="submit">
                {{
                  student.linkedin_url == '' || student.linkedin_url == null ? 'Confirm' : 'Edit'
                }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- CV Modal -->
      <div class="modal" v-if="modalVisible2 == true">
        <div class="modal-backdrop" @click="toggleModal2"></div>
        <div class="modal-content custom-modal">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ student.uploaded_cv ? 'Update Uploaded CV' : 'Add CV' }}
            </h2>
            <button class="modal-close" @click="toggleModal2">&times;</button>
          </div>
          <form @submit.prevent="validateAndUploadCV">
            <div class="modal-body">
              <div class="inline-radio-group">
                <p>Are you from Técnico?</p>
                <div class="radio-options">
                  <label>
                    <input type="radio" v-model="isFromTecnico" :value="true" />
                    <span>Yes</span>
                  </label>
                  <label>
                    <input type="radio" v-model="isFromTecnico" :value="false" />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div class="modal-spacer"></div>
              <p>Your level of education:</p>
              <select
                class="modal-input"
                v-model="educationLevel"
                placeholder="Your level of education"
                required
              >
                <option value="BSc">BSc</option>
                <option value="MSc">MSc</option>
                <option value="Other">Other</option>
              </select>
              <div class="modal-spacer"></div>
              <p>Your CV:</p>
              <label class="upload-cv-button" for="cvInput">Upload your CV</label>
              <input
                id="cvInput"
                hidden
                type="file"
                accept="application/pdf"
                ref="cvInput"
                @change="add_cv_novo"
              />
            </div>
            <div class="modal-submit center-submit">
              <button class="invite-button" type="submit">Confirm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div>
    <ToastNotification
      :message="toastMessage"
      :type="toastType"
      :visible="showToast"
      @close="showToast = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import axios from 'axios'
import UserService from '../services/user.service'
import authHeader from '../services/auth-header'

// Importação de componentes
import TheUserInfo from '@/components/UserCard/TheUserInfo.vue'
import JEECPOT from '@/components/UserCard/JEECPOT.vue'
import UserImage from '@/components/UserCard/UserImage.vue'
import Squad from '@/components/Squads/Squad.vue'
import ToastNotification from '@/components/Squads/ToastNotification.vue'
import Invite from '@/components/Squads/Invite.vue'
import SquadCreation from '@/components/Squads/SquadCreation.vue'
import User from '@/models/user'

// Variáveis de estado
const loading_linkedin = ref(false)
const modalVisible = ref(false)
const modalVisible2 = ref(false)
const code = ref('')
const dialog = ref(false)
const prev_length = ref(0)
const points = ref(0)
const squad = ref({})
const error = ref('')
const create_squad = ref(false)
const hasTicket = ref(true)
const loading_redeem = ref(false)
const loading_squad = ref(true)
const student = ref({})
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const isFromTecnico = ref(false)
const educationLevel = ref('Other')
const get_cv_files = ref('')
const formData = ref(null)
const cv_url = ref('')
const cv = ref(null)
const linkedin_url = ref('')
const percentage = ref(50)
const user = ref({}) // Tornar user reativo
const invites = ref([])

// Computed properties
const isInSquad = () => {
  return squad.value !== null && squad.value !== undefined
}

const isCreatingSquad = computed(() => create_squad.value)

// Métodos
const showNotification = (message, type) => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

const validateAndUploadCV = () => {
  if (
    educationLevel.value !== '' &&
    (isFromTecnico.value === true || isFromTecnico.value === false) &&
    formData.value !== null
  ) {
    modalVisible2.value = false
    axios
      .post(
        `${import.meta.env.VITE_APP_JEEC_BRAIN_URL}/student/updateIsfromTecnico`,
        {
          student_username: student.value.username,
          tecnico: isFromTecnico.value,
          educationLevel: educationLevel.value,
        },
        {
          headers: authHeader(),
        },
      )
      .then(() => {
        UserService.addCVNOVO(formData.value).then(
          () => {
            student.value.approved_cv = false
            if (!student.value.uploaded_cv) {
              showNotification('CV Submitted', 'points')
              student.value.uploaded_cv = true
            } else {
              showNotification('CV and other fields updated', 'success')
            }
          },
          (error) => {
            console.log(error)
            showNotification(
              'Failed to upload, file size may be too large. Try uploading less than 600kb',
              'error',
            )
          },
        )
      })
      .catch((error) => {
        console.error('Error updating ', error)
        showNotification('Something bad occurred', 'error')
      })

    // formData.value = null;
    isFromTecnico.value = false
    educationLevel.value = 'Other'
  } else {
    showNotification('Please fill all the fields and upload your CV.', 'error')
  }
}

const toggleModal = () => {
  modalVisible.value = !modalVisible.value
  linkedin_url.value = student.value.linkedin_url || ''
}

const toggleModal2 = () => {
  modalVisible2.value = !modalVisible2.value
}

const change_Create = () => {
  create_squad.value = !create_squad.value
}

const creationReturn = () => {
  create_squad.value = false
  fetchProfile()
}

const handleAcceptInvite = (inviteId) => {
  // Handle the acceptance of the invite

  UserService.acceptInvitation(inviteId).then(
    (response) => {
      showNotification('Squad invite accepted', 'success')
      fetchProfile()
    },
    (error) => {
      console.log(error)
      showNotification('Failed to accept invite', 'error')
    },
  )
}

const handleRejectInvite = (inviteId) => {
  // Handle the rejection of the invite

  UserService.rejectInvitation(inviteId).then(
    (response) => {
      showNotification('Squad invite rejected', 'success')
      fetchProfile()
    },
    (error) => {
      console.log(error)
      showNotification('Failed to reject invite', 'error')
    },
  )
}

const add_linkedin = (e) => {
  e.preventDefault()

  loading_linkedin.value = true
  dialog.value = false

  const linke_url = linkedin_url.value

  // if (linke_url === "") {
  //   showNotification("Please enter a valid LinkedIn URL", "error");
  //   loading_linkedin.value = false;
  //   return;
  // }
  if (
    !linke_url.match(
      /^https?:\/\/((www|\w\w)\.)?linkedin\.com\/((in\/[^\s/]+\/?)|(pub\/[^\s/]+\/((\w|\d)+\/?){3}))$/u,
    )
  ) {
    showNotification('Please enter a valid LinkedIn URL', 'error')
    loading_linkedin.value = false
    return
  }

  modalVisible.value = false

  linkedin_url.value = ''

  UserService.addLinkedin(linke_url).then(
    (response) => {
      if (!student.value.linkedin_url) {
        showNotification('Added LinkedIn points', 'points')

        setTimeout(fetchProfile, 100)
      } else {
        showNotification('LinkedIn updated successfully', 'success')
      }

      loading_linkedin.value = false
    },
    (error) => {
      showNotification('Failed to add LinkedIn', 'error')
      loading_linkedin.value = false
    },
  )
}

/* const cv_click = () => {
  $refs.cv.click();
}; */

// const add_cv_novo = () => {
//   // Verificar se o arquivo foi selecionado corretamente
//   if (cv.value && cv.value.files && cv.value.files.length > 0) {
//     formData.value = new FormData();
//     formData.value.append("cv", cv.value.files[0]);
//   } else {
//     console.log("Nenhum arquivo selecionado.");
//   }
// };

const cvInput = ref(null)

// const add_cv_novo = () => {
//   const fileInput = document.getElementById("cvInput");
//   if (fileInput && fileInput.files.length > 0) {
//     formData.value = new FormData();
//     formData.value.append("cv", fileInput.files[0]);  // <- append directly from file input
//   } else {
//     console.log("Nenhum arquivo selecionado.");
//   }
// };

const add_cv_novo = () => {
  const file = cvInput.value?.files[0]
  if (file) {
    formData.value = new FormData()
    formData.value.append('cv', file)
  } else {
    console.log('Nenhum arquivo selecionado.')
  }
}

const fetchProfile = () => {
  const userStore = useUserStore()
  user.value = userStore.user // Atribuindo o valor corretamente

  UserService.getUserStudent().then(
    (response) => {
      student.value = response.data.data
    },
    (error) => {
      console.log(error)
    },
  )

  UserService.getDailyTicket().then(
    (response) => {
      hasTicket.value = response.data
    },
    (error) => {
      console.log(error)
    },
  )

  squad.value = null

  UserService.getUserSquad().then(
    (response) => {
      squad.value = response.data.data
    },
    (error) => {
      console.log(error)
    },
  )

  if (!isInSquad()) {
    UserService.getSquadInvitationsReceived().then(
      (response) => {
        invites.value = response.data.data
      },
      (error) => {
        console.log(error)
      },
    )
  } else {
    console.log('Already in a squad')
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.user-card {
  background-color: #199cff1a;
  border: 1.5px solid #199cff;
  border-radius: 20px 60px 20px 20px;
  padding: 1rem 1.5rem;
  width: 90%;
  max-width: 650px;
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-right: 20px;
}

.text-points-wrapper {
  width: 100%;
  margin-top: 0.5rem;
}

.user-name {
  font-size: 1.7rem;
  color: white;
  font-weight: 700;
  font-family: 'Lexend Exa', sans-serif;
  margin: 0;
}

.user-username {
  padding-bottom: 0.5rem;
}

.user-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.ticket,
.points {
  border: 2px solid #199cff;
  padding: 0.3rem 0.6rem;
  border-radius: 25px;
  font-size: 0.8rem;
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 100;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  position: relative;
  overflow: visible;
  /* permite que o conteúdo ultrapasse os limites */
}

.ticket-text {
  font-size: 0.8rem;
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 100;
  display: flex;
  align-items: center;
}

.ticket-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.points img {
  height: 0.9rem;
  vertical-align: middle;
}

.user-wrapper {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-buttons-jeec {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  gap: 0.7rem;
  padding: 0 1rem;
}

.profile-buttons-jeec button.linkedin-button,
.profile-buttons-jeec button.cv-button {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}

.profile-buttons-jeec button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background-color: #199cff;
  border: none;
  border-radius: 12px;
  color: white;
  padding: 0.6rem 1rem;
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 550;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  text-align: left;
  flex: none;
  letter-spacing: 0.1em;
}

.profile-buttons-jeec button:hover {
  transform: scale(1.02);
}

.profile-buttons-jeec .icon {
  height: 1.8rem;
  width: auto;
}

.button-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1rem;
}

.section-title {
  color: white;
  text-align: center;
  font-size: 2rem;
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 700;
  text-shadow: 0 0 10px #199cff;
  margin-top: 3rem;
}

.create-squad-button {
  background-color: #199cff;
  border: none;
  border-radius: 12px;
  color: white;
  padding: 0.5rem 1rem;
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  text-transform: uppercase;
  width: auto;
}

.create-squad-button:hover {
  transform: scale(1.02);
}

.squad-section {
  text-align: center;
  margin-top: 2rem;
}

.squad-title {
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  color: white;
  text-shadow: 0 0 10px #199cff;
  margin-bottom: 1rem;
}

.create-squad-button {
  background-color: #199cff;
  border: none;
  border-radius: 15px;
  color: white;
  padding: 0.8rem 1rem;
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  width: 182px;
  margin: 0 auto;
  transition: transform 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.create-squad-button:hover {
  transform: scale(1.02);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: -1;
}

.modal-content {
  background: var(--color-background-sec, #1e1e2f);
  padding: 1.5rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  font-family: 'Lexend Exa', sans-serif;
  color: white;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  color: white;
  text-align: center;
  font-family: 'Lexend', sans-serif;
}

.modal-close {
  position: absolute;
  right: 0;
  background: none;
  border: none;
  font-size: 1.6rem;
  color: white;
  cursor: pointer;
}

.modal-close:hover {
  transform: scale(1.1);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.modal-body > p {
  font-size: 1.05rem;
  font-weight: 500;
  color: white;
}

.modal-input {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border-radius: 12px;
  border: 2px solid #199cff;
  background-color: transparent;
  font-family: 'Lexend Exa', sans-serif;
  font-size: 0.9rem;
  color: white;
  outline: none;
  transition: border-color 0.2s ease;
}

.modal-input::placeholder {
  color: #aaa;
  font-family: 'Lexend Exa', sans-serif;
  font-size: 0.75rem;
}

.modal-input:focus {
  border-color: #42b5ff;
}

.modal-submit {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.modal-submit .invite-button {
  padding: 0.4rem 1.5rem;
  font-size: 0.95rem;
  border-radius: 50px;
  background-color: #199cff;
  color: white;
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.modal-submit .invite-button:hover {
  transform: scale(1.03);
}

.inline-radio-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  color: white;
  font-family: 'Lexend Exa', sans-serif;
  font-size: 0.95rem;
}

.inline-radio-group > p {
  font-size: 1.05rem;
  font-weight: 500;
  color: white;
}

.inline-radio-group .radio-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
}

.inline-radio-group label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.upload-cv-button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 2px solid #199cff;
  background-color: transparent;
  font-family: 'Lexend Exa', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.upload-cv-button:hover {
  border-color: #42b5ff;
}
</style>
