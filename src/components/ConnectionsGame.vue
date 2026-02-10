<template>
  <div class="connections-game">
    <h1>Connections-Style Game</h1>

    <div class="found-groups">
      <div v-for="group in foundGroups" :key="group.theme" class="found-group"
        :style="{ backgroundColor: group.color }">
        <strong>{{ group.theme }}</strong>
        <p>{{ group.words.join(', ') }}</p>
      </div>
    </div>

    <div v-if="gameStatus !== 'playing'" class="game-over-message">
      <h2 v-if="gameStatus === 'won'">You win! 🎉</h2>
      <h2 v-if="gameStatus === 'lost'">Out of mistakes. Better luck next time!</h2>
      <button @click="playAgain">Play Again</button>
    </div>

    <div v-if="gameStatus === 'playing'" class="word-grid" :class="{ shake: isShaking }">
      <button v-for="word in activeWords" :key="word.text" class="word-item" :class="{ 'selected': word.selected }"
        @click="toggleWordSelect(word)">
        {{ word.text }}
      </button>
    </div>


    <div v-if="gameStatus === 'playing'" class="mistakes">
      Mistakes remaining:
      <span v-for="n in mistakesRemaining" :key="n" class="mistake-dot">●</span>
    </div>

    <div v-if="gameStatus === 'playing'" class="controls">
      <button @click="shuffleActiveWords">Shuffle</button>
      <button @click="deselectAll">Deselect All</button>
      <button @click="submitSelection" :disabled="selectedWords.length !== 4">
        Submit
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import authHeader from '@/services/auth-header'
import { useConnectionsStore } from '@/stores/ConnectionsStore'
import { storeToRefs } from 'pinia'

const store = useConnectionsStore()
const { puzzleGroups, wordsInPlay, foundGroups, tries, gameStatus, puzzleDateStamp } = storeToRefs(store)

const isShaking = ref(false)

function shakeGrid() {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 300)
}

// Fisher-Yates
function shuffle(array) {
  let currentIndex = array.length, randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}

// Fetch puzzle for Lisbon dayStamp, return { groups }
async function fetchConnectionsForDay(dayStamp) {
  const res = await axios.post(
    import.meta.env.VITE_APP_JEEC_BRAIN_URL + '/student/connections/day',
    { day: dayStamp },
    { headers: authHeader() },
  )
  const rows = res.data || []
  const byCategory = {}

  for (const r of rows) {
    if (!byCategory[r.category]) byCategory[r.category] = []
    byCategory[r.category].push(r.word)
  }

  const groups = {}
  let i = 1
  for (const [category, words] of Object.entries(byCategory)) {
    groups[`group${i}`] = {
      theme: category,
      words,
      color: '#4CC9F0',
    }
    i++
  }

  return { groups }
}

function initializeGame() {
  store.startNewGameFromPuzzle(shuffle)
}

// --- mount bootstrap ---
onMounted(async () => {
  // 1) Hydrate progress+puzzle from localStorage
  store.hydrate()

  // 2) Auto-persist on any store change (no plugin needed)
  store.$subscribe(
    (_mutation, state) => {
      localStorage.setItem('connections-store-v1', JSON.stringify(state))
    },
    { detached: true },
  )

  const today = store.today()
  // 3) Fetch only if we don't already have today's puzzle cached
  if (!puzzleGroups.value || puzzleDateStamp.value !== today) {
    const { groups } = await fetchConnectionsForDay(today)
    store.setPuzzle(groups, today)
  }

  // 4) If no progress exists yet, start new game
  if (!wordsInPlay.value || wordsInPlay.value.length === 0) {
    initializeGame()
  }
})

// --- computed bindings ---
const activeWords = computed(() => wordsInPlay.value)
const mistakesRemaining = computed(() => tries.value)

const selectedWords = computed(() => {
  return (wordsInPlay.value || []).filter(w => w.selected)
})

// --- UI actions ---
function toggleWordSelect(word) {
  if (selectedWords.value.length >= 4 && !word.selected) return
  word.selected = !word.selected
}

function shuffleActiveWords() {
  store.wordsInPlay = shuffle([...store.wordsInPlay])
}

function deselectAll() {
  store.deselectAll()
}

// NOTE: This currently refetches (per your request).
// When you’re ready to stop refetching here, remove the fetch and just call initializeGame().
async function playAgain() {
  const today = store.today()
  const { groups } = await fetchConnectionsForDay(today) // TODO: remove to avoid refetch on "Play Again"
  store.setPuzzle(groups, today)
  initializeGame()
}

function submitSelection() {
  if (selectedWords.value.length !== 4) return

  const firstGroup = selectedWords.value[0].group
  const isCorrectGroup = selectedWords.value.every(w => w.group === firstGroup)

  if (isCorrectGroup) {
    const groupInfo = puzzleGroups.value[firstGroup]

    store.foundGroups.push({
      theme: groupInfo.theme,
      words: groupInfo.words,
      color: groupInfo.color,
    })

    const colorOrder = { '#f9df6d': 1, '#a0c35a': 2, '#b0c4ef': 3, '#d1a2dd': 4 }
    store.foundGroups.sort((a, b) => colorOrder[a.color] - colorOrder[b.color])

    store.wordsInPlay = store.wordsInPlay.filter(w => !w.selected)

    if (store.wordsInPlay.length === 0) {
      store.gameStatus = 'won'
    }
  } else {
    store.tries--

    if (store.tries === 0) {
      store.gameStatus = 'lost'
    }

    shakeGrid()
    setTimeout(() => {
      deselectAll()
    }, 300)
  }
}
</script>


<style>
.word-grid.shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-6px);
  }

  40% {
    transform: translateX(6px);
  }

  60% {
    transform: translateX(-6px);
  }

  80% {
    transform: translateX(6px);
  }

  100% {
    transform: translateX(0);
  }
}


/* Basic styling to make it look good */
.connections-game {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  max-width: 500px;
  margin: 20px auto;
  padding: 10px;
  text-align: center;
}

/* 1. Found Groups Styling */
.found-groups {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.found-group {
  border-radius: 8px;
  padding: 10px 15px;
  color: #121212;
  text-align: left;
}

.found-group strong {
  display: block;
  font-size: 1.1em;
  text-transform: uppercase;
}

.found-group p {
  margin: 4px 0 0;
  font-weight: 500;
}

/* 2. Win/Loss Styling */
.game-over-message {
  margin: 20px 0;
}

.game-over-message h2 {
  margin-bottom: 10px;
}

.game-over-message button {
  font-size: 1em;
  padding: 10px 15px;
  cursor: pointer;
}

/* 3. Word Grid Styling */
.word-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.word-item {
  background-color: #535353;
  border: 3px solid #4CC9F0;
  border-radius: 8px;
  padding: 20px 10px;
  font-size: 1em;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  height: 70px;
  /* Ensures consistent height */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in-out;
}

.word-item.selected {
  /* Style for a selected word */
  background-color: #e9dada;
  color: white;
  transform: scale(1.05);
}

/* 4. Mistakes Counter Styling */
.mistakes {
  font-size: 1.1em;
  margin-bottom: 20px;
}

.mistake-dot {
  color: #5a5a5a;
  font-size: 1.5em;
  margin-left: 5px;
}

/* 5. Control Buttons Styling */
.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.controls button {
  background-color: beige;
  border: 2px solid #5a5a5a;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  color: black;
}

.controls button:disabled {
  background-color: #efefef;
  border-color: #ccc;
  color: #999;
  cursor: not-allowed;
}

.controls button:not(:disabled):hover {
  background-color: beige;
  color: black;
}
</style>
