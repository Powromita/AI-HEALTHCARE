import mongoose from "mongoose"

const treatmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    treatmentType: {
      type: String,
      required: true,
      enum: ["chemotherapy", "radiotherapy", "surgery", "physiotherapy", "consultation", "lab-test", "follow-up"],
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    location: {
      department: String,
      room: String,
      floor: String,
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    preparationInstructions: [String],
    postTreatmentInstructions: [String],
    notes: String,
    results: {
      summary: String,
      attachments: [String],
      nextSteps: [String],
    },
    reminders: [
      {
        type: {
          type: String,
          enum: ["preparation", "appointment", "follow-up"],
        },
        message: String,
        scheduledFor: Date,
        sent: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Treatment", treatmentSchema)
