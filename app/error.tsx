"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        We apologize for the inconvenience. Please try refreshing the page or click the button below to try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
