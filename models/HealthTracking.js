const mongoose = require('mongoose');

const healthTrackingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trackingType: {
    type: String,
    enum: ['Blood Pressure', 'Heart Rate', 'Weight', 'Blood Sugar', 'Temperature', 'Sleep', 'Exercise'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  numericValue: {
    type: Number
  },
  unit: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String
  },
  status: {
    type: String,
    enum: ['Normal', 'High', 'Low', 'Good', 'Poor', 'Critical']
  },
  notes: {
    type: String
  },
  // For blood pressure tracking
  systolic: {
    type: Number
  },
  diastolic: {
    type: Number
  },
  // For exercise tracking
  duration: {
    type: Number // in minutes
  },
  intensity: {
    type: String,
    enum: ['Low', 'Moderate', 'High']
  },
  // For sleep tracking
  sleepHours: {
    type: Number
  },
  sleepQuality: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Excellent']
  }
}, {
  timestamps: true
});

// Index for efficient queries
healthTrackingSchema.index({ patient: 1, trackingType: 1, date: -1 });
healthTrackingSchema.index({ patient: 1, date: -1 });

module.exports = mongoose.model('HealthTracking', healthTrackingSchema);
