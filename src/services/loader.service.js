import { ref } from 'vue'

// Centralized loader state for the app
export const loaderVisible = ref(false)

// Shared reactive counter for in-flight network requests
export let inFlightRequests = ref(0)

// Track timeout IDs for each request
const requestTimeouts = new Set()

// Timeout duration (10 seconds)
const REQUEST_TIMEOUT = 10000

// Calling startLoader increments the counter and ensures the loader is visible
export function startLoader() {
  inFlightRequests.value = Math.max(0, inFlightRequests.value + 1)
  loaderVisible.value = true
}

// Calling stopLoader decrements the counter and hides the loader when it reaches zero
export function stopLoader() {
  inFlightRequests.value = Math.max(0, inFlightRequests.value - 1)
  if (inFlightRequests.value === 0) {
    loaderVisible.value = false
  }
}

export function incrementRequests() {
  inFlightRequests.value = Math.max(0, inFlightRequests.value + 1)
  loaderVisible.value = true
  
  // Create a timeout for this request
  const timeoutId = setTimeout(() => {
    console.warn('Request timeout: Decrementing loader after 10 seconds')
    inFlightRequests.value = Math.max(0, inFlightRequests.value - 1)
    if (inFlightRequests.value === 0) {
      loaderVisible.value = false
      requestTimeouts.clear()
    }
  }, REQUEST_TIMEOUT)
  
  requestTimeouts.add(timeoutId)
}

export function decrementRequests() {
  inFlightRequests.value = Math.max(0, inFlightRequests.value - 1)
  
  // Clear one timeout since a request completed
  if (requestTimeouts.size > 0) {
    const timeoutId = requestTimeouts.values().next().value
    clearTimeout(timeoutId)
    requestTimeouts.delete(timeoutId)
  }
  
  if (inFlightRequests.value === 0) {
    // Small delay before hiding to prevent flickering
    setTimeout(() => {
      if (inFlightRequests.value === 0) {
        // Only hide if page is fully loaded
        if (document.readyState === 'complete') {
          loaderVisible.value = false
        } else {
          // Wait for page to load
          window.addEventListener('load', () => {
            loaderVisible.value = false
          }, { once: true }) // removes itself after first execution
        }
      }
    }, 300)
    // Clear any remaining timeouts
    requestTimeouts.forEach(id => clearTimeout(id))
    requestTimeouts.clear()
  }
}

export default {
    loaderVisible,
    inFlightRequests,
    startLoader,
    stopLoader,
    incrementRequests,
    decrementRequests,
}