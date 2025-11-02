import express from "express"
import { body, validationResult } from "express-validator"
import Treatment from "../models/Treatment.js"
import Patient from "../models/Patient.js"
import { authenticateToken, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Get treatments
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, patientId, status, date } = req.query

    const query = {}
    if (patientId) query.patientId = patientId
    if (status) query.status = status
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      query.scheduledDate = { $gte: startDate, $lt: endDate }
    }

    // Role-based filtering
    if (req.user.role === "doctor") {
      query.doctorId = req.user.userId
    } else if (req.user.role === "patient") {
      const patient = await Patient.findOne({ userId: req.user.userId })
      if (patient) {
        query.patientId = patient._id
      } else {
        return res.status(404).json({
          success: false,
          message: "Patient record not found",
        })
      }
    }

    const treatments = await Treatment.find(query)
      .populate("patientId", "patientId userId")
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .populate("doctorId", "name doctorProfile.specialty")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ scheduledDate: 1, scheduledTime: 1 })

    const total = await Treatment.countDocuments(query)

    res.json({
      success: true,
      data: {
        treatments,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    })
  } catch (error) {
    console.error("Get treatments error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch treatments",
      error: error.message,
    })
  }
})

// Create new treatment
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "doctor"),
  [
    body("patientId").isMongoId().withMessage("Valid patient ID is required"),
    body("treatmentType")
      .isIn(["chemotherapy", "radiotherapy", "surgery", "physiotherapy", "consultation", "lab-test", "follow-up"])
      .withMessage("Invalid treatment type"),
    body("title").trim().isLength({ min: 2 }).withMessage("Title must be at least 2 characters"),
    body("scheduledDate").isISO8601().withMessage("Valid date is required"),
    body("scheduledTime")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid time format required (HH:MM)"),
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

      const treatmentData = {
        ...req.body,
        doctorId: req.user.userId,
      }

      // Verify patient exists
      const patient = await Patient.findById(treatmentData.patientId)
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        })
      }

      // If doctor, verify they're assigned to this patient
      if (req.user.role === "doctor" && patient.assignedDoctor.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You are not assigned to this patient.",
        })
      }

      const treatment = new Treatment(treatmentData)
      await treatment.save()

      // Add treatment to patient's treatments array
      await Patient.findByIdAndUpdate(treatmentData.patientId, { $push: { treatments: treatment._id } })

      await treatment.populate("patientId", "patientId userId")
      await treatment.populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      await treatment.populate("doctorId", "name doctorProfile.specialty")

      res.status(201).json({
        success: true,
        message: "Treatment scheduled successfully",
        data: { treatment },
      })
    } catch (error) {
      console.error("Create treatment error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to schedule treatment",
        error: error.message,
      })
    }
  },
)

// Update treatment
router.put("/:id", authenticateToken, authorizeRoles("admin", "doctor"), async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const query = { _id: id }
    if (req.user.role === "doctor") {
      query.doctorId = req.user.userId
    }

    const treatment = await Treatment.findOneAndUpdate(query, updates, { new: true, runValidators: true })
      .populate("patientId", "patientId userId")
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .populate("doctorId", "name doctorProfile.specialty")

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found or access denied",
      })
    }

    res.json({
      success: true,
      message: "Treatment updated successfully",
      data: { treatment },
    })
  } catch (error) {
    console.error("Update treatment error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update treatment",
      error: error.message,
    })
  }
})

// Get upcoming treatments for patient
router.get("/upcoming", authenticateToken, authorizeRoles("patient"), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.userId })
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found",
      })
    }

    const now = new Date()
    const treatments = await Treatment.find({
      patientId: patient._id,
      scheduledDate: { $gte: now },
      status: { $in: ["scheduled", "in-progress"] },
    })
      .populate("doctorId", "name doctorProfile.specialty")
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .limit(5)

    res.json({
      success: true,
      data: { treatments },
    })
  } catch (error) {
    console.error("Get upcoming treatments error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming treatments",
      error: error.message,
    })
  }
})

export default router
