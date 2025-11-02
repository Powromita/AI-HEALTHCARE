import express from "express"
import { body, validationResult } from "express-validator"
import User from "../models/User.js"
import { authenticateToken, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Get all users (Admin only)
router.get("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query

    const query = {}
    if (role) query.role = role
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    })
  }
})

// Get user by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    // Users can only view their own profile unless they're admin
    if (req.user.role !== "admin" && req.user.userId !== id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    const user = await User.findById(id).select("-password")
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
    console.error("Get user error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    })
  }
})

// Update user (Admin only)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("phone").optional().isMobilePhone().withMessage("Please provide a valid phone number"),
    body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
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
      const updates = req.body

      // Don't allow certain fields to be updated
      delete updates.password
      delete updates.email
      delete updates.role

      const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select("-password")

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      res.json({
        success: true,
        message: "User updated successfully",
        data: { user },
      })
    } catch (error) {
      console.error("Update user error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update user",
        error: error.message,
      })
    }
  },
)

// Delete user (Admin only)
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    })
  }
})

// Get user statistics (Admin only)
router.get("/stats/overview", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const usersByRole = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }])

    const recentUsers = await User.find().select("-password").sort({ createdAt: -1 }).limit(5)

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        usersByRole,
        recentUsers,
      },
    })
  } catch (error) {
    console.error("Get user stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message,
    })
  }
})

export default router
