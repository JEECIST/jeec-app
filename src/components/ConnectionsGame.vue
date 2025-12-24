<template>
  <div class="connections-game">
    <h1>Connections-Style Game</h1>

    <div class="found-groups">
      <div
        v-for="group in foundGroups"
        :key="group.theme"
        class="found-group"
        :style="{ backgroundColor: group.color }"
      >
        <strong>{{ group.theme }}</strong>
        <p>{{ group.words.join(', ') }}</p>
      </div>
    </div>

    <div v-if="gameStatus !== 'playing'" class="game-over-message">
      <h2 v-if="gameStatus === 'won'">You win! 🎉</h2>
      <h2 v-if="gameStatus === 'lost'">Out of mistakes. Better luck next time!</h2>
      <button @click="initializeGame">Play Again</button>
    </div>

    <div v-if="gameStatus === 'playing'" class="word-grid" :class="{ shake: isShaking }">
      <button
        v-for="word in activeWords"
        :key="word.text"
        class="word-item"
        :class="{ 'selected': word.selected }"
        @click="toggleWordSelect(word)"
      >
        {{ word.text }}
      </button>
    </div>


    <div v-if="gameStatus === 'playing'" class="mistakes">
      Mistakes remaining:
      <span
        v-for="n in mistakesRemaining"
        :key="n"
        class="mistake-dot"
      >●</span>
    </div>

    <div v-if="gameStatus === 'playing'" class="controls">
      <button @click="shuffleActiveWords">Shuffle</button>
      <button @click="deselectAll">Deselect All</button>
      <button
        @click="submitSelection"
        :disabled="selectedWords.length !== 4"
      >
        Submit
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'

const puzzleData = ref({ groups: {} })

function formatDateYYYYMMDD(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Toggle this while developing:
const DEV_FORCE_DAY = "2025-05-05"  // set to null to use real today

const event_days = ['2026-02-10', '2026-02-11', '2026-02-12', '2026-02-13', '2026-02-14']
// Fetch prizes data from the backend
async function fetchConnectionsForDay() {
  const day = DEV_FORCE_DAY ?? formatDateYYYYMMDD(new Date())

  const res = await axios.get(
    import.meta.env.VITE_APP_JEEC_BRAINSTUDENT_URL + `/connections/day`,
    { params: { day } }
  )

  // expected backend shape: [{ day, category, word }, ...]
  const rows = res.data || []

  // group by category
  const byCategory = {}
  for (const r of rows) {
    if (!byCategory[r.category]) byCategory[r.category] = []
    byCategory[r.category].push(r.word)
  }

  // build the groups object the game expects
  const groups = {}
  let i = 1
  for (const [category, words] of Object.entries(byCategory)) {
    groups[`group${i}`] = {
      theme: category,
      words,
      color: "#4CC9F0", // you can map difficulty->color later
    }
    i++
  }

  puzzleData.value = { groups }
}


const activeWords = ref([]);
const foundGroups = ref([]);
const mistakesRemaining = ref(4);
const gameStatus = ref('playing');

const isShaking = ref(false);

function shakeGrid() {
  isShaking.value = true;
  setTimeout(() => {
    isShaking.value = false;
  }, 300); // duration matches CSS
}

// A utility function for shuffling an array (Fisher-Yates shuffle)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function initializeGame() {
  foundGroups.value = [];
  mistakesRemaining.value = 4;
  gameStatus.value = 'playing';
  activeWords.value = [];

  let allWords = [];
  for (const groupId in puzzleData.value.groups) {
    const group = puzzleData.value.groups[groupId];
    group.words.forEach(wordText => {
      allWords.push({
        text: wordText,
        group: groupId,
        selected: false,
      });
    });
  }

  activeWords.value = shuffle(allWords);
}


// Called when the component is first created.
onMounted(async () => {
  await fetchConnectionsForDay()
  initializeGame()
  console.log(puzzleData.value);
})


// Computed property to get the currently selected words
const selectedWords = computed(() => {
  return activeWords.value.filter(word => word.selected);
});

// Handles clicking on a word in the grid
function toggleWordSelect(word) {
  if (selectedWords.value.length >= 4 && !word.selected) {
    return;
  }
  word.selected = !word.selected;
}

// Shuffles only the words remaining in the grid
function shuffleActiveWords() {
  activeWords.value = shuffle([...activeWords.value]);
}

// Clears all current selections
function deselectAll() {
  activeWords.value.forEach(word => {
    word.selected = false;
  });
}

// The main logic: checking if the 4 selected words are a correct group
function submitSelection() {
  if (selectedWords.value.length !== 4) return;

  // Check if all selected words belong to the same group
  const firstGroup = selectedWords.value[0].group;
  const isCorrectGroup = selectedWords.value.every(
    word => word.group === firstGroup
  );

  if (isCorrectGroup) {
    const groupInfo = puzzleData.value.groups[firstGroup];

    foundGroups.value.push({
      theme: groupInfo.theme,
      words: groupInfo.words,
      color: groupInfo.color,
    });

    // 3. Sort foundGroups by color (Yellow, Green, Blue, Purple)
    const colorOrder = { "#f9df6d": 1, "#a0c35a": 2, "#b0c4ef": 3, "#d1a2dd": 4 };
    foundGroups.value.sort((a, b) => colorOrder[a.color] - colorOrder[b.color]);

    // 4. Remove the found words from the active grid
    activeWords.value = activeWords.value.filter(
      word => !word.selected
    );

    // 5. Check for win condition
    if (activeWords.value.length === 0) {
      gameStatus.value = 'won';
    }

  } else {
    // --- INCORRECT GUESS ---
    mistakesRemaining.value--;

    // Check for lose condition
    if (mistakesRemaining.value === 0) {
      gameStatus.value = 'lost';
    }

    // You could add a 'shake' animation here before deselecting
    shakeGrid();
    setTimeout(() => {
      deselectAll();
    }, 300);

  }
}
</script>

<style>

.word-grid.shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-6px); }
  40%  { transform: translateX(6px); }
  60%  { transform: translateX(-6px); }
  80%  { transform: translateX(6px); }
  100% { transform: translateX(0); }
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
  height: 70px; /* Ensures consistent height */
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
