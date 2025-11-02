const mongoose = require('mongoose');

const emotionSessionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    enum: ['daily_check', 'scheduled', 'on_demand'],
    default: 'daily_check'
  },
  // Stage 1: Initial Media Consumption
  initialMedia: [{
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MediaContent'
    },
    watchedAt: Date,
    watchedDuration: Number, // seconds
    completionRate: Number // percentage
  }],
  // Stage 2: Pre-assessment questions
  preAssessment: {
    responses: [{
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmotionQuestion'
      },
      answer: String,
      selectedOption: String,
      timestamp: Date
    }],
    completedAt: Date,
    assessedEmotion: {
      mental: {
        type: String,
        enum: ['happy', 'calm', 'energetic', 'focused', 'relaxed', 'sad', 'anxious', 'stressed', 'angry', 'neutral']
      },
      physical: {
        type: String,
        enum: ['healthy', 'tired', 'energetic', 'uncomfortable', 'pain', 'normal']
      },
      overall: {
        type: String,
        enum: ['happy', 'calm', 'energetic', 'focused', 'relaxed', 'sad', 'anxious', 'stressed', 'angry', 'neutral']
      },
      confidence: Number // ML model confidence score (0-1)
    },
    mlPrediction: {
      emotion: String,
      confidence: Number,
      features: mongoose.Schema.Types.Mixed
    }
  },
  // Stage 3: Therapeutic Media (opposite emotion)
  therapeuticMedia: [{
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MediaContent'
    },
    recommendedReason: String, // Why this media was recommended
    watchedAt: Date,
    watchedDuration: Number,
    completionRate: Number
  }],
  // Stage 4: Post-assessment questions
  postAssessment: {
    responses: [{
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmotionQuestion'
      },
      answer: String,
      selectedOption: String,
      timestamp: Date
    }],
    completedAt: Date,
    assessedEmotion: {
      mental: String,
      physical: String,
      overall: String,
      confidence: Number
    },
    improvement: {
      type: String,
      enum: ['improved', 'same', 'worse', 'unclear'],
      default: 'unclear'
    },
    improvementScore: Number // -10 to +10
  },
  // Stage 5: Genuineness Assessment
  genuinenessAssessment: {
    isGenuine: {
      type: Boolean,
      default: null // null means not assessed yet
    },
    genuinenessScore: {
      type: Number,
      min: 0,
      max: 1
    },
    indicators: {
      responseConsistency: Number, // 0-1
      improvementPattern: String,
      responseTimeAnalysis: mongoose.Schema.Types.Mixed,
      videoWatchBehavior: mongoose.Schema.Types.Mixed
    },
    mlGenuinenessScore: Number // ML model prediction
  },
  // Overall session results
  sessionStatus: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  sessionDuration: Number, // Total time in seconds
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  // Analytics
  analytics: {
    totalMediaWatched: Number,
    totalQuestionsAnswered: Number,
    averageResponseTime: Number,
    engagementScore: Number
  }
}, {
  timestamps: true
});

// Index for efficient queries
emotionSessionSchema.index({ patient: 1, startedAt: -1 });
emotionSessionSchema.index({ sessionStatus: 1, startedAt: -1 });
emotionSessionSchema.index({ 'preAssessment.assessedEmotion.overall': 1 });
emotionSessionSchema.index({ 'genuinenessAssessment.isGenuine': 1 });

// Method to calculate genuineness score
emotionSessionSchema.methods.calculateGenuineness = function() {
  const pre = this.preAssessment?.assessedEmotion?.overall;
  const post = this.postAssessment?.assessedEmotion?.overall;
  const improvement = this.postAssessment?.improvement;
  
  // Simple genuineness calculation (can be enhanced with ML)
  let score = 0.5; // Base score
  
  // Check if improvement aligns with therapeutic media goal
  if (pre && post && improvement) {
    // If negative emotion and improvement shown, increase score
    const negativeEmotions = ['sad', 'anxious', 'stressed', 'angry'];
    if (negativeEmotions.includes(pre) && improvement === 'improved') {
      score += 0.2;
    }
    
    // Response consistency
    if (this.preAssessment.responses.length > 0 && this.postAssessment.responses.length > 0) {
      score += 0.1;
    }
  }
  
  this.genuinenessAssessment.genuinenessScore = Math.min(1, Math.max(0, score));
  return this.genuinenessAssessment.genuinenessScore;
};

module.exports = mongoose.model('EmotionSession', emotionSessionSchema);

