<template>
  <div class="profile">
    <div class="user-card">

      <div class="header-row">
        <h2 class="user-name">{{ student?.name || 'John Doe' }}</h2>
        <img src="@/assets/jeec_logo_new.svg" alt="JEEC" class="jeec-logo" />
      </div>

      <div class="content-row">
        <div class="left-content">
          <div class="points-display">
            <span class="points-value">{{ student?.current_points || 175 }}</span>
            <img src="@/assets/icons/flash_home_white22.svg" alt="Energy" class="points-icon" />
          </div>

          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
            </div>
            <span class="progress-text">{{ percentage }}%</span>
          </div>
        </div>

        <button class="notification-bell" title="Notifications">
          <svg class="bell-icon" viewBox="0 0 24 24" fill="none" xmlns="/assets/icons/Bellicon.svg">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="notification-dot"></span>
        </button>
      </div>
    </div>

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
            <button @click="change_Create" class="create-squad-button" aria-label="Create a squad">
              <img class="squad-btn-img" :src="createSquadIcon" alt="" />
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

    <div class="rankings-section">
      <h2 class="ranking-title">RANKING</h2>
      <RankingsPodium
        v-if="rankingsData.length > 0"
        :other_rankingdata="rankingsData"
        :user_ranking="userRanking"
        :user_points="student?.current_points || 0"
        :identity="student?.name || 'You'"
        :flag="true"
        :type="'Squad'"
      />
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
      <!-- LinkedIn Modal -->
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
import createSquadIcon from "@/assets/icons/create-squad.svg";

// Importação de componentes
import TheUserInfo from '@/components/UserCard/TheUserInfo.vue'
import JEECPOT from '@/components/UserCard/JEECPOT.vue'
import UserImage from '@/components/UserCard/UserImage.vue'
import Squad from '@/components/Squads/Squad.vue'
import ToastNotification from '@/components/Squads/ToastNotification.vue'
import Invite from '@/components/Squads/Invite.vue'
import SquadCreation from '@/components/Squads/SquadCreation.vue'
import RankingsPodium from '@/components/RankingsPodium.vue'
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
.user-card {
  background-color: transparent;
  border-radius: 20px;
  width: 95%;
  max-width: 650px;
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.content-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.notification-bell {
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background:
    radial-gradient(120% 120% at 50% 0%,
      rgba(255,255,255,.08) 0%,
      rgba(255,255,255,0) 55%
    ),
    linear-gradient(180deg, rgba(8,17,26,.95) 0%, rgba(0,0,0,.95) 100%);

  box-shadow: 0 0 2px #fff; 
  align-self: center;
}

.bell-icon {
  font-size: 10px;
}

.jeec-logo {
  height: 42px;
  width: auto;
}

.user-name {
  font-size: 1.7rem;
  color: white;
  font-weight: 300;
  font-family: 'Lexend Exa', sans-serif;
  margin-left: 0;
}

.points-display{
  display:flex;
  align-items:center;
  gap:.5rem;

  padding:.4rem .8rem;
  border-radius:25px;
  width: fit-content;

  border: 1px solid rgba(0,0,0,1);             
  background:
    radial-gradient(120% 120% at 50% 0%,
      rgba(255,255,255,.08) 0%,
      rgba(255,255,255,0) 55%
    ),
    linear-gradient(180deg, rgba(8,17,26,.95) 0%, rgba(0,0,0,.95) 100%);

  box-shadow: 0 0 2px #fff;
}

.points-value {
  font-size: 1.2rem;
  font-weight: 600;
  font-family: 'Lexend Exa', sans-serif;
  color: white;
}

.points-icon {
  height: 1rem;
  width: auto;
}

.progress-section {
  display: flex;
  align-items: left;
  position: relative;
}

.progress-bar{
  flex: 1;
  height: 22px;              
  border-radius: 11px;      
  overflow: hidden;

  background:
    radial-gradient(120% 140% at 50% 0%,
      rgba(25,156,255,.25) 0%,   
      rgba(25,156,255,0) 55%
    ),
    linear-gradient(180deg,
      rgba(8,17,26,1) 0%,        
      rgba(3,8,14,1) 100%
    );

  box-shadow:
    inset 0 2px 4px rgba(255,255,255,.06),
    inset 0 -10px 16px rgba(0,0,0,.65),     
    0 0 10px rgba(25,156,255,.10);         
}

.progress-fill{
  height: 100%;
  border-radius: 11px;
  transition: left .3s ease;

  background:
    radial-gradient(120% 140% at 50% 0%,
      rgba(25,156,255,.7) 25%,
      rgba(25,156,255,.04) 100%
    );

  box-shadow:
    inset 0 1px 2px rgba(255,255,255,.10),
    inset 0 -8px 12px rgba(0,0,0,.55),
    inset 0 0 0 1px rgba(25,156,255,.18),
    0 0 12px rgba(25,156,255,.18);
}

.progress-text {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);

  font-size: 0.9rem;
  font-family: 'Lexend Exa', sans-serif;
  color: white;
}

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
  text-align: left;
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

.view-all-link-line{
  flex: 1;
  height: 1px;
  max-width: 50px;   
  background: #fff;
}

.view-all-link a{
  color: rgba(255,255,255,.7);
  font-family: 'Lexend Exa', sans-serif;
  font-size: .9rem;
  text-decoration: none;
  transition: color .2s ease;
}

.profile-buttons-jeec{
  display:flex;
  justify-content:space-between;
  gap:.75rem;
  padding:1rem 1rem;  
}

.profile-buttons-jeec button{
  position:relative;
  flex:1;

  cursor:pointer;
  overflow:hidden;

  display:flex;
  align-items:center;
  justify-content:center;

  background:transparent;
  transition:transform .18s ease, filter .18s ease;
}

.profile-buttons-jeec button::before{
  content:"";
  border-radius:inherit;

  background:var(--btn-border);
  z-index:0;

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;
          mask-composite:exclude;
}

.profile-buttons-jeec button::after{
  content:"";
  position:absolute;
  inset:2px;
  border-radius:inherit;
  z-index:1;
}

.profile-buttons-jeec button .btn-label{
  position:relative;
  z-index:2;
  line-height:1.05;
  text-align:center;
  color:rgba(255,255,255,.88);
  text-shadow:0 0 10px rgba(255,255,255,.22);
}

.profile-buttons-jeec .linkedin-button{
  border-radius: 45px;
  border: .5px solid #199CFF;
  width: 170px;
  height: 42px;

  background: linear-gradient(180deg,#0F3C5B 0%,#072A3F 100%);
  box-shadow:inset 0 0 0 .5px #199CFF, 0 0 18px rgba(25,156,255,.35);
}

.profile-buttons-jeec .cv-button{
  border-radius: 45px;
  border: .5px solid #7209B7;
  width: 161px;
  height: 42px;

  background:linear-gradient(180deg,#1B0F33 0%,#120A26 100%);
  box-shadow:inset 0 0 0 .5px #8A2DFF, 0 0 18px rgba(138,45,255,.35);
}

.profile-buttons-jeec button:hover{
  transform:scale(1.02);
  filter:brightness(1.05);
}
.profile-buttons-jeec button:active{
  transform:scale(.99);
}

.profile-buttons-jeec .icon {
  height: 1.8rem;
  width: auto;
}

.button-text {
  font-family:'Lexend Exa', sans-serif;
  line-height: 1.1rem;
  font-size: 13;
  font-weight: bolder;
  letter-spacing:.14em;
  text-transform:uppercase;
}

.squad-section {
  text-align: center;
  margin-top: 2rem;
}

.profile-buttons-jeec .create-squad-button{
  flex: 0 0 auto;   
  width: auto;        
  padding: 0;         
  background: none;
  box-shadow: none;
  border: 0;
  margin-left: auto;
  margin-right: auto;
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

.modal-body > p {
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

.inline-radio-group > p {
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
