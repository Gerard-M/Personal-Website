"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  section?: string
}

export default function ErrorBoundary({
  children,
  fallback = <div className="p-4 text-red-500">Something went wrong. Please reload the page.</div>,
  section = "component",
}: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error(`Error in ${section}:`, error)
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [section])

  if (hasError) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
