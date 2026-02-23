<template>
    <div class="member-grid">
        <div class="member-slot creator-slot">
            <div class="member-circle creator-circle">
                <img v-if="safeMembers[0] && safeMembers[0].photo" :src="safeMembers[0].photo" alt="" />
                <span v-else-if="safeMembers[0] && safeMembers[0].name" class="creator-initials">{{
                    initials(safeMembers[0].name)
                    }}</span>
                <span v-else class="plus">👤</span>
            </div>
            <div class="member-label creator-label">
                <p>{{ safeMembers[0] && safeMembers[0].name ? safeMembers[0].name.split(' ')[0] : 'You' }}</p>
            </div>
        </div>

        <button v-for="i in [1, 2, 3]" :key="i" class="member-slot" type="button" @click="openPicker()">
            <div class="member-circle">
                <img v-if="safeMembers[i] && safeMembers[i].photo" :src="safeMembers[i].photo" alt="" />
                <span v-else class="plus">+</span>
            </div>
            <div class="member-label">
                <p>{{ safeMembers[i] && safeMembers[i].name ? safeMembers[i].name.split(' ')[0] : 'Invite' }}</p>
            </div>
        </button>
    </div>
</template>

<script setup>

import { computed } from 'vue'

const emit = defineEmits(['openPicker'])

const props = defineProps({
    members: {
        type: [Array, Object], // Temporarily allow both to clear the warning
        default: () => [null, null, null, null],
    }
})

const safeMembers = computed(() => {
    let dataArray = [];
    if (props.members && props.members.data && Array.isArray(props.members.data)) {
        dataArray = props.members.data;
    } else if (Array.isArray(props.members)) {
        dataArray = props.members;
    }

    const captain = dataArray.find(m => m && m.is_captain === true);
    const regularMembers = dataArray.filter(m => m && m.is_captain !== true);

    const finalSlots = [null, null, null, null];

    if (captain) {
        finalSlots[0] = captain;
    }

    let nextAvailableSlot = captain ? 1 : 0;

    for (const member of regularMembers) {
        if (nextAvailableSlot < 4) {
            finalSlots[nextAvailableSlot] = member;
            nextAvailableSlot++;
        }
    }

    return finalSlots;
});

function initials(name) {
    if (!name) return '?'
    return name
        .split(' ')
        .slice(0, 2)
        .map(function (w) { return w[0] })
        .join('')
        .toUpperCase()
}

function openPicker() {
    emit('openPicker')
}

</script>

<style scoped>
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

.member-label p {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}
</style>