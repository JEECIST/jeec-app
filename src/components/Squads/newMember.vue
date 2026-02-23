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

        <button v-for="i in [1, 2, 3]" :key="i" class="member-slot" type="button"
            :style="{ cursor: safeMembers[i] ? 'default' : 'pointer' }" @click="openPicker(safeMembers[i])">

            <div class="member-circle">
                <div class="avatar-wrapper" v-if="safeMembers[i]">
                    <img class="avatar-img" v-if="safeMembers[i].photo" :src="safeMembers[i].photo" alt="" />
                    <span v-else class="creator-initials">{{ initials(safeMembers[i].name) }}</span>
                    <button v-if="userStore.user.username === captain_username" class="kick-cross"
                        @click.stop="kickMember(safeMembers[i])">
                        <img :src="cross">
                    </button>
                </div>

                <span v-else class="plus">+</span>
            </div>

            <div class="member-label">
                <p>{{ safeMembers[i] && safeMembers[i].name ? safeMembers[i].name.split(' ')[0] : 'Invite' }}</p>
            </div>
        </button>
    </div>
</template>

<script setup>

import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/UserStore';
import cross from '@/assets/cross.svg';
import UserService from '@/services/user.service';

const userStore = useUserStore()

const captain_username = ref("")

const emit = defineEmits(['openPicker', 'kicked'])

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
        captain_username.value = captain.username;
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

function openPicker(safeMember) {
    if (!safeMember) {
        emit('openPicker')
    }
}

async function kickMember(safeMember) {
    if (safeMember) {
        if (userStore.user.username === captain_username.value) {
            if (confirm(`Are you sure you want to kick ${safeMember.username} from your squad?`)) {
                const response = await UserService.kickMember(safeMember.username)
                emit('kicked')
            }
        }
        return;
    }
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

    position: relative;
    /* REQUIRED for the cross to overlap correctly */
}

.member-circle img {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    object-fit: cover;
    display: block;
}

/* Delete the generic .member-circle img { ... } that was here! */

.member-circle .avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    object-fit: cover;
    display: block;
}

/* Creates a safe zone for the image and cross to overlap */
.avatar-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Pins the cross to the top right corner of the avatar */
/* Styles the invisible button wrapper */
.kick-cross {
    position: absolute !important;
    width: 22px !important;
    height: 22px !important;

    /* Pin to top right corner of the circle */
    top: -2px !important;
    right: -2px !important;

    /* Remove default button background and padding */
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    cursor: pointer;

    z-index: 10 !important;
}

/* Styles the actual SVG image inside the button */
.kick-cross img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.6));
    /* Brings the shadow back to the cross! */
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