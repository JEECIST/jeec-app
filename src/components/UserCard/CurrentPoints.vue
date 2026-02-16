<template>
<div class="wrapper" :class="variant">
    <div class="tickets-progress">

        <div class="tickets">
            <p class="tickets-value">{{ userDailyPoints }}</p>

            <span class="tickets-icon">
                <img src="@/assets/icons/flash_home.svg" aria-hidden="true" />
            </span>
        </div>
    </div>
</div>
</template>

<script>
import {
    ref,
    watch,
    defineProps
} from 'vue'
import {
    useUserStore
} from '@/stores/UserStore'
const userStore = useUserStore()

defineProps(['variant'])

const userDailyPoints = ref(0)

function getProgress() {
    if (userStore.userPoints.current_points == undefined) {
        userDailyPoints.value = 0
    } else {
        userDailyPoints.value = userStore.userPoints.current_points
    }
}

watch(
    () => userStore.userPoints,
    () => {
        getProgress()
    }, {
        immediate: true
    },
)
</script>

<style scoped>
.wrapper {
    width: 200px;
    height: 60%;
    display: flex;
    justify-content: flex-start;
}

.img {
    width: 50px;
    height: 380%;
    object-fit: contain;
}

.bar {
    text-align: right;
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    height: 100%;
}

.wrapper.profile>.bar {
    text-align: left;
}

/* pill container */
.tickets-progress {
    max-width: 80%;
    height: 34px;
    position: relative;

    border-radius: 999px;
    overflow: hidden;
    border: transparent;
    box-shadow:
        inset 2px 2px 4px rgba(255, 255, 255, 0.40),
        /* top-left mais forte */
        inset -2px -2px 4px rgba(255, 255, 255, 0.25),
        /* bottom-right */
        inset 1px 1px 2px rgba(0, 0, 0, 0.15),
        /* cantos restantes mais suave */
        inset -1px -1px 2px rgba(0, 0, 0, 0.1);

}

/* top shine strip */
.tickets-progress::after {
    content: "";
    position: absolute;
    left: 6px;
    right: 6px;
    top: 4px;
    height: 40%;
    border-radius: 999px;
    pointer-events: none;
}

.progress {
    background-size: 200%;
    align-content: center;
    justify-content: center;
    display: flex;
}

.tickets {
    padding: 6px 10px 6px 14px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    box-shadow: none;
}

/* number */
.tickets-value {
    font-family: 'Lexend Exa';
    font-size: 1.15rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    margin: 0;
    line-height: 1;
    white-space: nowrap;
}

/* icon circle */
.tickets-icon {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    display: grid;
    place-items: center;
}

.tickets-icon img {
    width: 1.5em;
    height: auto;
    object-fit: contain;
}

/* profile sizing (keeps your intent) */
.wrapper.profile .tickets-progress {
    height: 34px;
}

/* keep your base p defaults without fighting the new class */
p {
    font-family: 'Lexend Exa';
    color: var(--color-font);
    overflow: hidden;
}
</style>
