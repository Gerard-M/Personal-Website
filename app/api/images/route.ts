import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// This route handler ensures the profile picture is available
export async function GET() {
  try {
    // Create the public/images directory if it doesn't exist
    const publicDir = path.join(process.cwd(), "public")
    const imagesDir = path.join(publicDir, "images")

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting up image directories:", error)
    return NextResponse.json({ error: "Failed to set up image directories" }, { status: 500 })
  }
}
