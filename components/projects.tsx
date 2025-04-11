"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParallax } from "react-scroll-parallax"
import { trackEvent } from "@/lib/analytics"

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image: string
  color: string
  tags: string[]
  link: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeProject, setActiveProject] = useState<number>(0)
  const [isMounted, setIsMounted] = useState(false)
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])
  const [modalProject, setModalProject] = useState<number | null>(null)

  const titleParallax = useParallax<HTMLHeadingElement>({
    speed: -10,
    disabled: !isMounted,
  })

  // Fetch projects from our Node.js API
  useEffect(() => {
    setIsMounted(true)

    async function fetchProjects() {
      try {
        setLoading(true)
        const response = await fetch("/api/projects")

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await response.json()
        setProjects(data.projects)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Failed to load projects. Please try again later.")
        // Fallback to static data if API fails
        setProjects([
          {
            id: 1,
            title: "NBA Prediction",
            description:
              "A machine learning project that predicts NBA game outcomes using player performance, team statistics, and temporal data with XGBoost.",
            image: "/website_thumbnail.png", // Using placeholder image
            color: "#C9082A", // NBA red color
            tags: ["Python", "Machine Learning", "XGBoost", "Data Science", "Sports Analytics"],
            link: "https://github.com/Gerard-M/NBA-Prediction",
          },
          {
            id: 2,
            title: "Agrilocate",
            description: "A full-stack e-commerce platform built with React, Node.js, and MongoDB.",
            image: "/website_thumbnail.png",
            color: "#FFD700",
            tags: ["React", "Node.js", "MongoDB", "Express"],
            link: "https://github.com/Gerard-M/AgriLocate",
          },
          {
            id: 3,
            title: "Visualgo",
            description: "A responsive portfolio website built with Next.js and Tailwind CSS.",
            image: "/visualgo_thumbnail.png",
            color: "#1E3A8A",
            tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
            link: "https://github.com/Gerard-M/Visualgo",
          },
          {
            id: 4,
            title: "Web Design for Visually Impaired",
            description: "A task management application with drag-and-drop functionality.",
            image: "/website_thumbnail.png",
            color: "#FFD700",
            tags: ["React", "Redux", "Firebase", "Material UI"],
            link: "https://gerard-m.github.io/HCI_Finals/",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()

    // Track page view
    trackEvent("projects", "page_view")
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (!isMounted || projects.length === 0) return

    const interval = setInterval(() => {
      setActiveProject((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isMounted, projects.length])

  return (
    <div className="min-h-screen bg-samurai-black py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 japanese-pattern"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={titleParallax.ref}
          className="mb-16 overflow-hidden"
          initial={isMounted ? { opacity: 0 } : false}
          whileInView={isMounted ? { opacity: 1 } : false}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-5xl md:text-7xl font-bold text-samurai-white mb-2 text-center calligraphy-text"
            initial={isMounted ? { y: "100%" } : false}
            whileInView={isMounted ? { y: 0 } : false}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            My Projects
          </motion.h2>
          <div className="w-24 h-1 bg-samurai-red mx-auto"></div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-samurai-red/30 border-t-samurai-red rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error state */}
        {error && <div className="bg-red-50 text-red-800 p-4 rounded-lg text-center">{error}</div>}

        {/* Projects carousel */}
        {!loading && !error && projects.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            {/* Carousel container */}
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `calc(-${activeProject * 100}%)` }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="w-full flex-shrink-0 px-4"
                    initial={isMounted ? { opacity: 0, scale: 0.9 } : false}
                    animate={isMounted ? { opacity: 1, scale: 1 } : false}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl border border-white/10 h-full cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${project.color}22, ${project.color}11)`,
                        backdropFilter: "blur(8px)",
                      }}
                      onClick={() => {
                        setModalProject(project.id)
                        trackEvent("projects", "open_project_modal", { project: project.title })
                      }}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          width={800}
                          height={600}
                        />
                        <div
                          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(to top, ${project.color}99, transparent)`,
                          }}
                        ></div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-samurai-white mb-4">{project.title}</h3>
                        <p className="text-samurai-white/80 mb-6">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-sm font-medium rounded-full text-samurai-white"
                              style={{ backgroundColor: `${project.color}55` }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-3 bg-samurai-red text-samurai-white font-bold rounded-lg hover:bg-samurai-red/80 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            trackEvent("projects", "click_project_link", { project: project.title })
                          }}
                        >
                          View Project
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => {
                  setActiveProject((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
                  trackEvent("projects", "carousel_prev")
                }}
                className="p-3 bg-samurai-gray/50 text-samurai-red rounded-full hover:bg-samurai-gray transition-colors neu-shadow"
                aria-label="Previous project"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Dots indicator */}
              <div className="flex items-center space-x-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveProject(index)
                      trackEvent("projects", "carousel_dot_click", { index })
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeProject === index ? "bg-samurai-red scale-125" : "bg-samurai-white/50"
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveProject((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
                  trackEvent("projects", "carousel_next")
                }}
                className="p-3 bg-samurai-gray/50 text-samurai-red rounded-full hover:bg-samurai-gray transition-colors neu-shadow"
                aria-label="Next project"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project modal */}
      {isMounted && (
        <AnimatePresence>
          {modalProject !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  background: `linear-gradient(135deg, ${projects.find((p) => p.id === modalProject)?.color || "#333"}22, ${projects.find((p) => p.id === modalProject)?.color || "#333"}11)`,
                  backdropFilter: "blur(10px)",
                }}
              >
                {projects
                  .filter((p) => p.id === modalProject)
                  .map((project) => (
                    <div key={project.id} className="relative">
                      <button
                        className="absolute top-4 right-4 z-10 bg-black/50 rounded-full p-2 text-samurai-red hover:bg-black/70 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          setModalProject(null)
                          trackEvent("projects", "close_project_modal", { project: project.title })
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      <div className="relative h-64 md:h-80">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          width={800}
                          height={600}
                        />
                      </div>

                      <div className="p-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-samurai-white mb-4">{project.title}</h3>
                        <p className="text-samurai-white/80 mb-6">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-sm font-medium rounded-full text-samurai-white"
                              style={{ backgroundColor: `${project.color}55` }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-3 bg-samurai-red text-samurai-white font-bold rounded-lg hover:bg-samurai-red/80 transition-colors"
                          onClick={() => trackEvent("projects", "click_modal_project_link", { project: project.title })}
                        >
                          View on GitHub
                        </a>
                      </div>
                    </div>
                  ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
