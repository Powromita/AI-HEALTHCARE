import express from "express"
import { authenticateToken, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Mock video data - In production, this would come from a database
const videoDatabase = [
  {
    id: "vid_001",
    title: "Preparing for Chemotherapy",
    description: "Learn what to expect during your upcoming chemotherapy session",
    category: "Treatment Preparation",
    duration: "8:45",
    thumbnailUrl: "/api/videos/thumbnails/chemo-prep.jpg",
    videoUrl: "/api/videos/stream/chemo-prep.mp4",
    treatmentTypes: ["chemotherapy"],
    tags: ["preparation", "chemotherapy", "treatment"],
    difficulty: "beginner",
    isRecommended: true,
  },
  {
    id: "vid_002",
    title: "Managing Side Effects",
    description: "Practical tips for managing common treatment side effects",
    category: "Recovery Tips",
    duration: "12:30",
    thumbnailUrl: "/api/videos/thumbnails/side-effects.jpg",
    videoUrl: "/api/videos/stream/side-effects.mp4",
    treatmentTypes: ["chemotherapy", "radiotherapy"],
    tags: ["side-effects", "recovery", "management"],
    difficulty: "intermediate",
    isRecommended: false,
  },
  {
    id: "vid_003",
    title: "Nutrition During Treatment",
    description: "Maintaining proper nutrition throughout your treatment journey",
    category: "Lifestyle",
    duration: "15:20",
    thumbnailUrl: "/api/videos/thumbnails/nutrition.jpg",
    videoUrl: "/api/videos/stream/nutrition.mp4",
    treatmentTypes: ["chemotherapy", "radiotherapy", "surgery"],
    tags: ["nutrition", "diet", "health"],
    difficulty: "beginner",
    isRecommended: true,
  },
  {
    id: "vid_004",
    title: "Exercise and Recovery",
    description: "Safe exercises to maintain strength during treatment",
    category: "Physical Wellness",
    duration: "10:15",
    thumbnailUrl: "/api/videos/thumbnails/exercise.jpg",
    videoUrl: "/api/videos/stream/exercise.mp4",
    treatmentTypes: ["physiotherapy", "follow-up"],
    tags: ["exercise", "recovery", "strength"],
    difficulty: "intermediate",
    isRecommended: false,
  },
  {
    id: "vid_005",
    title: "Understanding Lab Tests",
    description: "What your lab results mean and how to prepare",
    category: "Test Preparation",
    duration: "6:30",
    thumbnailUrl: "/api/videos/thumbnails/lab-tests.jpg",
    videoUrl: "/api/videos/stream/lab-tests.mp4",
    treatmentTypes: ["lab-test"],
    tags: ["lab-tests", "preparation", "results"],
    difficulty: "beginner",
    isRecommended: true,
  },
]

// Get all videos with filtering
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { category, treatmentType, difficulty, recommended, search } = req.query

    let filteredVideos = [...videoDatabase]

    // Apply filters
    if (category) {
      filteredVideos = filteredVideos.filter((video) => video.category.toLowerCase().includes(category.toLowerCase()))
    }

    if (treatmentType) {
      filteredVideos = filteredVideos.filter((video) => video.treatmentTypes.includes(treatmentType))
    }

    if (difficulty) {
      filteredVideos = filteredVideos.filter((video) => video.difficulty === difficulty)
    }

    if (recommended === "true") {
      filteredVideos = filteredVideos.filter((video) => video.isRecommended)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredVideos = filteredVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchLower) ||
          video.description.toLowerCase().includes(searchLower) ||
          video.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    res.json({
      success: true,
      data: {
        videos: filteredVideos,
        total: filteredVideos.length,
      },
    })
  } catch (error) {
    console.error("Get videos error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: error.message,
    })
  }
})

// Get video by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const video = videoDatabase.find((v) => v.id === id)
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      })
    }

    res.json({
      success: true,
      data: { video },
    })
  } catch (error) {
    console.error("Get video error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch video",
      error: error.message,
    })
  }
})

// Get recommended videos for patient based on upcoming treatments
router.get("/recommendations/personalized", authenticateToken, authorizeRoles("patient"), async (req, res) => {
  try {
    // In a real implementation, you would:
    // 1. Get patient's upcoming treatments
    // 2. Get patient's video viewing history
    // 3. Use AI/ML to recommend relevant videos
    // 4. Consider patient's treatment stage and preferences

    // For now, return recommended videos
    const recommendedVideos = videoDatabase.filter((video) => video.isRecommended)

    res.json({
      success: true,
      data: {
        videos: recommendedVideos,
        message: "Personalized recommendations based on your treatment plan",
      },
    })
  } catch (error) {
    console.error("Get recommendations error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch video recommendations",
      error: error.message,
    })
  }
})

// Record video viewing progress
router.post("/:id/progress", authenticateToken, authorizeRoles("patient"), async (req, res) => {
  try {
    const { id } = req.params
    const { watchTime, completed, rating, feedback } = req.body

    const video = videoDatabase.find((v) => v.id === id)
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      })
    }

    // In a real implementation, you would save this to the database
    // For now, we'll just return success
    const progressData = {
      videoId: id,
      watchTime,
      completed,
      rating,
      feedback,
      timestamp: new Date(),
    }

    res.json({
      success: true,
      message: "Video progress recorded successfully",
      data: { progress: progressData },
    })
  } catch (error) {
    console.error("Record video progress error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to record video progress",
      error: error.message,
    })
  }
})

// Get video categories
router.get("/meta/categories", authenticateToken, async (req, res) => {
  try {
    const categories = [...new Set(videoDatabase.map((video) => video.category))]
    const treatmentTypes = [...new Set(videoDatabase.flatMap((video) => video.treatmentTypes))]
    const difficulties = [...new Set(videoDatabase.map((video) => video.difficulty))]

    res.json({
      success: true,
      data: {
        categories,
        treatmentTypes,
        difficulties,
      },
    })
  } catch (error) {
    console.error("Get video metadata error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch video metadata",
      error: error.message,
    })
  }
})

export default router
