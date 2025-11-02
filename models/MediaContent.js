const mongoose = require('mongoose');

const mediaContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  mediaType: {
    type: String,
    enum: ['video', 'audio'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String // For video thumbnails
  },
  duration: {
    type: Number, // Duration in seconds
    required: true
  },
  targetEmotion: {
    type: String,
    enum: ['happy', 'calm', 'energetic', 'focused', 'relaxed', 'sad', 'anxious', 'stressed', 'angry', 'neutral'],
    required: true
  },
  emotionCategory: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  contentType: {
    type: String,
    enum: ['initial', 'therapeutic'], // initial videos shown first, therapeutic are shown based on assessment
    default: 'initial'
  },
  tags: [{
    type: String
  }],
  metadata: {
    resolution: String, // For videos
    format: String,
    fileSize: Number,
    language: {
      type: String,
      default: 'en'
    }
  },
  usageCount: {
    type: Number,
    default: 0
  },
  effectivenessScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
mediaContentSchema.index({ targetEmotion: 1, contentType: 1 });
mediaContentSchema.index({ emotionCategory: 1, isActive: 1 });

module.exports = mongoose.model('MediaContent', mediaContentSchema);

