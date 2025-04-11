"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParallax } from "react-scroll-parallax"
import { motion } from "framer-motion"
import { trackEvent } from "@/lib/analytics"

type InkSplash = {
  id: number
  x: number
  y: number
  size: number
  opacity: number
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const [inkSplashes, setInkSplashes] = useState<InkSplash[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const lastSplashTime = useRef(0)
  const isHovering = useRef(false)

  // Only initialize parallax after component is mounted
  const parallax = useParallax<HTMLDivElement>({
    speed: -20,
    disabled: !isMounted,
  })

  // Memoize the createInkSplash function to prevent unnecessary re-creations
  const createInkSplash = useCallback((x: number, y: number) => {
    const size = Math.random() * 60 + 40 // Random size between 40-100px
    const opacity = Math.random() * 0.3 + 0.1 // Random opacity between 0.1-0.4

    const newSplash: InkSplash = {
      id: nextId.current,
      x,
      y,
      size,
      opacity,
    }

    nextId.current += 1

    setInkSplashes((prev) => {
      // Limit the number of active splashes to improve performance
      if (prev.length > 15) {
        return [...prev.slice(prev.length - 15), newSplash]
      }
      return [...prev, newSplash]
    })

    // Remove splash after animation completes
    setTimeout(() => {
      setInkSplashes((prev) => prev.filter((splash) => splash.id !== newSplash.id))
    }, 2000)
  }, [])

  // Memoize the handleContactClick function
  const handleContactClick = useCallback(() => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
      // Track the event
      trackEvent("home", "click_contact_button")
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setMousePosition({ x, y })

        // Create ink splashes periodically as mouse moves
        const now = Date.now()
        if (now - lastSplashTime.current > 300 && isHovering.current) {
          // Adjust timing as needed
          createInkSplash(x, y)
          lastSplashTime.current = now
        }
      }
    }

    const handleMouseEnter = () => {
      isHovering.current = true
    }

    const handleMouseLeave = () => {
      isHovering.current = false
    }

    if (containerRef.current) {
      containerRef.current.addEventListener("mouseenter", handleMouseEnter)
      containerRef.current.addEventListener("mouseleave", handleMouseLeave)
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Track page view
    trackEvent("home", "page_view")

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseenter", handleMouseEnter)
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [createInkSplash])

  // Precompute animation variants for better performance
  const cursorFollowerVariants = {
    default: { scale: 1 },
    hover: { scale: 1.2 },
  }

  const inkSplashVariants = {
    initial: { scale: 0 },
    animate: { scale: 1.5, opacity: 0 },
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-samurai-black japanese-pattern"
      id="home"
      aria-label="Home section"
    >
      {/* Cursor follower - only render when mounted for better performance */}
      {isMounted && (
        <motion.div
          className="absolute w-8 h-8 rounded-full bg-samurai-red/20 pointer-events-none z-10"
          animate={{
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: isHovering.current ? 1.2 : 1,
          }}
          variants={cursorFollowerVariants}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
        />
      )}

      {/* Ink splashes - use AnimatePresence for better animation handling */}
      {inkSplashes.map((splash) => (
        <motion.div
          key={splash.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: splash.x,
            top: splash.y,
            backgroundColor: `rgba(160, 44, 44, ${Math.min(splash.opacity + 0.5, 1)})`,
            width: splash.size,
            height: splash.size,
            x: -splash.size / 2,
            y: -splash.size / 2,
          }}
          initial={{ scale: 0, opacity: Math.min(splash.opacity + 0.5, 1) }}
          animate={{ scale: 1.5, opacity: 0 }}
          variants={inkSplashVariants}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      ))}

      {/* Content */}
      <div className="container mx-auto px-6 py-20">
        <div ref={parallax.ref} className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Profile photo - Left side */}
          <motion.div
            initial={isMounted ? { opacity: 0, y: 50 } : false}
            animate={isMounted ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.8 }}
            className="md:w-1/3 flex flex-col items-center"
          >
            <div className="mb-8 floating">
              <div className="inline-block p-6 rounded-full bg-samurai-gray neu-shadow">
                <div className="rounded-full overflow-hidden neu-shadow-inset">
                  <img
                    src="/profile_picture.jpeg"
                    alt="Gerard Malapote profile"
                    className="w-64 h-64 rounded-full mx-auto object-cover"
                    width={256}
                    height={256}
                    loading="eager" // Load this image eagerly as it's above the fold
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content - Right side */}
          <motion.div
            className="md:w-2/3 bg-samurai-gray/20 p-8 rounded-xl neu-shadow"
            initial={isMounted ? { opacity: 0, x: 50 } : false}
            animate={isMounted ? { opacity: 1, x: 0 } : false}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 text-samurai-white calligraphy-text"
              initial={isMounted ? { opacity: 0, y: 20 } : false}
              animate={isMounted ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              Gerard Malapote
            </motion.h1>

            <motion.div
              className="relative inline-block mb-4"
              initial={isMounted ? { opacity: 0, y: 20 } : false}
              animate={isMounted ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-medium text-samurai-white">Data Analyst</h2>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-samurai-red"></div>
            </motion.div>

            <div className="space-y-4 text-samurai-white/90 mb-8">
              <p className="text-lg leading-relaxed">
                I am a computer science student aspiring to become a data analyst or engineer. With strong statistical
                skills and a passion for data-driven insights, I thrive on transforming complex information into
                meaningful solutions.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/Gerard-M"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 bg-samurai-gray text-samurai-white rounded-full neu-shadow hover:neu-shadow-pressed transition-all duration-300"
                onClick={() => trackEvent("home", "click_github_button")}
                aria-label="Visit my GitHub profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-samurai-red"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <button
                onClick={handleContactClick}
                className="px-6 py-3 bg-samurai-red text-samurai-white rounded-full neu-shadow hover:neu-shadow-pressed transition-all duration-300"
                aria-label="Scroll to contact section"
              >
                Contact Me
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-samurai-red"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  )
}
