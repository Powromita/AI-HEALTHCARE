const mongoose = require('mongoose');

const emotionQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  questionType: {
    type: String,
    enum: ['mental', 'physical', 'combined'],
    required: true
  },
  questionStage: {
    type: String,
    enum: ['pre', 'post'], // pre: before therapeutic media, post: after therapeutic media
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    emotionMapping: {
      type: String,
      enum: ['happy', 'calm', 'energetic', 'focused', 'relaxed', 'sad', 'anxious', 'stressed', 'angry', 'neutral']
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  isRequired: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['mood', 'energy', 'stress', 'physical_discomfort', 'sleep', 'appetite', 'social', 'other']
  },
  weight: {
    type: Number,
    default: 1 // Weight for ML model training
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
emotionQuestionSchema.index({ questionStage: 1, questionType: 1, order: 1 });

module.exports = mongoose.model('EmotionQuestion', emotionQuestionSchema);

