<template>
    <div>
        <p class="section-label">Add members</p>

        <div class="member-search">
            <input class="member-search-input" type="text" v-model="memberQuery" placeholder="Search for username"
                autofocus />
        </div>

        <div class="member-list">
            <div class="member-row" v-for="m in filteredMembers" :key="m">
                <span class="member-name">{{ m }}</span>
                <button class="member-add" type="button" @click="selectMember(m)">
                    Invite
                </button>
            </div>
        </div>

        <button class="create-btn" type="button" @click="backToSlots">
            Back
        </button>
    </div>
</template>

<script setup>

import { ref, computed } from 'vue'

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
const members = ref(usernames)

// Transform this into a computed property for real-time reactivity
const filteredMembers = computed(() => {
    const q = memberQuery.value.trim().toLowerCase()

    if (!q) return []

    return members.value
        .filter((m) => m.toLowerCase().startsWith(q))
        .slice(0, 4)
})

function selectMember(m) {
    // Send post to send invite
    console.log(m)
}

function backToSlots() {
    emit("closePicker")
}

</script>

<style scoped>
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
}

.member-search-input::placeholder {
    color: rgba(235, 233, 247, 0.5);
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