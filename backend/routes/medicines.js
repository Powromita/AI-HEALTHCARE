import express from "express"
import { body, validationResult } from "express-validator"
import Medicine from "../models/Medicine.js"
import Patient from "../models/Patient.js"
import { authenticateToken, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Get medicines/prescriptions
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, patientId, status } = req.query

    const query = {}
    if (patientId) query.patientId = patientId
    if (status) query.status = status

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

    const medicines = await Medicine.find(query)
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
      .sort({ createdAt: -1 })

    const total = await Medicine.countDocuments(query)

    res.json({
      success: true,
      data: {
        medicines,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    })
  } catch (error) {
    console.error("Get medicines error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch medicines",
      error: error.message,
    })
  }
})

// Create new prescription
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "doctor"),
  [
    body("patientId").isMongoId().withMessage("Valid patient ID is required"),
    body("medicineName").trim().isLength({ min: 2 }).withMessage("Medicine name must be at least 2 characters"),
    body("dosage.amount").trim().notEmpty().withMessage("Dosage amount is required"),
    body("dosage.unit").isIn(["mg", "ml", "tablets", "capsules", "drops", "units"]).withMessage("Invalid dosage unit"),
    body("frequency.timesPerDay").isInt({ min: 1, max: 6 }).withMessage("Times per day must be between 1 and 6"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
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

      const medicineData = {
        ...req.body,
        doctorId: req.user.userId,
      }

      // Verify patient exists
      const patient = await Patient.findById(medicineData.patientId)
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

      const medicine = new Medicine(medicineData)
      await medicine.save()

      // Add prescription to patient's prescriptions array
      await Patient.findByIdAndUpdate(medicineData.patientId, { $push: { prescriptions: medicine._id } })

      await medicine.populate("patientId", "patientId userId")
      await medicine.populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      await medicine.populate("doctorId", "name doctorProfile.specialty")

      res.status(201).json({
        success: true,
        message: "Prescription created successfully",
        data: { medicine },
      })
    } catch (error) {
      console.error("Create prescription error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to create prescription",
        error: error.message,
      })
    }
  },
)

// Record medicine adherence
router.post(
  "/:id/adherence",
  authenticateToken,
  authorizeRoles("patient"),
  [
    body("taken").isBoolean().withMessage("Taken status must be boolean"),
    body("time")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid time format required (HH:MM)"),
    body("notes").optional().trim().isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters"),
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
      const { taken, time, notes } = req.body

      // Find patient record
      const patient = await Patient.findOne({ userId: req.user.userId })
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient record not found",
        })
      }

      // Find medicine and verify it belongs to the patient
      const medicine = await Medicine.findOne({
        _id: id,
        patientId: patient._id,
      })

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: "Medicine not found or access denied",
        })
      }

      // Add adherence log entry
      const adherenceEntry = {
        date: new Date(),
        time,
        taken,
        notes,
      }

      medicine.adherenceLog.push(adherenceEntry)
      await medicine.save()

      // Update patient's medicine adherence stats
      const totalLogs = medicine.adherenceLog.length
      const takenLogs = medicine.adherenceLog.filter((log) => log.taken).length
      const adherenceRate = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0

      await Patient.findByIdAndUpdate(patient._id, {
        "medicineAdherence.totalDoses": patient.medicineAdherence.totalDoses + 1,
        "medicineAdherence.takenDoses": patient.medicineAdherence.takenDoses + (taken ? 1 : 0),
        "medicineAdherence.adherenceRate": adherenceRate,
      })

      res.json({
        success: true,
        message: "Medicine adherence recorded successfully",
        data: {
          adherenceEntry,
          adherenceRate,
        },
      })
    } catch (error) {
      console.error("Record adherence error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to record medicine adherence",
        error: error.message,
      })
    }
  },
)

// Get active medicines for patient
router.get("/active", authenticateToken, authorizeRoles("patient"), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.userId })
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found",
      })
    }

    const now = new Date()
    const medicines = await Medicine.find({
      patientId: patient._id,
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .populate("doctorId", "name doctorProfile.specialty")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: { medicines },
    })
  } catch (error) {
    console.error("Get active medicines error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch active medicines",
      error: error.message,
    })
  }
})

export default router
