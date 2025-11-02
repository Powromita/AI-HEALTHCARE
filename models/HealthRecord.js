const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
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
  recordType: {
    type: String,
    enum: ['Lab Result', 'Vital Signs', 'Medical History', 'Imaging', 'Prescription', 'Treatment'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  // Lab Results specific fields
  testName: {
    type: String
  },
  result: {
    type: String
  },
  normalRange: {
    type: String
  },
  status: {
    type: String,
    enum: ['Normal', 'Abnormal', 'Good', 'High', 'Low', 'Critical']
  },
  // Vital Signs specific fields
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: {
    type: Number
  },
  temperature: {
    type: Number
  },
  weight: {
    type: Number
  },
  height: {
    type: Number
  },
  // Medical History specific fields
  condition: {
    type: String
  },
  diagnosis: {
    type: String
  },
  treatment: {
    type: String
  },
  // File attachments
  attachments: [{
    fileName: String,
    filePath: String,
    fileType: String,
    fileSize: Number
  }],
  // Additional notes
  notes: {
    type: String
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
healthRecordSchema.index({ patient: 1, recordType: 1 });
healthRecordSchema.index({ patient: 1, date: -1 });
healthRecordSchema.index({ doctor: 1, date: -1 });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
