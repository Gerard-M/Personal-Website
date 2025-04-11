// Enhanced analytics helper with debouncing and error handling
let analyticsQueue: Array<{
  page: string
  event: string
  metadata: Record<string, any>
  timestamp: string
}> = []
let isProcessingQueue = false

// Process the analytics queue with a small delay to batch requests
const processQueue = async () => {
  if (isProcessingQueue || analyticsQueue.length === 0) return

  isProcessingQueue = true

  try {
    // Take up to 10 events to process at once
    const batch = analyticsQueue.slice(0, 10)
    analyticsQueue = analyticsQueue.slice(10)

    // Don't track events in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV Analytics] Processing ${batch.length} events`, batch)
      isProcessingQueue = false

      // Continue processing if there are more events
      if (analyticsQueue.length > 0) {
        setTimeout(processQueue, 100)
      }
      return
    }

    // Send analytics data to our Node.js backend
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        events: batch,
      }),
    })
  } catch (error) {
    // Fail silently in production, log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error processing analytics queue:", error)
    }
  } finally {
    isProcessingQueue = false

    // Continue processing if there are more events
    if (analyticsQueue.length > 0) {
      setTimeout(processQueue, 100)
    }
  }
}

// Debounced track event function
export async function trackEvent(page: string, event: string, metadata: Record<string, any> = {}) {
  try {
    // Add event to queue
    analyticsQueue.push({
      page,
      event,
      metadata,
      timestamp: new Date().toISOString(),
    })

    // Start processing queue after a small delay
    setTimeout(processQueue, 100)
  } catch (error) {
    // Fail silently in production, log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error tracking event:", error)
    }
  }
}
