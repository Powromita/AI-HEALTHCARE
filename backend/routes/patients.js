import express from "express"
import { body, validationResult } from "express-validator"
import Patient from "../models/Patient.js"
import User from "../models/User.js"
import { authenticateToken, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Get all patients (Admin and Doctor access)
router.get("/", authenticateToken, authorizeRoles("admin", "doctor"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query

    const query = {}
    if (status) query["treatmentPlan.status"] = status
    if (search) {
      // Search in patient details
      const users = await User.find({
        role: "patient",
        $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
      }).select("_id")

      query.userId = { $in: users.map((u) => u._id) }
    }

    // If doctor, only show assigned patients
    if (req.user.role === "doctor") {
      query.assignedDoctor = req.user.userId
    }

    const patients = await Patient.find(query)
      .populate("userId", "name email phone profileImage")
      .populate("assignedDoctor", "name doctorProfile.specialty")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

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
    console.error("Get patients error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    })
  }
})

// Get patient by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const query = { _id: id }

    // If patient, only allow access to own record
    if (req.user.role === "patient") {
      const user = await User.findById(req.user.userId)
      const patientRecord = await Patient.findOne({ userId: req.user.userId })
      if (!patientRecord || patientRecord._id.toString() !== id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        })
      }
    }

    // If doctor, only allow access to assigned patients
    if (req.user.role === "doctor") {
      query.assignedDoctor = req.user.userId
    }

    const patient = await Patient.findOne(query)
      .populate("userId", "name email phone profileImage patientProfile")
      .populate("assignedDoctor", "name doctorProfile.specialty")
      .populate("treatments")
      .populate("prescriptions")

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      })
    }

    res.json({
      success: true,
      data: { patient },
    })
  } catch (error) {
    console.error("Get patient error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
      error: error.message,
    })
  }
})

// Create new patient record (Admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  [
    body("userId").isMongoId().withMessage("Valid user ID is required"),
    body("assignedDoctor").optional().isMongoId().withMessage("Valid doctor ID is required"),
    body("treatmentPlan.diagnosis")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Diagnosis must be at least 2 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        })
      }

      const { userId, assignedDoctor, treatmentPlan } = req.body

      // Verify user exists and is a patient
      const user = await User.findById(userId)
      if (!user || user.role !== "patient") {
        return res.status(400).json({
          success: false,
          message: "Invalid patient user ID",
        })
      }

      // Check if patient record already exists
      const existingPatient = await Patient.findOne({ userId })
      if (existingPatient) {
        return res.status(400).json({
          success: false,
          message: "Patient record already exists",
        })
      }

      // Verify assigned doctor if provided
      if (assignedDoctor) {
        const doctor = await User.findById(assignedDoctor)
        if (!doctor || doctor.role !== "doctor") {
          return res.status(400).json({
            success: false,
            message: "Invalid doctor ID",
          })
        }
      }

      const patient = new Patient({
        userId,
        assignedDoctor,
        treatmentPlan,
      })

      await patient.save()
      await patient.populate("userId", "name email phone")
      await patient.populate("assignedDoctor", "name doctorProfile.specialty")

      res.status(201).json({
        success: true,
        message: "Patient record created successfully",
        data: { patient },
      })
    } catch (error) {
      console.error("Create patient error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to create patient record",
        error: error.message,
      })
    }
  },
)

// Update patient record
router.put("/:id", authenticateToken, authorizeRoles("admin", "doctor"), async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const query = { _id: id }

    // If doctor, only allow updates to assigned patients
    if (req.user.role === "doctor") {
      query.assignedDoctor = req.user.userId
    }

    const patient = await Patient.findOneAndUpdate(query, updates, { new: true, runValidators: true })
      .populate("userId", "name email phone")
      .populate("assignedDoctor", "name doctorProfile.specialty")

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found or access denied",
      })
    }

    res.json({
      success: true,
      message: "Patient record updated successfully",
      data: { patient },
    })
  } catch (error) {
    console.error("Update patient error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update patient record",
      error: error.message,
    })
  }
})

// Add vitals record
router.post(
  "/:id/vitals",
  authenticateToken,
  authorizeRoles("admin", "doctor"),
  [
    body("bloodPressure.systolic").optional().isNumeric().withMessage("Systolic BP must be a number"),
    body("bloodPressure.diastolic").optional().isNumeric().withMessage("Diastolic BP must be a number"),
    body("heartRate").optional().isNumeric().withMessage("Heart rate must be a number"),
    body("temperature").optional().isNumeric().withMessage("Temperature must be a number"),
    body("weight").optional().isNumeric().withMessage("Weight must be a number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        })
      }

      const { id } = req.params
      const vitalsData = req.body

      const query = { _id: id }
      if (req.user.role === "doctor") {
        query.assignedDoctor = req.user.userId
      }

      const patient = await Patient.findOneAndUpdate(query, { $push: { vitals: vitalsData } }, { new: true })

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found or access denied",
        })
      }

      res.json({
        success: true,
        message: "Vitals recorded successfully",
        data: { vitals: patient.vitals[patient.vitals.length - 1] },
      })
    } catch (error) {
      console.error("Add vitals error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to record vitals",
        error: error.message,
      })
    }
  },
)

export default router
