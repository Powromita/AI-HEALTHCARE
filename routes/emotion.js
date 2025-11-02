const express = require('express');
const router = express.Router();
const emotionController = require('../controllers/emotionController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Start emotion assessment session
router.post('/session/start', authorize('patient'), emotionController.startSession);

// Get initial media recommendations
router.get('/media/initial', authorize('patient'), emotionController.getInitialMedia);

// Record initial media watch
router.post('/session/record-initial-media', authorize('patient'), emotionController.recordInitialMediaWatch);

// Get pre-assessment questions
router.get('/questions/pre', authorize('patient'), emotionController.getPreAssessmentQuestions);

// Submit pre-assessment and get therapeutic media
router.post('/assessment/pre', authorize('patient'), emotionController.submitPreAssessment);

// Record therapeutic media watch
router.post('/session/record-therapeutic-media', authorize('patient'), emotionController.recordTherapeuticMediaWatch);

// Get post-assessment questions
router.get('/questions/post', authorize('patient'), emotionController.getPostAssessmentQuestions);

// Submit post-assessment and get genuineness score
router.post('/assessment/post', authorize('patient'), emotionController.submitPostAssessment);

// Get session history
router.get('/sessions/history', authorize('patient'), emotionController.getSessionHistory);

// Get current session (if any)
router.get('/sessions/current', authorize('patient'), async (req, res) => {
  try {
    const EmotionSession = require('../models/EmotionSession');
    const session = await EmotionSession.findOne({
      patient: req.user._id,
      sessionStatus: 'in_progress'
    })
      .populate('initialMedia.media therapeuticMedia.media', 'title targetEmotion mediaType')
      .sort({ startedAt: -1 });
    
    if (!session) {
      return res.json({ success: true, session: null });
    }
    
    res.json({ success: true, session });
  } catch (error) {
    console.error('Get current session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

