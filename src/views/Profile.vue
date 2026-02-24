<template>
  <div class="profile">
    <div class="profile-buttons-jeec">
      <button class="linkedin-button" @click="toggleModal">
        <div class="button-text">
          <div class="button-text">
            <p v-if="student?.linkedin_url == '' || student?.linkedin_url == null">
              SUBMIT<br />LinkedIn
            </p>
            <p v-else>LinkedIn<br />Submitted</p>
          </div>
        </div>
      </button>

      <button class="cv-button" @click.stop="toggleModal2">
        <div class="button-text">
          <div class="button-text">
            <p v-if="!student?.uploaded_cv">UPLOAD CV</p>
            <p v-else-if="student?.approved_cv">CV<br />Approved</p>
            <p v-else>CV<br />Uploaded</p>
          </div>
        </div>
      </button>
    </div>

    <div class="what-can-win-divider">
      <span class="divider-line"></span>
      <span class="divider-text">What I can Win?</span>
      <span class="divider-line"></span>
    </div>

    <div class="squad-section">
      <div v-if="!isInSquad()">
        <div v-if="!isCreatingSquad">
          <div class="profile-buttons-jeec">
            <button @click="change_Create" class="create-squad-button">
              <p>CREATE A SQUAD</p>
            </button>
          </div>

          <div class="invites">
            <Invite v-for="invite in invites" :key="invite.id" :invite="invite" @accept="handleAcceptInvite"
              @reject="handleRejectInvite" />
          </div>
        </div>
        <div v-else>
          <SquadCreation @back="creationReturn" @notification="showNotification" />
        </div>
      </div>
      <div v-else>
        <newSquad :squad="squad" @delete="fetchProfile" @notification="showNotification" />
      </div>
    </div>

    <div class="rankings-section">
      <h2 class="ranking-title">RANKING</h2>
      <RankingsPodium v-if="rankingsData.length > 0" :other_rankingdata="rankingsData" :user_ranking="userRanking"
        :user_points="student?.current_points || 0" :identity="student?.name || 'You'" :flag="true" :type="'Squad'" />
      <div v-else class="rankings-placeholder">
        <p>Rankings coming soon...</p>
      </div>
      <div class="view-all-link">
        <span class="view-all-link-line"></span>
        <a href="/rankings">view all</a>
        <span class="view-all-link-line"></span>
      </div>
    </div>

    <div style="position: absolute">
      <div class="modal" v-if="modalVisible == true">
        <div class="modal-backdrop" @click="toggleModal"></div>
        <div class="modal-content custom-modal">
          <div class="modal-header">
            <h2 class="modal-title">
              {{
                student?.linkedin_url == '' || student?.linkedin_url == null
                  ? 'Add LinkedIn'
                  : 'Edit LinkedIn'
              }}
            </h2>
            <button class="modal-close" @click="toggleModal">&times;</button>
          </div>
          <form @submit="add_linkedin">
            <div class="modal-body">
              <input type="url" v-model="linkedin_url" class="modal-input"
                placeholder="https://www.linkedin.com/in/XXXXX/"
                pattern="^https?://((www|\\w\\w)\\.)?linkedin.com/((in/[^/]+/?)|(pub/[^/]+/((\\w|\\d)+/?){3}))$"
                autofocus />
            </div>
            <div class="modal-submit center-submit">
              <button class="invite-button" type="submit">
                {{
                  student?.linkedin_url == '' || student?.linkedin_url == null ? 'Confirm' : 'Edit'
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
              {{ student?.uploaded_cv ? 'Update Uploaded CV' : 'Add CV' }}
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
              <select class="modal-input" v-model="educationLevel" placeholder="Your level of education" required>
                <option value="BSc">BSc</option>
                <option value="MSc">MSc</option>
                <option value="Other">Other</option>
              </select>
              <div class="modal-spacer"></div>
              <p>Your CV:</p>
              <label class="upload-cv-button" for="cvInput">Upload your CV</label>
              <input id="cvInput" hidden type="file" accept="application/pdf" ref="cvInput" @change="add_cv_novo" />
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
    <ToastNotification :message="toastMessage" :type="toastType" :visible="showToast" @close="showToast = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import axios from 'axios'
import UserService from '../services/user.service'
import authHeader from '../services/auth-header'

import ToastNotification from '@/components/Squads/ToastNotification.vue'
import Invite from '@/components/Squads/Invite.vue'
import SquadCreation from '@/components/Squads/SquadCreation.vue'
import RankingsPodium from '@/components/RankingsPodium.vue'
import newSquad from '@/components/Squads/newSquad.vue'

// Variáveis de estado
const loading_linkedin = ref(false)
const modalVisible = ref(false)
const modalVisible2 = ref(false)

const dialog = ref(false)

const squad = ref({})

const create_squad = ref(false)
const hasTicket = ref(true)

const student = ref({})
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const isFromTecnico = ref(false)
const educationLevel = ref('Other')

const formData = ref(null)

const linkedin_url = ref('')

const user = ref({}) // Tornar user reativo
const invites = ref([])
const rankingsData = ref([])
const userRanking = ref(0)

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
.what-can-win-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem auto;
  max-width: 680px;
  padding: 0 1rem;
}

.divider-line {
  flex: 1;
  height: .3px;
  max-width: 50px;
  background: #fff;
}

.divider-text {
  color: white;
  font-family: 'Lexend Exa', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
}

.rankings-section {
  margin: 3rem auto 5rem;
  max-width: 650px;
  padding: 0 1rem;
}

.ranking-title {
  font-family: 'Lexend Exa', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  text-align: center;
  background: linear-gradient(90deg, #B8A1FF 1000%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.rankings-placeholder {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 2rem;
  font-family: 'Lexend', sans-serif;
}

.view-all-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  margin-top: 1.5rem;
  width: 100%;
}

.view-all-link-line {
  flex: 1;
  height: 1px;
  max-width: 50px;
  background: #fff;
}

.view-all-link a {
  color: rgba(255, 255, 255, .7);
  font-family: 'Lexend Exa', sans-serif;
  font-size: .9rem;
  text-decoration: none;
  transition: color .2s ease;
}

.profile-buttons-jeec {
  display: flex;
  justify-content: space-between;
  gap: .75rem;
  padding: 1rem 1rem;
}

.profile-buttons-jeec button {
  position: relative;
  flex: 1;

  cursor: pointer;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  transition: transform .18s ease, filter .18s ease;
}

.profile-buttons-jeec button::before {
  content: "";
  border-radius: inherit;

  background: var(--btn-border);
  z-index: 0;

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.profile-buttons-jeec button::after {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: inherit;
  z-index: 1;
}

.profile-buttons-jeec .linkedin-button {
  border-radius: 45px;
  border: .5px solid #199CFF;
  width: 160px;
  height: 42px;

  background: linear-gradient(180deg, rgba(25, 156, 255, .35) 0%, #072A3F 100%);
  box-shadow: inset 0 0 0 .5px #199CFF, 0 0 18px rgba(25, 156, 255, .35);
}

.profile-buttons-jeec .cv-button {
  border-radius: 45px;
  border: .5px solid #7209B7;
  width: 160px;
  height: 42px;

  background: linear-gradient(180deg, rgba(138, 45, 255, .35) 0%, #120A26 100%);
  box-shadow: inset 0 0 0 .5px #8A2DFF, 0 0 18px rgba(138, 45, 255, .35);
}

.profile-buttons-jeec button:hover {
  transform: scale(1.02);
  filter: brightness(1.05);
}

.profile-buttons-jeec button:active {
  transform: scale(.99);
}

.button-text {
  font-family: 'Lexend Exa', sans-serif;
  line-height: 1.1rem;
  font-size: 13;
  font-weight: bolder;
  letter-spacing: .03rem;
  text-transform: uppercase;
}

.squad-section {
  text-align: center;
  margin-top: 2rem;
}

.profile-buttons-jeec .create-squad-button {
  width: 100%;
  max-width: 250px;
  height: 64px;
  border-radius: 25px;
  border: 2px solid rgba(0, 255, 235, .75);
  background:
    radial-gradient(140% 120% at 50% 0%, rgba(0, 255, 235, .18), rgba(255, 255, 255, 0) 60%),
    linear-gradient(180deg, rgba(8, 30, 40, .92), rgba(5, 14, 22, .94));
  box-shadow:
    0 0 10px rgba(0, 255, 235, .35),
    0 0 28px rgba(0, 255, 235, .18),
    inset 0 1px 0 rgba(255, 255, 255, .06),
    inset 0 -22px 30px rgba(0, 0, 0, .55);

  margin: 0 auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  font: 800 1.05rem "Lexend Exa", sans-serif;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: rgba(235, 220, 242, .92);
  text-shadow: 0 0 12px rgba(0, 255, 230, .10);

  transition: transform 140ms ease, filter 140ms ease;
}

.profile-buttons-jeec .create-squad-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

.profile-buttons-jeec .create-squad-button:active {
  transform: scale(.99);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: auto;
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
  width: auto;
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
  font-family: 'Lexend Exa Light', sans-serif;
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
  font-family: 'Lexend Exa', sans-serif;
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

.modal-body>p {
  font-size: 1.05rem;
  font-weight: 500;
  color: white;
}

.modal-input {
  width: auto;
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

.inline-radio-group>p {
  font-size: 1.05rem;
  font-weight: 500;
  color: white;
}

.inline-radio-group .radio-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 90%;
  justify-content: center;
}

.inline-radio-group label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
</style>