const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicationName: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  sideEffects: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled', 'Paused'],
    default: 'Active'
  },
  stockLevel: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'High'
  },
  reminders: {
    enabled: {
      type: Boolean,
      default: true
    },
    times: [{
      type: String // e.g., "08:00", "14:00", "20:00"
    }]
  },
  adherence: {
    totalDoses: {
      type: Number,
      default: 0
    },
    takenDoses: {
      type: Number,
      default: 0
    },
    missedDoses: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
medicationSchema.index({ patient: 1, status: 1 });
medicationSchema.index({ doctor: 1, status: 1 });
medicationSchema.index({ endDate: 1, status: 1 });

// Calculate adherence percentage
medicationSchema.methods.getAdherencePercentage = function() {
  if (this.adherence.totalDoses === 0) return 0;
  return Math.round((this.adherence.takenDoses / this.adherence.totalDoses) * 100);
};

module.exports = mongoose.model('Medication', medicationSchema);
