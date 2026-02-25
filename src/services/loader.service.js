import { ref } from 'vue'

// Centralized loader state for the app
export const loaderVisible = ref(false)

// Shared reactive counter for in-flight network requests
export let inFlightRequests = ref(0)

// Track timeout IDs for each request
const requestTimeouts = new Set()

// Timeout duration (10 seconds)
const REQUEST_TIMEOUT = 10000

// NEW: Delay before showing the loader (in milliseconds)
// If requests finish faster than this, the loader never appears.
const SHOW_DELAY = 400
let showLoaderTimeout = null

export function startLoader() {
  inFlightRequests.value = Math.max(0, inFlightRequests.value + 1)
  loaderVisible.value = true
}

export function stopLoader() {
  inFlightRequests.value = Math.max(0, inFlightRequests.value - 1)
  if (inFlightRequests.value === 0) {
    loaderVisible.value = false
  }
}

export function incrementRequests() {
  inFlightRequests.value = Math.max(0, inFlightRequests.value + 1)

  // Only start the timer if this is the first request in the queue
  if (inFlightRequests.value === 1) {
    showLoaderTimeout = setTimeout(() => {
      loaderVisible.value = true
    }, SHOW_DELAY)
  }

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
    // If requests finished BEFORE the delay ended, clear the timeout so it never shows
    if (showLoaderTimeout) {
      clearTimeout(showLoaderTimeout)
      showLoaderTimeout = null
    }

    // Small delay before hiding to prevent flickering
    setTimeout(() => {
      if (inFlightRequests.value === 0) {
        // Only hide if page is fully loaded
        if (document.readyState === 'complete') {
          loaderVisible.value = false
        } else {
          // Wait for page to load
          window.addEventListener(
            'load',
            () => {
              loaderVisible.value = false
            },
            { once: true },
          )
        }
      }
    }, 300)

    // Clear any remaining timeouts
    requestTimeouts.forEach((id) => clearTimeout(id))
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
