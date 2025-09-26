<template>
  <div class="wordle-page">    
    <!-- Game Grid -->
    <div class="game-grid">
      <div 
        v-for="(row, rowIndex) in gameGrid" 
        :key="rowIndex" 
        class="grid-row"
      >
        <div 
          v-for="(cell, cellIndex) in row" 
          :key="cellIndex" 
          class="grid-cell"
          :class="{
            'filled': cell.letter,
            'correct': cell.status === 'correct',
            'present': cell.status === 'present',
            'absent': cell.status === 'absent',
            'reveal': cell.revealing,
            'bounce': cell.bouncing
          }"
        >
          {{ cell.letter }}
        </div>
      </div>
    </div>

    <!-- Keyboard -->
    <div class="keyboard">
      <div class="keyboard-row">
        <button 
          v-for="key in firstRow" 
          :key="key" 
          class="key"
          :class="getKeyClass(key)"
          @click="handleKeyPress(key)"
        >
          {{ key }}
        </button>
      </div>
      <div class="keyboard-row">
        <button 
          v-for="key in secondRow" 
          :key="key" 
          class="key"
          :class="getKeyClass(key)"
          @click="handleKeyPress(key)"
        >
          {{ key }}
        </button>
      </div>
      <div class="keyboard-row">
        <button 
          class="key special-key"
          @click="handleKeyPress('ENTER')"
        >
          ENTER
        </button>
        <button 
          v-for="key in thirdRow" 
          :key="key" 
          class="key"
          :class="getKeyClass(key)"
          @click="handleKeyPress(key)"
        >
          {{ key }}
        </button>
        <button 
          class="key special-key"
          @click="handleKeyPress('BACKSPACE')"
        >
          ⌫
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <ToastNotification
      :message="toastMessage"
      :type="toastType"
      :visible="showToast"
      @close="showToast = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToastNotification from '@/components/Squads/ToastNotification.vue'

// Game configuration
const TARGET_WORD = 'JEEEC'
const MAX_ATTEMPTS = 6
const WORD_LENGTH = 5

// Game state
const currentRow = ref(0)
const currentCol = ref(0)
const gameStatus = ref('playing') // 'playing', 'won', 'lost'
const isRevealing = ref(false) // Prevents input during reveal animation

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Initialize game grid (6 rows x 5 columns)
const gameGrid = ref(
  Array(6).fill().map(() => 
    Array(5).fill().map(() => ({
      letter: '',
      status: '', // 'correct', 'present', 'absent'
      revealing: false,
      bouncing: false
    }))
  )
)

// Keyboard layout
const firstRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
const secondRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
const thirdRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']

// Track keyboard key states
const keyStates = ref({})

// Show toast notification
const showNotification = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

// Get current word being typed
const getCurrentWord = () => {
  return gameGrid.value[currentRow.value]
    .map(cell => cell.letter)
    .join('')
}

// Handle letter input
const addLetter = (letter) => {
  if (isRevealing.value || gameStatus.value !== 'playing') return
  
  if (currentCol.value < WORD_LENGTH && currentRow.value < MAX_ATTEMPTS) {
    const cell = gameGrid.value[currentRow.value][currentCol.value]
    cell.letter = letter
    cell.bouncing = true
    
    // Remove bounce class after animation completes
    setTimeout(() => {
      cell.bouncing = false
    }, 200)
    
    currentCol.value++
  }
}

// Handle backspace
const removeLetter = () => {
  if (isRevealing.value || gameStatus.value !== 'playing') return
  
  if (currentCol.value > 0) {
    currentCol.value--
    gameGrid.value[currentRow.value][currentCol.value].letter = ''
  }
}

// Check word and provide feedback
const checkWord = () => {
  if (isRevealing.value || gameStatus.value !== 'playing') return
  
  const currentWord = getCurrentWord()
  
  if (currentWord.length !== WORD_LENGTH) {
    // Word is not complete
    return
  }
  
  const row = gameGrid.value[currentRow.value]
  const targetLetters = TARGET_WORD.split('')
  const guessLetters = currentWord.split('')
  
  // First pass: mark correct letters
  const targetLetterCounts = {}
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = targetLetters[i]
    targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1
    
    if (guessLetters[i] === letter) {
      targetLetterCounts[letter]--
    }
  }
  
  // Second pass: determine all statuses first
  const statuses = []
  const keyUpdates = []
  
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = guessLetters[i]
    
    if (guessLetters[i] === targetLetters[i]) {
      statuses[i] = 'correct'
      keyUpdates.push({ letter, status: 'correct' })
    } else if (targetLetters.includes(letter) && targetLetterCounts[letter] > 0) {
      statuses[i] = 'present'
      targetLetterCounts[letter]--
      keyUpdates.push({ letter, status: 'present' })
    } else {
      statuses[i] = 'absent'
      keyUpdates.push({ letter, status: 'absent' })
    }
  }
  
  // Set revealing state to block input
  isRevealing.value = true
  
  // Apply reveal animation with staggered timing
  for (let i = 0; i < WORD_LENGTH; i++) {
    setTimeout(() => {
      row[i].revealing = true
      row[i].status = statuses[i]
      updateKeyState(keyUpdates[i].letter, keyUpdates[i].status)
      
      // Remove revealing class after animation completes
      setTimeout(() => {
        row[i].revealing = false
      }, 600)
    }, i * 400) // Stagger each cell by 400ms
  }
  
  // Check win/lose conditions after all animations complete
  setTimeout(() => {
    isRevealing.value = false // Allow input again
    
    if (currentWord === TARGET_WORD) {
      gameStatus.value = 'won'
      showNotification('Congratulations! You won!', 'success')
      return
    }
    
    // Move to next row
    currentRow.value++
    currentCol.value = 0
    
    // Check lose condition
    if (currentRow.value >= MAX_ATTEMPTS) {
      gameStatus.value = 'lost'
      showNotification(`Game Over! The word was: ${TARGET_WORD}`, 'error')
    }
  }, WORD_LENGTH * 400 + 100) // Wait for all animations to complete
}

// Update keyboard key states
const updateKeyState = (letter, status) => {
  const currentState = keyStates.value[letter]
  
  // Priority: correct > present > absent
  if (currentState === 'correct') return
  if (currentState === 'present' && status === 'absent') return
  
  keyStates.value[letter] = status
}

// Get keyboard key class
const getKeyClass = (key) => {
  const state = keyStates.value[key]
  return {
    'key-correct': state === 'correct',
    'key-present': state === 'present',
    'key-absent': state === 'absent'
  }
}

// Handle key press
const handleKeyPress = (key) => {
  if (gameStatus.value !== 'playing' || isRevealing.value) return
  
  if (key === 'ENTER') {
    checkWord()
  } else if (key === 'BACKSPACE') {
    removeLetter()
  } else if (key.length === 1 && /[A-Z]/.test(key)) {
    addLetter(key)
  }
}

// Handle physical keyboard input
const handlePhysicalKeyPress = (event) => {
  const key = event.key.toUpperCase()
  
  if (key === 'ENTER') {
    handleKeyPress('ENTER')
  } else if (key === 'BACKSPACE') {
    handleKeyPress('BACKSPACE')
  } else if (/^[A-Z]$/.test(key)) {
    handleKeyPress(key)
  }
}

// Add keyboard event listener
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  window.addEventListener('keydown', handlePhysicalKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handlePhysicalKeyPress)
})
</script>

<style scoped>
.wordle-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: clamp(0.5rem, 2vw, 1rem);
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  gap: clamp(1rem, 3vh, 2rem);
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  font-weight: bold;
  font-size: 1.5rem;
}

.je {
  background-color: #007acc;
  color: white;
  padding: 0.2rem 0.4rem;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: white;
}

.game-grid {
  display: flex;
  flex-direction: column;
  gap: clamp(0.2rem, 1vw, 0.4rem);
  margin-bottom: clamp(1rem, 3vh, 2rem);
}

.grid-row {
  display: flex;
  gap: clamp(0.2rem, 1vw, 0.4rem);
  justify-content: center;
}

.grid-cell {
  width: clamp(45px, 12vw, 65px);
  height: clamp(45px, 12vw, 65px);
  border: 2px solid #007acc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.9rem, 4vw, 1.2rem);
  font-weight: bold;
  background-color: #404040;
  color: white;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.grid-cell.filled {
  background-color: #404040;
}

.grid-cell.reveal {
  animation: reveal 0.6s ease-in-out;
}

.grid-cell.bounce {
  animation: bounce 0.2s ease-in-out;
}

.grid-cell.correct {
  background-color: #6aaa64;
  border-color: #6aaa64;
}

.grid-cell.present {
  background-color: #c9b458;
  border-color: #c9b458;
}

.grid-cell.absent {
  background-color: #787c7e;
  border-color: #787c7e;
}

.keyboard {
  display: flex;
  flex-direction: column;
  gap: clamp(0.3rem, 1vh, 0.6rem);
  width: 100%;
  max-width: min(500px, 95vw);
  padding: 0 clamp(0.5rem, 2vw, 1rem);
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: clamp(0.2rem, 0.8vw, 0.4rem);
}

.key {
  min-width: clamp(28px, 8vw, 45px);
  height: clamp(40px, 10vh, 58px);
  border: none;
  border-radius: 4px;
  background-color: #d81b60;
  color: white;
  font-size: clamp(0.7rem, 3vw, 1rem);
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.5s;
  flex: 1;
  max-width: 45px;
}

.key:hover {
  background-color: #ad1457;
}

.key:active {
  background-color: #880e4f;
}

.special-key {
  min-width: clamp(50px, 12vw, 75px);
  font-size: clamp(0.6rem, 2.5vw, 0.8rem);
  flex: 1.5;
  max-width: 75px;
}

/* Keyboard key states */
.key-correct {
  background-color: #6aaa64 !important;
}

.key-present {
  background-color: #c9b458 !important;
}

.key-absent {
  background-color: #787c7e !important;
}

/* Responsive design */
@media (max-width: 480px) {
  .wordle-page {
    padding: clamp(0.25rem, 1vw, 0.5rem);
    gap: clamp(0.5rem, 2vh, 1rem);
  }

  .keyboard {
    padding: 0;
  }

  .keyboard-row {
    gap: clamp(0.1rem, 0.5vw, 0.3rem);
  }

  .key {
    min-width: clamp(24px, 7vw, 32px);
    height: clamp(35px, 8vh, 45px);
    font-size: clamp(0.6rem, 2.5vw, 0.8rem);
  }

  .special-key {
    min-width: clamp(40px, 10vw, 55px);
    font-size: clamp(0.5rem, 2vw, 0.7rem);
  }
}

@media (max-width: 320px) {
  .grid-cell {
    width: clamp(35px, 15vw, 40px);
    height: clamp(35px, 15vw, 40px);
    font-size: clamp(0.8rem, 4vw, 1rem);
  }

  .key {
    min-width: clamp(20px, 6vw, 28px);
    height: clamp(32px, 7vh, 40px);
    font-size: clamp(0.5rem, 2vw, 0.7rem);
  }

  .special-key {
    min-width: clamp(35px, 8vw, 45px);
    font-size: clamp(0.45rem, 1.8vw, 0.6rem);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .grid-cell {
    width: clamp(50px, 10vw, 60px);
    height: clamp(50px, 10vw, 60px);
  }

  .key {
    min-width: clamp(35px, 7vw, 42px);
    height: clamp(45px, 9vh, 55px);
  }

  .special-key {
    min-width: clamp(55px, 11vw, 68px);
  }
}

@media (min-width: 769px) {
  .wordle-page {
    padding: clamp(1rem, 3vw, 2rem);
  }

  .keyboard {
    max-width: 100%;
  }
}

@media (orientation: landscape) and (max-height: 600px) {
  .wordle-page {
    gap: clamp(0.5rem, 1vh, 1rem);
  }

  .game-grid {
    margin-bottom: clamp(0.5rem, 2vh, 1rem);
  }

  .grid-cell {
    width: clamp(40px, 8vw, 55px);
    height: clamp(40px, 8vw, 55px);
  }

  .key {
    height: clamp(35px, 7vh, 50px);
  }
}

@keyframes reveal {
  0% {
    transform: rotateX(0deg);
    background-color: #404040;
    border-color: #007acc;
  }
  50% {
    transform: rotateX(90deg);
    background-color: #404040;
    border-color: #007acc;
  }
  55% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}
</style>
