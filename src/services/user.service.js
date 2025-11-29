import axios from 'axios'
import authHeader from './auth-header'

const jeec_brain_url = import.meta.env.VITE_APP_JEEC_BRAIN_URL

class UserService {
  getUser() {
    return axios.get(jeec_brain_url + '/student/info', {
      headers: authHeader(),
    })
  }

  todayLogin() {
    return axios.get(jeec_brain_url + '/student/today-login', {
      headers: authHeader(),
    })
  }

  redeemCode(code) {
    return axios.post(
      jeec_brain_url + '/student/redeem-code',
      { code: code },
      { headers: authHeader() },
    )
  }

  addLinkedin(url) {
    return axios.post(
      jeec_brain_url + '/student/add-linkedin',
      { url: url },
      { headers: authHeader() },
    )
  }

  addCVNOVO(formData) {
    return axios.post(jeec_brain_url + '/student/add-cv-novo', formData, {
      headers: {
        ...authHeader(), // Keep auth headers
        // DO NOT manually set Content-Type!
      },
    })
  }

  addCV() {
    return axios.post(jeec_brain_url + '/student/add-cv', {
      headers: {
        ...authHeader(),
      },
    })
  }

  getCV() {
    return axios.get(jeec_brain_url + '/student/cv', { headers: authHeader() })
  }

  getUserSquad() {
    return axios.get(jeec_brain_url + '/student/squad', {
      headers: authHeader(),
    })
  }

  createSquad(formData) {
    return axios.post(jeec_brain_url + '/student/squad', formData, {
      headers: {
        ...{
          'Content-Type': 'multipart/form-data',
        },
        ...authHeader(),
      },
    })
  }

  getStudentsAll() {
    return axios.post(jeec_brain_url + '/student/studentsAll2', {
      headers: authHeader(),
    })
  }

  getStudents(search) {
    return axios.get(jeec_brain_url + '/student/students?search=' + search, {
      headers: authHeader(),
    })
  }

  getUserStudent() {
    return axios.get(jeec_brain_url + '/student/studentUser', { headers: authHeader() })
  }

  getDailyTicket() {
    return axios.get(jeec_brain_url + '/student/dailyTicket', { headers: authHeader() })
  }

  inviteSquad(members) {
    return axios.post(
      jeec_brain_url + '/student/invite-squad',
      { members: [members] },
      { headers: authHeader() },
    )
  }

  cancelInvitation(id) {
    return axios.post(
      jeec_brain_url + '/student/cancel-invitation',
      { id: id },
      { headers: authHeader() },
    )
  }

  getSquadInvitationsReceived() {
    return axios.get(jeec_brain_url + '/student/squad-invitations-received', {
      headers: authHeader(),
    })
  }

  getSquadInvitationsSent() {
    return axios.get(jeec_brain_url + '/student/squad-invitations-sent', {
      headers: authHeader(),
    })
  }

  leaveSquad() {
    return axios.post(jeec_brain_url + '/student/leave-squad', null, {
      headers: authHeader(),
    })
  }

  acceptInvitation(invitation_id) {
    return axios.post(
      jeec_brain_url + '/student/accept-invitation',
      { invitation_id: invitation_id },
      { headers: authHeader() },
    )
  }

  rejectInvitation(invitation_id) {
    return axios.post(
      jeec_brain_url + '/student/reject-invitation',
      { invitation_id: invitation_id },
      { headers: authHeader() },
    )
  }

  kickMember(username) {
    return axios.post(
      jeec_brain_url + '/student/kick-member',
      { username: username },
      { headers: authHeader() },
    )
  }

  async getActivities(date) {
    return axios.get(jeec_brain_url + '/student/activities?date=' + date, {
      headers: authHeader(),
    })
  }

  async getJobFair() {
    return axios.get(jeec_brain_url + '/student/job-fair', {
      headers: authHeader(),
    })
  }

  async getPastActivities(date) {
    return axios.get(jeec_brain_url + '/student/past-activities?date=' + date, {
      headers: authHeader(),
    })
  }

  getNextActivity() {
    return axios.get(jeec_brain_url + '/student/next_activity', {
      headers: authHeader(),
    })
  }

  getQuests() {
    return axios.get(jeec_brain_url + '/student/quests', {
      headers: authHeader(),
    })
  }

  getTags() {
    return axios.get(jeec_brain_url + '/student/tags', {
      headers: authHeader(),
    })
  }

  addTags(tags) {
    return axios.post(
      jeec_brain_url + '/student/add-tags',
      { tags: tags },
      { headers: authHeader() },
    )
  }

  deleteTag(tag) {
    return axios.post(
      jeec_brain_url + '/student/delete-tag',
      { tag: tag },
      { headers: authHeader() },
    )
  }

  getCompanies() {
    return axios.get(jeec_brain_url + '/student/companies', {
      headers: authHeader(),
    })
  }

  addCompanies(companies) {
    return axios.post(
      jeec_brain_url + '/student/add-companies',
      { companies: companies },
      { headers: authHeader() },
    )
  }

  deleteCompany(company) {
    return axios.post(
      jeec_brain_url + '/student/delete-company',
      { company: company },
      { headers: authHeader() },
    )
  }

  getStudentsRanking() {
    return axios.get(jeec_brain_url + '/student/students-ranking', {
      headers: authHeader(),
    })
  }

  getDailyStudentsRanking() {
    return axios.get(jeec_brain_url + '/student/daily-students-ranking', {
      headers: authHeader(),
    })
  }

  getSquadsRanking() {
    return axios.get(jeec_brain_url + '/student/squads-ranking', {
      headers: authHeader(),
    })
  }

  getSquadsLength() {
    return axios.get(jeec_brain_url + '/student/get_length_squads', {
      headers: authHeader(),
    })
  }

  getDailySquadsRanking() {
    return axios.get(jeec_brain_url + '/student/daily-squads-ranking', {
      headers: authHeader(),
    })
  }

  getAllRanking() {
    return axios.get(jeec_brain_url + '/student/get_all_rankings', {
      headers: authHeader(),
    })
  }

  getTodaySquadReward() {
    return axios.get(jeec_brain_url + '/student/today-squad-reward', {
      headers: authHeader(),
    })
  }

  getLevels() {
    return axios.get(jeec_brain_url + '/student/levels', {
      headers: authHeader(),
    })
  }

  getSquadsRewards() {
    return axios.get(jeec_brain_url + '/student/squads-rewards', {
      headers: authHeader(),
    })
  }

  getJEECPOTRewards() {
    return axios.get(jeec_brain_url + '/student/jeecpot-rewards', {
      headers: authHeader(),
    })
  }

  getChatToken() {
    return axios.get(jeec_brain_url + '/student/chat-token', {
      headers: authHeader(),
    })
  }

  getPartners() {
    return axios.get(jeec_brain_url + '/student/partners', {
      headers: authHeader(),
    })
  }

  getPartner(name) {
    return axios.get(jeec_brain_url + '/student/partner?name=' + name, {
      headers: authHeader(),
    })
  }

  getChatRoom(partner = '', user_id = '') {
    return axios.get(
      jeec_brain_url + '/student/chat-room?company=' + partner + '&member=' + user_id,
      { headers: authHeader() },
    )
  }

  getNotifications() {
    return axios.get(jeec_brain_url + '/student/notifications', {
      headers: authHeader(),
    })
  }

  getEventInfo() {
    return axios.get(jeec_brain_url + '/student/event-info', {
      headers: authHeader(),
    })
  }

  async getEventDates() {
    return axios.get(jeec_brain_url + '/student/event-dates', {
      headers: authHeader(),
    })
  }

  getQuestProgress() {
    return axios.get(jeec_brain_url + '/student/quest', {
      headers: authHeader(),
    })
  }

  getIsSubscribed() {
    return axios.get(jeec_brain_url + '/student/push/is_subscribed', {
      headers: authHeader(),
    })
  }
}

export default new UserService()
