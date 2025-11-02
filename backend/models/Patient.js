import mongoose from "mongoose"

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: String,
      unique: true,
      required: true,
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    treatmentPlan: {
      diagnosis: String,
      stage: String,
      startDate: Date,
      expectedDuration: Number, // in days
      status: {
        type: String,
        enum: ["active", "completed", "paused", "cancelled"],
        default: "active",
      },
      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
    treatments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Treatment",
      },
    ],
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],
    appointments: [
      {
        date: Date,
        time: String,
        type: String,
        doctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["scheduled", "completed", "cancelled", "no-show"],
          default: "scheduled",
        },
        notes: String,
      },
    ],
    vitals: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        bloodPressure: {
          systolic: Number,
          diastolic: Number,
        },
        heartRate: Number,
        temperature: Number,
        weight: Number,
        height: Number,
        oxygenSaturation: Number,
      },
    ],
    medicineAdherence: {
      totalDoses: {
        type: Number,
        default: 0,
      },
      takenDoses: {
        type: Number,
        default: 0,
      },
      adherenceRate: {
        type: Number,
        default: 0,
      },
    },
    videoProgress: [
      {
        videoId: String,
        title: String,
        category: String,
        watchedAt: Date,
        completed: Boolean,
        rating: Number,
        feedback: String,
      },
    ],
    motivationalContent: [
      {
        type: String,
        viewedAt: Date,
        rating: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Generate patient ID before saving
patientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    const count = await mongoose.model("Patient").countDocuments()
    this.patientId = `PAT${String(count + 1).padStart(6, "0")}`
  }
  next()
})

export default mongoose.model("Patient", patientSchema)
