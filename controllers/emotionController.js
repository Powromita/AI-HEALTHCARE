const EmotionSession = require('../models/EmotionSession');
const MediaContent = require('../models/MediaContent');
const EmotionQuestion = require('../models/EmotionQuestion');
const { loadEmotionData, convertCSVToEmotionMapping, getDefaultEmotionMapping } = require('../utils/csvParser');
const RecommendationEngine = require('../utils/recommendationEngine');

// Initialize recommendation engine with CSV data
let recommendationEngine = null;

// Initialize emotion data (load CSV on startup)
async function initializeEmotionData() {
  try {
    // Try to load CSV data
    const csvData = loadEmotionData('data/emotions.csv');
    const emotionMapping = csvData ? convertCSVToEmotionMapping(csvData) : getDefaultEmotionMapping();
    
    // Load all media content for recommendation engine
    const mediaContent = await MediaContent.find({ isActive: true });
    
    // Initialize recommendation engine
    recommendationEngine = new RecommendationEngine(emotionMapping, mediaContent);
    
    console.log('Emotion data initialized with', Object.keys(emotionMapping).length, 'emotions');
    return recommendationEngine;
  } catch (error) {
    console.error('Error initializing emotion data:', error);
    // Fall back to default
    const emotionMapping = getDefaultEmotionMapping();
    recommendationEngine = new RecommendationEngine(emotionMapping, []);
    return recommendationEngine;
  }
}

// Initialize on module load
initializeEmotionData();

// Get initial media recommendations
exports.getInitialMedia = async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    
    // Ensure recommendation engine is initialized
    if (!recommendationEngine) {
      await initializeEmotionData();
    }
    
    // Get initial media content (neutral or positive) - use recommendation engine
    const allInitialMedia = await MediaContent.find({
      contentType: 'initial',
      isActive: true
    });
    
    // Update recommendation engine with latest media
    recommendationEngine.mediaContent = allInitialMedia;
    
    // Use recommendation engine to get personalized recommendations
    // For initial media, use neutral emotion as base
    const initialMedia = recommendationEngine.recommendMedia('neutral', [], [])
      .slice(0, parseInt(limit));
    
    // If not enough recommendations, fall back to simple query
    if (initialMedia.length < parseInt(limit)) {
      const fallback = await MediaContent.find({
        contentType: 'initial',
        isActive: true
      })
        .sort({ usageCount: 1, effectivenessScore: -1 })
        .limit(parseInt(limit));
      
      res.json({
        success: true,
        media: fallback
      });
    } else {
      res.json({
        success: true,
        media: initialMedia
      });
    }
  } catch (error) {
    console.error('Get initial media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start a new emotion assessment session
exports.startSession = async (req, res) => {
  try {
    const { sessionType = 'daily_check' } = req.body;
    
    const session = new EmotionSession({
      patient: req.user._id,
      sessionType
    });
    await session.save();
    
    // Get initial media
    const initialMedia = await MediaContent.find({
      contentType: 'initial',
      isActive: true
    })
      .limit(3)
      .sort({ usageCount: 1 });
    
    res.status(201).json({
      success: true,
      session,
      initialMedia
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Record initial media consumption
exports.recordInitialMediaWatch = async (req, res) => {
  try {
    const { sessionId, mediaId, watchedDuration, completionRate } = req.body;
    
    const session = await EmotionSession.findOne({
      _id: sessionId,
      patient: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Update or add media watch record
    const existingMedia = session.initialMedia.find(
      m => m.media.toString() === mediaId
    );
    
    if (existingMedia) {
      existingMedia.watchedAt = new Date();
      existingMedia.watchedDuration = watchedDuration;
      existingMedia.completionRate = completionRate;
    } else {
      session.initialMedia.push({
        media: mediaId,
        watchedAt: new Date(),
        watchedDuration,
        completionRate
      });
    }
    
    await session.save();
    
    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Record initial media watch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pre-assessment questions
exports.getPreAssessmentQuestions = async (req, res) => {
  try {
    const questions = await EmotionQuestion.find({
      questionStage: 'pre',
      isActive: true
    })
      .sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Get pre-assessment questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit pre-assessment responses and get therapeutic media recommendation
exports.submitPreAssessment = async (req, res) => {
  try {
    const { sessionId, responses } = req.body;
    
    const session = await EmotionSession.findOne({
      _id: sessionId,
      patient: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Process responses
    const questionIds = responses.map(r => r.questionId);
    const questions = await EmotionQuestion.find({ _id: { $in: questionIds } });
    
    const processedResponses = responses.map(response => {
      const question = questions.find(q => q._id.toString() === response.questionId);
      return {
        question: response.questionId,
        answer: response.answer,
        selectedOption: response.selectedOption,
        timestamp: new Date()
      };
    });
    
    session.preAssessment = {
      responses: processedResponses,
      completedAt: new Date()
    };
    
    // Ensure recommendation engine is initialized
    if (!recommendationEngine) {
      await initializeEmotionData();
    }
    
    // Update recommendation engine with latest media
    const allMedia = await MediaContent.find({ isActive: true });
    recommendationEngine.mediaContent = allMedia;
    
    // Get media behavior from session
    const mediaBehavior = {
      watchedDuration: session.initialMedia.reduce((sum, m) => sum + (m.watchedDuration || 0), 0),
      totalDuration: session.initialMedia.reduce((sum, m) => sum + (m.watchedDuration || 0), 0),
      mediaCount: session.initialMedia.length
    };
    
    // Use recommendation engine to diagnose emotion
    const responseData = responses.map(r => {
      const question = questions.find(q => q._id.toString() === r.questionId);
      return {
        question: question,
        questionId: r.questionId,
        selectedOption: r.selectedOption,
        answer: r.selectedOption
      };
    });
    
    const diagnosedEmotion = recommendationEngine.diagnoseEmotion(responseData, mediaBehavior);
    
    // Store assessed emotion in format compatible with existing code
    const assessedEmotion = {
      mental: diagnosedEmotion.emotion,
      physical: 'normal', // Can be enhanced
      overall: diagnosedEmotion.emotion,
      confidence: diagnosedEmotion.confidence,
      intensity: diagnosedEmotion.intensity,
      symptoms: diagnosedEmotion.symptoms,
      physicalSigns: diagnosedEmotion.physicalSigns,
      mentalSigns: diagnosedEmotion.mentalSigns,
      allScores: diagnosedEmotion.allScores
    };
    
    session.preAssessment.assessedEmotion = assessedEmotion;
    
    // Store ML prediction
    session.preAssessment.mlPrediction = {
      emotion: diagnosedEmotion.emotion,
      confidence: diagnosedEmotion.confidence,
      features: {
        intensity: diagnosedEmotion.intensity,
        symptoms: diagnosedEmotion.symptoms
      }
    };
    
    await session.save();
    
    // Get therapeutic media using recommendation engine
    const excludedMediaIds = session.initialMedia.map(m => m.media?.toString()).filter(Boolean);
    const therapeuticMedia = recommendationEngine.recommendMedia(
      assessedEmotion.overall,
      [],
      excludedMediaIds
    );
    
    res.json({
      success: true,
      session,
      assessedEmotion,
      therapeuticMedia
    });
  } catch (error) {
    console.error('Submit pre-assessment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Record therapeutic media consumption
exports.recordTherapeuticMediaWatch = async (req, res) => {
  try {
    const { sessionId, mediaId, watchedDuration, completionRate } = req.body;
    
    const session = await EmotionSession.findOne({
      _id: sessionId,
      patient: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    const media = await MediaContent.findById(mediaId);
    
    session.therapeuticMedia.push({
      media: mediaId,
      recommendedReason: `Recommended based on ${session.preAssessment.assessedEmotion.overall} emotion`,
      watchedAt: new Date(),
      watchedDuration,
      completionRate
    });
    
    await session.save();
    
    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Record therapeutic media watch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get post-assessment questions
exports.getPostAssessmentQuestions = async (req, res) => {
  try {
    const questions = await EmotionQuestion.find({
      questionStage: 'post',
      isActive: true
    })
      .sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Get post-assessment questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit post-assessment and calculate genuineness
exports.submitPostAssessment = async (req, res) => {
  try {
    const { sessionId, responses } = req.body;
    
    const session = await EmotionSession.findOne({
      _id: sessionId,
      patient: req.user._id
    }).populate('preAssessment.responses.question postAssessment.responses.question');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Process responses
    const questionIds = responses.map(r => r.questionId);
    const questions = await EmotionQuestion.find({ _id: { $in: questionIds } });
    
    const processedResponses = responses.map(response => {
      return {
        question: response.questionId,
        answer: response.answer,
        selectedOption: response.selectedOption,
        timestamp: new Date()
      };
    });
    
    session.postAssessment = {
      responses: processedResponses,
      completedAt: new Date()
    };
    
    // Ensure recommendation engine is initialized
    if (!recommendationEngine) {
      await initializeEmotionData();
    }
    
    // Update recommendation engine with latest media
    const allMedia = await MediaContent.find({ isActive: true });
    recommendationEngine.mediaContent = allMedia;
    
    // Get media behavior from session (include therapeutic media)
    const therapeuticMediaBehavior = {
      watchedDuration: session.therapeuticMedia.reduce((sum, m) => sum + (m.watchedDuration || 0), 0),
      totalDuration: session.therapeuticMedia.reduce((sum, m) => sum + (m.watchedDuration || 0), 0),
      mediaCount: session.therapeuticMedia.length
    };
    
    // Use recommendation engine to diagnose post-emotion
    const postResponseData = responses.map(r => {
      const question = questions.find(q => q._id.toString() === r.questionId);
      return {
        question: question,
        questionId: r.questionId,
        selectedOption: r.selectedOption,
        answer: r.selectedOption
      };
    });
    
    const postDiagnosedEmotion = recommendationEngine.diagnoseEmotion(postResponseData, therapeuticMediaBehavior);
    
    // Store assessed emotion in format compatible with existing code
    const postAssessedEmotion = {
      mental: postDiagnosedEmotion.emotion,
      physical: 'normal', // Can be enhanced
      overall: postDiagnosedEmotion.emotion,
      confidence: postDiagnosedEmotion.confidence,
      intensity: postDiagnosedEmotion.intensity,
      symptoms: postDiagnosedEmotion.symptoms,
      physicalSigns: postDiagnosedEmotion.physicalSigns,
      mentalSigns: postDiagnosedEmotion.mentalSigns,
      allScores: postDiagnosedEmotion.allScores
    };
    
    session.postAssessment.assessedEmotion = postAssessedEmotion;
    
    // Calculate improvement
    const improvement = calculateImprovement(
      session.preAssessment.assessedEmotion,
      postAssessedEmotion
    );
    session.postAssessment.improvement = improvement.type;
    session.postAssessment.improvementScore = improvement.score;
    
    // Ensure recommendation engine is initialized
    if (!recommendationEngine) {
      await initializeEmotionData();
    }
    
    // Use recommendation engine to assess genuineness
    const genuinenessAssessment = recommendationEngine.assessGenuineness(session);
    
    session.genuinenessAssessment = {
      isGenuine: genuinenessAssessment.isGenuine,
      genuinenessScore: genuinenessAssessment.score,
      indicators: {
        responseConsistency: genuinenessAssessment.factors.find(f => f.name === 'Response Consistency')?.score || 0.5,
        improvementPattern: session.postAssessment.improvement,
        videoWatchBehavior: {
          avgCompletion: genuinenessAssessment.factors.find(f => f.name === 'Media Engagement')?.score || 0.5
        }
      },
      mlGenuinenessScore: genuinenessAssessment.score,
      factors: genuinenessAssessment.factors
    };
    
    // Complete session
    session.sessionStatus = 'completed';
    session.completedAt = new Date();
    session.sessionDuration = Math.floor(
      (new Date() - session.startedAt) / 1000
    );
    
    await session.save();
    
    res.json({
      success: true,
      session,
      improvement,
      genuineness: session.genuinenessAssessment
    });
  } catch (error) {
    console.error('Submit post-assessment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get session history
exports.getSessionHistory = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    const sessions = await EmotionSession.find({
      patient: req.user._id,
      sessionStatus: 'completed'
    })
      .populate('initialMedia.media therapeuticMedia.media', 'title targetEmotion mediaType')
      .sort({ startedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await EmotionSession.countDocuments({
      patient: req.user._id,
      sessionStatus: 'completed'
    });
    
    res.json({
      success: true,
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get session history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to assess emotion from responses (fallback if recommendation engine not available)
function assessEmotionFromResponses(questions, responses) {
  const emotionScores = {
    happy: 0,
    calm: 0,
    energetic: 0,
    focused: 0,
    relaxed: 0,
    sad: 0,
    anxious: 0,
    stressed: 0,
    angry: 0,
    neutral: 0
  };
  
  responses.forEach(response => {
    const question = questions.find(q => q._id.toString() === response.questionId);
    if (question && question.options) {
      const option = question.options.find(o => o.text === response.selectedOption);
      if (option && option.emotionMapping) {
        emotionScores[option.emotionMapping] += (option.score || 1) * (question.weight || 1);
      }
    }
  });
  
  // Determine overall emotion
  const sortedEmotions = Object.entries(emotionScores)
    .sort((a, b) => b[1] - a[1]);
  
  const overall = sortedEmotions[0][0];
  const confidence = sortedEmotions[0][1] / (
    Object.values(emotionScores).reduce((a, b) => a + b, 0) || 1
  );
  
  // Determine mental and physical separately
  const mentalEmotions = ['happy', 'calm', 'sad', 'anxious', 'stressed', 'angry', 'neutral'];
  const physicalEmotions = ['healthy', 'tired', 'energetic', 'uncomfortable', 'pain', 'normal'];
  
  return {
    mental: mentalEmotions.includes(overall) ? overall : 'neutral',
    physical: 'normal', // This can be enhanced
    overall,
    confidence: Math.min(1, confidence)
  };
}

// Helper function to calculate improvement
function calculateImprovement(preEmotion, postEmotion) {
  const negativeEmotions = ['sad', 'anxious', 'stressed', 'angry'];
  const positiveEmotions = ['happy', 'calm', 'energetic', 'focused', 'relaxed'];
  
  const preIsNegative = negativeEmotions.includes(preEmotion.overall);
  const postIsPositive = positiveEmotions.includes(postEmotion.overall);
  
  let improvementType = 'same';
  let score = 0;
  
  if (preIsNegative && postIsPositive) {
    improvementType = 'improved';
    score = 8;
  } else if (preIsNegative && !postIsPositive && preEmotion.overall !== postEmotion.overall) {
    improvementType = 'improved';
    score = 4;
  } else if (preIsNegative && !postIsPositive && preEmotion.overall === postEmotion.overall) {
    improvementType = 'same';
    score = 0;
  } else if (!preIsNegative && postIsPositive) {
    improvementType = 'improved';
    score = 3;
  } else if (!preIsNegative && !postIsPositive && preEmotion.overall === postEmotion.overall) {
    improvementType = 'same';
    score = 0;
  }
  
  // Adjust score based on confidence
  score *= ((preEmotion.confidence || 0.5) + (postEmotion.confidence || 0.5)) / 2;
  
  return {
    type: improvementType,
    score: Math.round(score)
  };
}

