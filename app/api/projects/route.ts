import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// This is a Node.js-powered API route to fetch project data
export async function GET() {
  try {
    // In a real app, this would fetch from a database
    // For now, we'll return static data
    const projects = [
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
        color: "#FFD700", // Yellow from the doctor image
        tags: ["React", "Node.js", "MongoDB", "Express"],
        link: "https://github.com/Gerard-M/AgriLocate",
      },
      {
        id: 3,
        title: "Visualgo",
        description: "A responsive portfolio website built with Next.js and Tailwind CSS.",
        image: "/visualgo_thumbnail.png",
        color: "#1E3A8A", // Dark blue from the visualgo image
        tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
        link: "https://github.com/Gerard-M/Visualgo",
      },
      {
        id: 4,
        title: "Web Design for Visually Impaired",
        description: "A task management application with drag-and-drop functionality.",
        image: "/website_thumbnail.png",
        color: "#FFD700", // Yellow from the doctor image
        tags: ["React", "Redux", "Firebase", "Material UI"],
        link: "https://gerard-m.github.io/HCI_Finals/",
      },
    ]

    // Check if images exist
    const publicDir = path.join(process.cwd(), "public")
    const imagesExist = projects.every((project) => {
      const imagePath = path.join(publicDir, project.image)
      return fs.existsSync(imagePath)
    })

    return NextResponse.json({
      projects,
      imagesExist,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
