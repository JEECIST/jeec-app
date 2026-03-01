<template>
    <div>
        <p class="section-label">Add members</p>

        <div class="member-search">
            <input class="member-search-input" type="text" v-model="memberQuery" placeholder="Search for username"
                autofocus />
        </div>

        <TransitionGroup name="list" tag="div" class="member-list">
            <div class="member-row" v-for="m in filteredMembers" :key="m">
                <span class="member-name">
                    <p>{{ m }}</p>
                </span>
                <button class="member-add" type="button" @click="inviteMember(m)">
                    Invite
                </button>
            </div>
        </TransitionGroup>

        <button class="create-btn" type="button" @click="backToSlots">
            Back
        </button>
    </div>
</template>

<script setup>
import UserService from '@/services/user.service'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import authHeader from '@/services/auth-header'

const emit = defineEmits(['closePicker'])

const usernames = [
    "joao_silva",
    "ana_martins",
    "ana_rebola",
    "anastasia",
    "ana_borges",
    "pedro_costa",
    "catarina_dias",
    "tiago_ferreira",
    "sofia_gomes",
    "miguel_rodrigues",
    "beatriz_sousa",
    "rui_carvalho",
    "ines_lopes"
]

const memberQuery = ref("")
const members = ref([])

// Transform this into a computed property for real-time reactivity
const filteredMembers = computed(() => {
    const q = memberQuery.value.trim().toLowerCase()

    if (!q) return []

    return members.value
        .filter((m) => m.toLowerCase().startsWith(q))
        .slice(0, 4)
})

async function inviteMember(m) {
    const response = await UserService.inviteSquad(m)

}

function backToSlots() {
    emit("closePicker")
}

onMounted(async () => {
    const response = await axios.get(
        import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/get-all-usernames',
        {
            headers: authHeader(),
        },
    )
    if (response.data) {
        members.value = response.data.usernames
    }
})

</script>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.25s ease-out;
    overflow: hidden;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: scale(0.95);
    min-height: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    border-color: transparent;
}

.list-enter-to,
.list-leave-from {
    max-height: 50px;
}

.section-label {
    width: 100%;
    max-width: 21rem;
    margin: 0 auto 0.5rem auto;
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    text-align: left;
}

.member-search {
    width: 100%;
    max-width: 21rem;
    min-height: 2.25rem;
    margin: 0 auto;
    border-radius: 999rem;
    border: 0.5px solid #00E5FF;
    padding: 0 1rem;

    display: flex;
    align-items: center;
    font-family: inherit;
}

.member-search-input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;

    font-size: 0.95rem;
    font-weight: 500;
    color: #EBE9F7;
    font-family: inherit;
}

.member-search-input::placeholder {
    color: rgba(235, 233, 247, 0.5);
    font-family: inherit;
}

.member-list {
    width: 100%;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.member-row {
    width: 100%;
    max-width: 21rem;
    min-height: 2.25rem;
    border: 0.5px solid #00E5FF;
    border-radius: 1.125rem;
    padding: 0.65rem 1rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

.member-name {
    color: #EBE9F7;
    font-size: 0.9rem;

    font-weight: 600;

    padding: auto;
}

.member-add {
    background: transparent;
    border: solid #00E5FF 1px;
    border-radius: 10px;
    color: #00E5FF;

    font-size: 0.8rem;

    font-weight: 600;

    cursor: pointer;
    padding: 0.2rem 0.4rem;
    transition: color 0.2s ease, transform 0.2s ease;
}

.member-add:hover {
    color: rgba(255, 255, 255, 0.95);
    transform: scale(1.05);

}

.create-btn {
    margin-top: 0.7rem;
    padding: 0.75rem 1.5rem;

    border-radius: 999rem;

    background:
        radial-gradient(130% 120% at 50% 0%, rgba(0, 229, 255, 0.36) 0%, rgba(0, 0, 0, 0) 100%);
    border: 1.5px solid rgba(0, 229, 255, 0.78);

    color: rgba(255, 255, 255, 0.9);

    font-weight: 700;
    font-size: 0.85rem;


    letter-spacing: .03rem;

    box-shadow:
        0 0 0 1px rgba(0, 229, 255, 0.28) inset,
        0 0 8px rgba(0, 229, 255, 0.18);

    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);

    display: block;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;

    transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.create-btn:hover {
    box-shadow:
        0 0 0 1px rgba(0, 229, 255, 0.36) inset,
        0 0 12px rgba(0, 229, 255, 0.30);

}

.create-btn:active {
    transform: translateY(1px);

    opacity: 0.92;
}
</style>