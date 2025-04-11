"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { useParallax } from "react-scroll-parallax"
import { trackEvent } from "@/lib/analytics"

// Contact information cards with themed icons
const contactInfo = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 mx-auto mb-4 text-samurai-red"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Email",
    info: "gerardmalapote123@gmail.com",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 mx-auto mb-4 text-samurai-red"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    title: "Phone",
    info: "(+63) 9686173881",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 mx-auto mb-4 text-samurai-red"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Location",
    info: "Batangas City, CALABARZON",
  },
]

// Custom themed social icons
const socialIcons = [
  {
    name: "GitHub",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    url: "https://github.com/Gerard-M",
  },
  {
    name: "LinkedIn",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
    url: "#",
  },
  {
    name: "Twitter",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
      </svg>
    ),
    url: "#",
  },
]

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean
    message?: string
  } | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const titleParallax = useParallax<HTMLHeadingElement>({
    speed: -5,
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

  const slideInVariants = useMemo(
    () => ({
      hidden: { x: -50, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    }),
    [],
  )

  useEffect(() => {
    setIsMounted(true)
    // Track page view
    trackEvent("contact", "page_view")
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      setSubmitStatus(null)

      // Track form submission attempt
      trackEvent("contact", "form_submit_attempt")

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to send message")
        }

        setSubmitStatus({
          success: true,
          message: data.message || "Your message has been sent! I'll get back to you soon.",
        })
        setFormState({ name: "", email: "", message: "" })

        // Track successful submission
        trackEvent("contact", "form_submit_success")
      } catch (error) {
        console.error("Error submitting form:", error)
        setSubmitStatus({
          success: false,
          message: error instanceof Error ? error.message : "Failed to send message",
        })

        // Track failed submission
        trackEvent("contact", "form_submit_error")
      } finally {
        setIsSubmitting(false)
      }
    },
    [formState],
  )

  return (
    <div className="min-h-screen bg-samurai-paper py-20" id="contact" aria-label="Contact section">
      <div className="container mx-auto px-6">
        <motion.div
          ref={titleParallax.ref}
          className="mb-16 overflow-hidden"
          initial={isMounted ? { opacity: 0 } : false}
          whileInView={isMounted ? { opacity: 1 } : false}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-5xl md:text-7xl font-bold text-samurai-black mb-2 text-center calligraphy-text"
            initial={isMounted ? "hidden" : false}
            whileInView={isMounted ? "visible" : false}
            variants={titleVariants}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            Get in Touch
          </motion.h2>
          <div className="w-24 h-1 bg-samurai-red mx-auto"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8 bg-samurai-white p-8 rounded-xl neu-shadow"
            initial={isMounted ? "hidden" : false}
            whileInView={isMounted ? "visible" : false}
            variants={fadeInUpVariants}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-2">
              <motion.div
                className={`relative border-b-2 ${
                  focusedField === "name" ? "border-samurai-red" : "border-samurai-black/30"
                } transition-colors duration-300`}
                initial={isMounted ? "hidden" : false}
                whileInView={isMounted ? "visible" : false}
                variants={slideInVariants}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className="block w-full py-4 text-samurai-black bg-transparent outline-none text-xl"
                  placeholder="Name"
                  required
                  aria-label="Your name"
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <motion.div
                className={`relative border-b-2 ${
                  focusedField === "email" ? "border-samurai-red" : "border-samurai-black/30"
                } transition-colors duration-300`}
                initial={isMounted ? "hidden" : false}
                whileInView={isMounted ? "visible" : false}
                variants={slideInVariants}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="block w-full py-4 text-samurai-black bg-transparent outline-none text-xl"
                  placeholder="Email"
                  required
                  aria-label="Your email address"
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <motion.div
                className={`relative border-b-2 ${
                  focusedField === "message" ? "border-samurai-red" : "border-samurai-black/30"
                } transition-colors duration-300`}
                initial={isMounted ? "hidden" : false}
                whileInView={isMounted ? "visible" : false}
                variants={slideInVariants}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  className="block w-full py-4 text-samurai-black bg-transparent outline-none text-xl resize-none"
                  placeholder="Message"
                  rows={5}
                  required
                  aria-label="Your message"
                />
              </motion.div>
            </div>

            <motion.div
              initial={isMounted ? { opacity: 0 } : false}
              whileInView={isMounted ? { opacity: 1 } : false}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-end"
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-samurai-red text-samurai-white text-lg font-medium rounded-full hover:bg-samurai-red/80 transition-colors disabled:opacity-70 disabled:cursor-not-allowed neu-shadow hover:neu-shadow-pressed"
                aria-label="Send message"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </motion.div>
          </motion.form>

          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-md text-center ${
                submitStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
              role="alert"
            >
              {submitStatus.message}
            </motion.div>
          )}

          <motion.div
            className="mt-20 grid md:grid-cols-3 gap-8 text-center"
            initial={isMounted ? "hidden" : false}
            whileInView={isMounted ? "visible" : false}
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {contactInfo.map((item, index) => (
              <div key={index} className="p-6 bg-samurai-white rounded-xl neu-shadow">
                {item.icon}
                <h3 className="text-xl font-bold mb-2 text-samurai-black">{item.title}</h3>
                <p className="text-samurai-black/70">{item.info}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <footer className="mt-20 py-6 border-t border-samurai-black/10 bg-samurai-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-samurai-black/70">© {new Date().getFullYear()} Gerard Malapote. All rights reserved.</p>

          <div className="flex justify-center space-x-6 mt-4">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-samurai-black hover:text-samurai-red transition-colors"
                onClick={() => trackEvent("footer", `click_${social.name.toLowerCase()}_icon`)}
                aria-label={`Visit my ${social.name} profile`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
