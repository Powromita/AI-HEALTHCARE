import express from "express"
import User from "../models/User.js"
import Patient from "../models/Patient.js"
import { authenticateToken, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Get all doctors (Admin access)
router.get("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, specialty } = req.query

    const query = { role: "doctor" }
    if (specialty) query["doctorProfile.specialty"] = specialty
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "doctorProfile.specialty": { $regex: search, $options: "i" } },
      ]
    }

    const doctors = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    // Get patient count for each doctor
    const doctorsWithStats = await Promise.all(
      doctors.map(async (doctor) => {
        const patientCount = await Patient.countDocuments({ assignedDoctor: doctor._id })
        return {
          ...doctor.toObject(),
          patientCount,
        }
      }),
    )

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: {
        doctors: doctorsWithStats,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    })
  } catch (error) {
    console.error("Get doctors error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message,
    })
  }
})

// Get doctor dashboard stats
router.get("/dashboard/stats", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
  try {
    const doctorId = req.user.userId

    // Get assigned patients count
    const totalPatients = await Patient.countDocuments({ assignedDoctor: doctorId })
    const activePatients = await Patient.countDocuments({
      assignedDoctor: doctorId,
      "treatmentPlan.status": "active",
    })

    // Get today's appointments (you'll need to implement Treatment model)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get recent patient updates
    const recentPatients = await Patient.find({ assignedDoctor: doctorId })
      .populate("userId", "name profileImage")
      .sort({ updatedAt: -1 })
      .limit(5)

    res.json({
      success: true,
      data: {
        totalPatients,
        activePatients,
        todayAppointments: 0, // Placeholder - implement with Treatment model
        recentPatients,
      },
    })
  } catch (error) {
    console.error("Get doctor stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    })
  }
})

// Get doctor's patients
router.get("/patients", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
  try {
    const doctorId = req.user.userId
    const { page = 1, limit = 10, status } = req.query

    const query = { assignedDoctor: doctorId }
    if (status) query["treatmentPlan.status"] = status

    const patients = await Patient.find(query)
      .populate("userId", "name email phone profileImage patientProfile")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ updatedAt: -1 })

    const total = await Patient.countDocuments(query)

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    })
  } catch (error) {
    console.error("Get doctor patients error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    })
  }
})

export default router
