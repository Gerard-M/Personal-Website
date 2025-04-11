import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { rateLimit } from "@/lib/rate-limit"

// This is a Next.js API route that uses Node.js under the hood
export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const limiter = await rateLimit(request)

    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    // Parse request body
    const { name, email, message } = await request.json()

    // Validate the data
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Email validation using Node.js regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Configure nodemailer with your email service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "gerardmalapote123@gmail.com",
      subject: `Portfolio Contact Form: Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    }

    // Send the email using Node.js
    await transporter.sendMail(mailOptions)

    // Log successful submission (in production, you might want to use a proper logging service)
    console.log(`Email sent successfully from ${email}`)

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 })
  }
}
