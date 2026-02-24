<template>
    <section class="tabs">
        <div v-for="(tab, index) in tabs" :key="index" class="tab" :class="{ active: activeTab === index }"
            @click="setActiveTab(index)">
            {{ tab }}
        </div>
    </section>
</template>

<script setup>

const emit = defineEmits(['tab'])

const props = defineProps({
    tabs: {
        type: [Array],
        default: () => [null],
    },
    activeTab: {
        type: Number,
        default: 0
    }
})

function setActiveTab(index) {
    emit('tab', index)
}

</script>

<style scoped>
.tabs {
    position: relative;
    display: flex;
    justify-content: center;
    overflow: hidden;
    gap: 10px;
    padding: 3px;
    width: 100%;
    top: -10px;
}

.tab {
    text-align: center;
    flex: 1;
    padding-top: 10px;
    padding-bottom: 10px;
    letter-spacing: 0.1em;
    overflow: auto;
    font-size: 0.7rem;
    font-weight: 600;
    color: white;
    position: relative;
    cursor: pointer;
    width: fit-content;
    transition: all 0.3s ease-in-out;
    font-family: var(--font-schedule);
    opacity: 0.3;
    --tab-color: var(--color-jeec-blue);
}

.tab::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-50%);
    transition: opacity 0.1s ease-in-out;
    opacity: 0.3;
    background: radial-gradient(ellipse at top center,
            var(--tab-color) 1%,
            rgba(255, 255, 255, 0) 75%);
    z-index: -3;
}

.tab.active {
    opacity: 1;
    font-size: 0.75rem;
    transform: scale(1.05);
}

.tab:hover::before {
    opacity: 0.5;
}

.tab.active::before {
    opacity: 0.5;
}

.tab:first-child {
    border-radius: 10px 0 0 0;
}

.tab:last-child {
    border-radius: 0 10px 0 0;
}

.tab:not(:first-child):not(:last-child) {
    border-radius: 0;
}

.tab::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--color-jeec-blue) 0%, var(--color-magenta) 51%, var(--color-light-green) 100%);
    border-radius: inherit;
    background-size: calc(300% + 20px) 100%;
    pointer-events: none;
}

.tab:nth-child(1)::after {
    background-position: 0% 0;
}

.tab:nth-child(2)::after {
    background-position: 50% 0;
}

.tab:nth-child(3)::after {
    background-position: 100% 0;
}
</style>
