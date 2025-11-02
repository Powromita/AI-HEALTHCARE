import mongoose from "mongoose"

const medicineSchema = new mongoose.Schema(
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
    medicineName: {
      type: String,
      required: true,
    },
    dosage: {
      amount: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
        required: true,
        enum: ["mg", "ml", "tablets", "capsules", "drops", "units"],
      },
    },
    frequency: {
      timesPerDay: {
        type: Number,
        required: true,
        min: 1,
        max: 6,
      },
      times: [String], // e.g., ["08:00", "14:00", "20:00"]
      interval: String, // e.g., "every 8 hours"
    },
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ["days", "weeks", "months"],
        default: "days",
      },
    },
    instructions: {
      beforeFood: Boolean,
      afterFood: Boolean,
      withFood: Boolean,
      specialInstructions: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused", "discontinued"],
      default: "active",
    },
    sideEffects: [String],
    adherenceLog: [
      {
        date: Date,
        time: String,
        taken: Boolean,
        notes: String,
        recordedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    refillReminders: [
      {
        reminderDate: Date,
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

export default mongoose.model("Medicine", medicineSchema)
