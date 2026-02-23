<template>
    <div v-if="!add_member_flag">
        <p class="section-label">Your Squad</p>
        <div class="squad-card">
            <div class="leave-squad-section">
                <button @click="leaveSquad">
                    <img :src="squadLeaveImg">
                </button>
            </div>
            <div class="squad-header">
                <div class="squad-big-avatar">
                    <img :src="jeec_brain_url + squad.image" alt="Squad" />
                </div>

                <div class="squad-name">
                    <p>{{ (squad && squad.name) ? squad.name : name }}</p>
                </div>
            </div>

            <newMember @kicked="kickedMember" @openPicker="openMemberPicker" :members="squad.members?.data"></newMember>

        </div>
    </div>
    <div v-if="add_member_flag">
        <newMemberPicker @closePicker="closeMemberPicker"></newMemberPicker>
    </div>
</template>

<script setup>
import UserService from '@/services/user.service'
import { onMounted, ref } from 'vue'

import newMember from '@/components/Squads/newMember.vue'
import newMemberPicker from '@/components/Squads/newMemberPicker.vue'
import squadLeaveImg from '@/assets/leave_squad.png'

const slots = ref([null, null, null, null])
const jeec_brain_url = ref(import.meta.env.VITE_APP_JEEC_BRAIN_URL)

const add_member_flag = ref(false)

const props = defineProps({
    squad: {
        type: Object,
        default: null,
    }
})

const emit = defineEmits(['delete'])

function openMemberPicker() {
    add_member_flag.value = true
}

function closeMemberPicker() {
    add_member_flag.value = false
}

async function leaveSquad() {

    if (!confirm("Are you sure you want to leave squad? You will lose all your squad points.")) {
        return
    }

    const response = await UserService.leaveSquad()
    console.log("Response leave squad:", response.data)

    emit("delete")
}

function kickedMember() {
    emit("delete")
}
</script>

<style scoped>
.leave-squad-section {
    position: absolute;
    top: 16px;
    /* Matches the padding of your squad-card */
    right: 16px;
    z-index: 10;
}

/* Style the button and add a nice hover effect */
.leave-squad-section button {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    /* Slightly faded so it doesn't distract from the card */
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.leave-squad-section button:hover {
    opacity: 1;
    transform: scale(1.1);
}

.leave-squad-section button:active {
    transform: scale(0.95);
}

/* Fix the selector so it ONLY targets the leave image */
.leave-squad-section button img {
    height: 1.5rem;
    width: auto;
    object-fit: contain;
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
</style>
