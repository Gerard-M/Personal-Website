import type { NextRequest } from "next/server"

// In-memory store for rate limiting
// In production, you'd use Redis or another distributed store
const ipRequestMap = new Map<string, { count: number; timestamp: number }>()

// Clean up old rate limit entries every hour
setInterval(
  () => {
    const now = Date.now()
    for (const [ip, data] of ipRequestMap.entries()) {
      if (now - data.timestamp > 60 * 1000) {
        // 1 minute
        ipRequestMap.delete(ip)
      }
    }
  },
  60 * 60 * 1000,
) // 1 hour

export async function rateLimit(request: Request | NextRequest) {
  // Get IP address from request
  const ip = request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()

  // Rate limit settings
  const MAX_REQUESTS_PER_WINDOW = 5
  const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

  // Get existing data for this IP
  const ipData = ipRequestMap.get(ip) || { count: 0, timestamp: now }

  // Reset count if outside window
  if (now - ipData.timestamp > RATE_LIMIT_WINDOW) {
    ipData.count = 0
    ipData.timestamp = now
  }

  // Check if rate limited
  if (ipData.count >= MAX_REQUESTS_PER_WINDOW) {
    return { success: false, limit: MAX_REQUESTS_PER_WINDOW, remaining: 0 }
  }

  // Increment request count
  ipData.count++
  ipRequestMap.set(ip, ipData)

  return {
    success: true,
    limit: MAX_REQUESTS_PER_WINDOW,
    remaining: MAX_REQUESTS_PER_WINDOW - ipData.count,
  }
}
