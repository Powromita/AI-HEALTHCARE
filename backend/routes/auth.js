import express from "express"
import jwt from "jsonwebtoken"
import { body, validationResult } from "express-validator"
import User from "../models/User.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Register new user
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("phone").isMobilePhone().withMessage("Please provide a valid phone number"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["admin", "doctor", "patient"]).withMessage("Invalid role"),
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

      const { name, email, phone, password, role, doctorProfile, patientProfile } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
      })

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email or phone already exists",
        })
      }

      // Create new user
      const userData = {
        name,
        email,
        phone,
        password,
        role,
      }

      if (role === "doctor" && doctorProfile) {
        userData.doctorProfile = doctorProfile
      }

      if (role === "patient" && patientProfile) {
        userData.patientProfile = patientProfile
      }

      const user = new User(userData)
      await user.save()

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      })
    }
  },
)

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
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

      const { email, password } = req.body

      // Find user by email
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        })
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated. Please contact administrator.",
        })
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        })
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      })
    }
  },
)

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      data: { user },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    })
  }
})

// Update user profile
router.put(
  "/profile",
  authenticateToken,
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("phone").optional().isMobilePhone().withMessage("Please provide a valid phone number"),
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

      const updates = req.body
      delete updates.password // Don't allow password updates through this endpoint
      delete updates.email // Don't allow email updates through this endpoint
      delete updates.role // Don't allow role updates through this endpoint

      const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true, runValidators: true })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: { user },
      })
    } catch (error) {
      console.error("Profile update error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: error.message,
      })
    }
  },
)

// Logout (client-side token removal)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Logout successful",
  })
})

export default router
