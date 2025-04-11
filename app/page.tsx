"use client"

import type React from "react"
import { useRef, Suspense, lazy, useEffect } from "react"
import { ParallaxProvider } from "react-scroll-parallax"
import ErrorBoundary from "@/components/error-boundary"
import Navbar from "@/components/navbar"
import Loading from "@/components/loading"
import { trackEvent } from "@/lib/analytics"

// Lazy load sections to improve initial load time
const Home = lazy(() => import("@/components/home"))
const About = lazy(() => import("@/components/about"))
const Projects = lazy(() => import("@/components/projects"))
const Contact = lazy(() => import("@/components/contact"))

export default function Portfolio() {
  const homeRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Track page view once on initial load
  useEffect(() => {
    trackEvent("portfolio", "page_view")
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, section: string) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
      // Track navigation event
      trackEvent("navigation", "scroll_to_section", { section })
    }
  }

  return (
    <ParallaxProvider>
      <div className="relative">
        <ErrorBoundary section="navbar">
          <Navbar
            onHomeClick={() => scrollToSection(homeRef, "home")}
            onAboutClick={() => scrollToSection(aboutRef, "about")}
            onProjectsClick={() => scrollToSection(projectsRef, "projects")}
            onContactClick={() => scrollToSection(contactRef, "contact")}
          />
        </ErrorBoundary>

        <div ref={homeRef}>
          <ErrorBoundary section="home">
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div ref={aboutRef}>
          <ErrorBoundary section="about">
            <Suspense fallback={<Loading />}>
              <About />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div ref={projectsRef}>
          <ErrorBoundary section="projects">
            <Suspense fallback={<Loading />}>
              <Projects />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div ref={contactRef}>
          <ErrorBoundary section="contact">
            <Suspense fallback={<Loading />}>
              <Contact />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </ParallaxProvider>
  )
}
