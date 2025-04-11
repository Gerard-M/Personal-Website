import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

// Enhanced analytics endpoint with batch processing
export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const limiter = await rateLimit(request)

    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    // Parse request body
    const body = await request.json()
    const events = Array.isArray(body.events) ? body.events : [body]

    // Get client IP and user agent
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const referrer = request.headers.get("referer") || "unknown"

    // Process each event
    const processedEvents = events.map((event) => ({
      ...event,
      clientInfo: {
        ip,
        userAgent,
        referrer,
      },
    }))

    // In a real app, you would store this in a database
    // For now, we'll just log it to the console
    console.log(`[Analytics] Processed ${processedEvents.length} events`)

    // Only log detailed info in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] Events:`, processedEvents)
    }

    // Return success
    return NextResponse.json({
      success: true,
      processed: processedEvents.length,
    })
  } catch (error) {
    console.error("Error logging analytics:", error)
    return NextResponse.json({ error: "Failed to log analytics" }, { status: 500 })
  }
}
