import express from "express"
import { body, validationResult } from "express-validator"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Mock chat responses - In production, integrate with AI service
const generateAIResponse = (message, userRole) => {
  const responses = {
    greeting: [
      "Hello! I'm here to help with any questions about your treatment. How are you feeling today?",
      "Hi there! I'm your AI health assistant. What can I help you with today?",
      "Welcome! I'm here to support you through your healthcare journey. How can I assist you?",
    ],
    symptoms: [
      "I understand you're experiencing some symptoms. This is common during treatment. Let me help you understand what you're going through and when you should contact your care team.",
      "Thank you for sharing your symptoms with me. It's important to monitor how you're feeling. Based on what you've described, here's what I recommend...",
      "I'm here to help you understand your symptoms. While I can provide general guidance, please remember to contact your healthcare team for any concerning symptoms.",
    ],
    medication: [
      "I can help you with medication-related questions. It's great that you're staying informed about your treatment. Let me provide you with some helpful information.",
      "Medication questions are very important. I'm here to help you understand your prescriptions and remind you about proper adherence.",
      "Thank you for asking about your medications. Proper medication management is crucial for your treatment success.",
    ],
    general: [
      "I'm here to help with any healthcare-related questions you might have. Feel free to ask me about treatments, medications, symptoms, or general health information.",
      "That's a great question! I'm designed to help patients, doctors, and healthcare staff with medical information and support.",
      "I understand your concern. Let me provide you with some helpful information and guidance.",
    ],
  }

  const messageText = message.toLowerCase()

  if (messageText.includes("hello") || messageText.includes("hi") || messageText.includes("hey")) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)]
  } else if (
    messageText.includes("symptom") ||
    messageText.includes("pain") ||
    messageText.includes("tired") ||
    messageText.includes("nausea")
  ) {
    return responses.symptoms[Math.floor(Math.random() * responses.symptoms.length)]
  } else if (
    messageText.includes("medication") ||
    messageText.includes("medicine") ||
    messageText.includes("pill") ||
    messageText.includes("dose")
  ) {
    return responses.medication[Math.floor(Math.random() * responses.medication.length)]
  } else {
    return responses.general[Math.floor(Math.random() * responses.general.length)]
  }
}

// Send message to AI assistant
router.post(
  "/ai-assistant",
  authenticateToken,
  [body("message").trim().isLength({ min: 1, max: 1000 }).withMessage("Message must be between 1 and 1000 characters")],
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

      const { message } = req.body
      const userRole = req.user.role

      // Generate AI response (in production, this would call an actual AI service)
      const aiResponse = generateAIResponse(message, userRole)

      // In a real implementation, you would:
      // 1. Save the conversation to database
      // 2. Call actual AI service (OpenAI, etc.)
      // 3. Apply context from patient's medical history
      // 4. Include relevant medical information

      const conversation = {
        id: `conv_${Date.now()}`,
        userMessage: {
          text: message,
          timestamp: new Date(),
          sender: "user",
        },
        aiResponse: {
          text: aiResponse,
          timestamp: new Date(),
          sender: "ai-assistant",
        },
      }

      res.json({
        success: true,
        message: "Message sent successfully",
        data: { conversation },
      })
    } catch (error) {
      console.error("AI chat error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to process message",
        error: error.message,
      })
    }
  },
)

// Get chat history (if implementing persistent chat)
router.get("/history", authenticateToken, async (req, res) => {
  try {
    // In a real implementation, fetch from database
    const mockHistory = [
      {
        id: "msg_001",
        text: "Hello! I'm here to help with any questions about your treatment. How are you feeling today?",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        sender: "ai-assistant",
      },
      {
        id: "msg_002",
        text: "I'm feeling a bit tired after yesterday's session. Is this normal?",
        timestamp: new Date(Date.now() - 3500000),
        sender: "user",
      },
      {
        id: "msg_003",
        text: "Yes, fatigue is a common side effect. Make sure to rest and stay hydrated. I'll notify your care team about your symptoms.",
        timestamp: new Date(Date.now() - 3400000),
        sender: "ai-assistant",
      },
    ]

    res.json({
      success: true,
      data: { messages: mockHistory },
    })
  } catch (error) {
    console.error("Get chat history error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: error.message,
    })
  }
})

// Send message to care team
router.post(
  "/care-team",
  authenticateToken,
  [
    body("message").trim().isLength({ min: 1, max: 1000 }).withMessage("Message must be between 1 and 1000 characters"),
    body("priority").optional().isIn(["low", "medium", "high", "urgent"]).withMessage("Invalid priority level"),
    body("category")
      .optional()
      .isIn(["general", "symptoms", "medication", "appointment", "emergency"])
      .withMessage("Invalid category"),
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

      const { message, priority = "medium", category = "general" } = req.body

      // In a real implementation, you would:
      // 1. Save message to database
      // 2. Notify relevant care team members
      // 3. Send email/SMS notifications based on priority
      // 4. Create ticket in healthcare management system

      const messageData = {
        id: `msg_${Date.now()}`,
        userId: req.user.userId,
        message,
        priority,
        category,
        timestamp: new Date(),
        status: "sent",
        readBy: [],
      }

      res.json({
        success: true,
        message: "Message sent to care team successfully",
        data: { messageData },
      })
    } catch (error) {
      console.error("Send care team message error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to send message to care team",
        error: error.message,
      })
    }
  },
)

// Get messages from care team
router.get("/care-team/messages", authenticateToken, async (req, res) => {
  try {
    // Mock care team messages
    const mockMessages = [
      {
        id: "ct_msg_001",
        from: "Dr. Sarah Wilson",
        fromRole: "doctor",
        message: "Your latest lab results look good. Keep up the great work!",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        priority: "medium",
        category: "general",
        read: false,
      },
      {
        id: "ct_msg_002",
        from: "Nurse Jennifer",
        fromRole: "nurse",
        message: "Reminder: Please arrive 30 minutes early for your next appointment",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        priority: "medium",
        category: "appointment",
        read: true,
      },
      {
        id: "ct_msg_003",
        from: "Pharmacy",
        fromRole: "pharmacy",
        message: "Your prescription is ready for pickup",
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        priority: "low",
        category: "medication",
        read: true,
      },
    ]

    res.json({
      success: true,
      data: { messages: mockMessages },
    })
  } catch (error) {
    console.error("Get care team messages error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch care team messages",
      error: error.message,
    })
  }
})

export default router
