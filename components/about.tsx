"use client"

import { useEffect, useState, useMemo } from "react"
import { useParallax } from "react-scroll-parallax"
import { motion } from "framer-motion"
import { trackEvent } from "@/lib/analytics"

// Define programming languages and technologies with their Devicon URLs (plain versions)
const proficientLanguages = [
  {
    name: "Python",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg",
  },
  {
    name: "Java",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg",
  },
  {
    name: "C++",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-plain.svg",
  },
  {
    name: "C#",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-plain.svg",
  },
  {
    name: "HTML",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg",
  },
  {
    name: "CSS",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg",
  },
  {
    name: "JavaScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg",
  },
  {
    name: "React",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    name: "SQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg",
  },
  {
    name: "Node.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg",
  },
]

export default function About() {
  const [isMounted, setIsMounted] = useState(false)

  const titleParallax = useParallax<HTMLHeadingElement>({
    speed: -5,
    disabled: !isMounted,
  })

  const contentParallax = useParallax<HTMLDivElement>({
    speed: 5,
    disabled: !isMounted,
  })

  // Precompute animation variants for better performance
  const fadeInUpVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    }),
    [],
  )

  const titleVariants = useMemo(
    () => ({
      hidden: { y: "100%" },
      visible: { y: 0 },
    }),
    [],
  )

  useEffect(() => {
    setIsMounted(true)
    // Track page view
    trackEvent("skills", "page_view")
  }, [])

  return (
    <div
      className="min-h-screen bg-samurai-paper text-samurai-black flex flex-col justify-center py-20 relative overflow-hidden"
      id="skills"
      aria-label="Skills section"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-samurai-red opacity-5 z-0"></div>

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
            className="text-7xl md:text-9xl font-black tracking-tighter text-samurai-black calligraphy-text relative z-10"
            initial={isMounted ? "hidden" : false}
            whileInView={isMounted ? "visible" : false}
            variants={titleVariants}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            MY SKILLS
          </motion.h2>
          <div className="absolute bottom-0 left-0 w-1/3 h-1 bg-samurai-red"></div>
        </motion.div>

        <div ref={contentParallax.ref} className="grid md:grid-cols-2 gap-12">
          {/* Proficient Languages Card */}
          <motion.div
            initial={isMounted ? "hidden" : false}
            whileInView={isMounted ? "visible" : false}
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-samurai-white p-8 rounded-xl neu-shadow"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-samurai-black">Proficient Languages</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {proficientLanguages.map((lang, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-16 h-16 mb-2 p-2 rounded-lg bg-samurai-paper neu-shadow flex items-center justify-center">
                    <img
                      src={lang.logo || "/placeholder.svg?height=40&width=40"}
                      alt={`${lang.name} logo`}
                      className="w-10 h-10 object-contain samurai-icon"
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                  </div>
                  <span className="text-sm font-medium text-samurai-black">{lang.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills Card */}
          <motion.div
            initial={isMounted ? "hidden" : false}
            whileInView={isMounted ? "visible" : false}
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-samurai-white p-8 rounded-xl neu-shadow"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-samurai-black">Skills</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technical Skills */}
              <div>
                <h4 className="text-xl font-bold mb-4 text-samurai-black border-b-2 border-samurai-red pb-2">
                  Technical Skills
                </h4>
                <ul className="space-y-3">
                  {[
                    "Data Analytics",
                    "Data Visualization",
                    "Statistical Analysis",
                    "Database Management",
                    "UI/UX Design",
                    "Frontend Development",
                    "Backend Development",
                  ].map((skill, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-samurai-black"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <span className="mr-2 text-samurai-red">•</span>
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Soft Skills */}
              <div>
                <h4 className="text-xl font-bold mb-4 text-samurai-black border-b-2 border-samurai-red pb-2">
                  Soft Skills
                </h4>
                <ul className="space-y-3">
                  {[
                    "Problem Solving",
                    "Critical Thinking",
                    "Communication",
                    "Teamwork",
                    "Time Management",
                    "Adaptability",
                    "Leadership",
                    "Creativity",
                    "Attention to Detail",
                    "Project Management",
                  ].map((skill, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-samurai-black"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <span className="mr-2 text-samurai-red">•</span>
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
