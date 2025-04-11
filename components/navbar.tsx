"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { trackEvent } from "@/lib/analytics"

interface NavbarProps {
  onHomeClick: () => void
  onAboutClick: () => void
  onProjectsClick: () => void
  onContactClick: () => void
}

export default function Navbar({ onHomeClick, onAboutClick, onProjectsClick, onContactClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    trackEvent("navigation", "toggle_mobile_menu", { state: !mobileMenuOpen ? "open" : "closed" })
  }

  const handleNavClick = (section: string, callback: () => void) => {
    callback()
    setMobileMenuOpen(false)
    trackEvent("navigation", "click_nav_item", { section })
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-samurai-black/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      initial={isMounted ? { y: -100 } : false}
      animate={isMounted ? { y: 0 } : false}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="text-xl font-bold"
            whileHover={isMounted ? { scale: 1.05 } : false}
            whileTap={isMounted ? { scale: 0.95 } : false}
          >
            <span className={scrolled ? "text-samurai-white" : "text-samurai-white"}>GM</span>
          </motion.div>

          <div className="hidden md:flex space-x-8">
            {[
              { name: "About", onClick: onHomeClick },
              { name: "Skills", onClick: onAboutClick },
              { name: "Projects", onClick: onProjectsClick },
              { name: "Contact", onClick: onContactClick },
            ].map((item) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.name.toLowerCase(), item.onClick)}
                className={`font-medium text-sm ${
                  scrolled ? "text-samurai-white hover:text-samurai-red" : "text-samurai-white hover:text-samurai-red"
                }`}
                whileHover={isMounted ? { scale: 1.1 } : false}
                whileTap={isMounted ? { scale: 0.95 } : false}
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          <div className="md:hidden">
            <button
              className={scrolled ? "text-samurai-white" : "text-samurai-white"}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-samurai-red"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 py-4 bg-samurai-black/95 backdrop-blur-md rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-4 px-4">
              {[
                {
                  name: "About",
                  onClick: () => handleNavClick("about", onHomeClick),
                },
                {
                  name: "Skills",
                  onClick: () => handleNavClick("skills", onAboutClick),
                },
                {
                  name: "Projects",
                  onClick: () => handleNavClick("projects", onProjectsClick),
                },
                {
                  name: "Contact",
                  onClick: () => handleNavClick("contact", onContactClick),
                },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="text-samurai-white hover:text-samurai-red font-medium text-sm py-2 text-left"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
