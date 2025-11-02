import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Grid,
  Avatar,
  Chip,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Psychology,
  VideoLibrary,
  QuestionAnswer,
  Assessment
} from '@mui/icons-material';
import axios from 'axios';

const stages = [
  'Initial Media',
  'Pre-Assessment',
  'Therapeutic Media',
  'Post-Assessment',
  'Results'
];

function EmotionAssessment() {
  const [activeStep, setActiveStep] = useState(0);
  const [session, setSession] = useState(null);
  const [initialMedia, setInitialMedia] = useState([]);
  const [therapeuticMedia, setTherapeuticMedia] = useState([]);
  const [preQuestions, setPreQuestions] = useState([]);
  const [postQuestions, setPostQuestions] = useState([]);
  const [preResponses, setPreResponses] = useState({});
  const [postResponses, setPostResponses] = useState({});
  const [watchedMedia, setWatchedMedia] = useState([]);
  const [assessedEmotion, setAssessedEmotion] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaWatched, setMediaWatched] = useState(false);

  useEffect(() => {
    checkCurrentSession();
    loadInitialMedia();
  }, []);

  const checkCurrentSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/emotion/sessions/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.session) {
        setSession(response.data.session);
        setActiveStep(getCurrentStep(response.data.session));
      }
    } catch (error) {
      console.error('Check session error:', error);
    }
  };

  const getCurrentStep = (session) => {
    if (session.postAssessment?.completedAt) return 4;
    if (session.postAssessment?.responses?.length > 0) return 4;
    if (session.therapeuticMedia?.length > 0) return 3;
    if (session.preAssessment?.completedAt) return 2;
    if (session.preAssessment?.responses?.length > 0) return 1;
    if (session.initialMedia?.length > 0) return 1;
    return 0;
  };

  const loadInitialMedia = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/emotion/media/initial', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInitialMedia(response.data.media || []);
    } catch (error) {
      console.error('Load initial media error:', error);
    }
  };

  const startSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/emotion/session/start', 
        { sessionType: 'on_demand' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSession(response.data.session);
      setInitialMedia(response.data.initialMedia || []);
      setActiveStep(0);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const recordMediaWatch = async (mediaId, duration, completionRate) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/emotion/session/record-initial-media', 
        {
          sessionId: session._id,
          mediaId,
          watchedDuration: duration,
          completionRate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Record media watch error:', error);
    }
  };

  const handleMediaComplete = async (mediaId) => {
    // Record that media was watched (simplified - in real app, track actual duration)
    await recordMediaWatch(mediaId, 60, 100);
    setWatchedMedia([...watchedMedia, mediaId]);
    
    if (currentMediaIndex < initialMedia.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
      setMediaWatched(false);
    } else {
      setMediaWatched(true);
      loadPreQuestions();
      setTimeout(() => {
        setActiveStep(1);
      }, 1000);
    }
  };

  const loadPreQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/emotion/questions/pre', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Load pre questions error:', error);
    }
  };

  const submitPreAssessment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const responses = Object.entries(preResponses).map(([questionId, response]) => ({
        questionId,
        selectedOption: response,
        answer: response
      }));
      
      const response = await axios.post('/api/emotion/assessment/pre', 
        {
          sessionId: session._id,
          responses
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAssessedEmotion(response.data.assessedEmotion);
      setTherapeuticMedia(response.data.therapeuticMedia || []);
      setActiveStep(2);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const recordTherapeuticMediaWatch = async (mediaId, duration, completionRate) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/emotion/session/record-therapeutic-media', 
        {
          sessionId: session._id,
          mediaId,
          watchedDuration: duration,
          completionRate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Record therapeutic media watch error:', error);
    }
  };

  const handleTherapeuticMediaComplete = async (mediaId) => {
    await recordTherapeuticMediaWatch(mediaId, 60, 100);
    loadPostQuestions();
    setTimeout(() => {
      setActiveStep(3);
    }, 1000);
  };

  const loadPostQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/emotion/questions/post', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPostQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Load post questions error:', error);
    }
  };

  const submitPostAssessment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const responses = Object.entries(postResponses).map(([questionId, response]) => ({
        questionId,
        selectedOption: response,
        answer: response
      }));
      
      const response = await axios.post('/api/emotion/assessment/post', 
        {
          sessionId: session._id,
          responses
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResults(response.data);
      setActiveStep(4);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const renderInitialMedia = () => {
    if (initialMedia.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography>No media available. Please start a session.</Typography>
          </CardContent>
        </Card>
      );
    }

    const currentMedia = initialMedia[currentMediaIndex];

    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
          Watch these videos/audios to begin
        </Typography>
        
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#1282A2', mr: 2 }}>
                {currentMedia.mediaType === 'video' ? <VideoLibrary /> : <Psychology />}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{currentMedia.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {currentMedia.description}
                </Typography>
              </Box>
            </Box>
            
            {/* In a real app, this would be an actual video/audio player */}
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 4, 
              borderRadius: 2,
              textAlign: 'center',
              mb: 2
            }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {currentMedia.mediaType === 'video' ? 'Video Player' : 'Audio Player'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {currentMedia.fileUrl}
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => handleMediaComplete(currentMedia._id)}
                sx={{ mt: 2, bgcolor: '#63372C' }}
              >
                Mark as Watched
              </Button>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={((currentMediaIndex + 1) / initialMedia.length) * 100} 
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              {currentMediaIndex + 1} of {initialMedia.length}
            </Typography>
          </CardContent>
        </Card>
        
        {mediaWatched && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Great! Now let's assess how you're feeling.
          </Alert>
        )}
      </Box>
    );
  };

  const renderQuestions = (questions, responses, setResponses) => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
          Please answer these questions
        </Typography>
        
        {questions.map((question, index) => (
          <Card key={question._id} sx={{ mb: 3 }}>
            <CardContent>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {index + 1}. {question.questionText}
                </FormLabel>
                <RadioGroup
                  value={responses[question._id] || ''}
                  onChange={(e) => setResponses({ ...responses, [question._id]: e.target.value })}
                >
                  {question.options?.map((option, optIndex) => (
                    <FormControlLabel
                      key={optIndex}
                      value={option.text}
                      control={<Radio />}
                      label={option.text}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            onClick={questions === preQuestions ? submitPreAssessment : submitPostAssessment}
            disabled={loading || Object.keys(responses).length < questions.length}
            sx={{ bgcolor: '#63372C' }}
          >
            Submit Assessment
          </Button>
        </Box>
      </Box>
    );
  };

  const renderTherapeuticMedia = () => {
    if (therapeuticMedia.length === 0) {
      return <Typography>No therapeutic media available.</Typography>;
    }

    const media = therapeuticMedia[0]; // Show first recommended media

    return (
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          Based on your assessment, we recommend this content to help you feel better.
        </Alert>
        
        {assessedEmotion && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Detected Emotion:</strong> {assessedEmotion.overall}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Confidence: {(assessedEmotion.confidence * 100).toFixed(0)}%
            </Typography>
          </Box>
        )}
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#1282A2', mr: 2 }}>
                {media.mediaType === 'video' ? <VideoLibrary /> : <Psychology />}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{media.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {media.description}
                </Typography>
                <Chip 
                  label={`Target: ${media.targetEmotion}`} 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 4, 
              borderRadius: 2,
              textAlign: 'center',
              mb: 2
            }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {media.mediaType === 'video' ? 'Video Player' : 'Audio Player'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {media.fileUrl}
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => handleTherapeuticMediaComplete(media._id)}
                sx={{ mt: 2, bgcolor: '#63372C' }}
              >
                Mark as Watched
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
          Assessment Complete
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Improvement Status
                </Typography>
                <Chip 
                  label={results.improvement?.type || 'Same'} 
                  color={results.improvement?.type === 'improved' ? 'success' : 'default'}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body1">
                  Improvement Score: {results.improvement?.score || 0}/10
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Genuineness Assessment
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Score: {(results.genuineness?.genuinenessScore * 100 || 0).toFixed(0)}%
                </Typography>
                <Chip 
                  label={results.genuineness?.isGenuine ? 'Genuine' : 'Review Recommended'} 
                  color={results.genuineness?.isGenuine ? 'success' : 'warning'}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Session Summary
            </Typography>
            <Typography variant="body2" paragraph>
              Pre-assessment emotion: {results.session?.preAssessment?.assessedEmotion?.overall}
            </Typography>
            <Typography variant="body2" paragraph>
              Post-assessment emotion: {results.session?.postAssessment?.assessedEmotion?.overall}
            </Typography>
            <Typography variant="body2">
              Session duration: {Math.floor((results.session?.sessionDuration || 0) / 60)} minutes
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  };

  if (!session) {
    return (
      <Box>
        <Typography variant="h4" sx={{ color: '#011D4D', mb: 3 }}>
          Emotion Assessment
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body1" paragraph>
              This assessment will help us understand your current emotional and physical state
              through video/audio content and questions.
            </Typography>
            <Button
              variant="contained"
              onClick={startSession}
              disabled={loading}
              sx={{ bgcolor: '#63372C', mt: 2 }}
            >
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#011D4D', mb: 3 }}>
        Emotion Assessment
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {stages.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Card>
        <CardContent>
          {activeStep === 0 && renderInitialMedia()}
          {activeStep === 1 && renderQuestions(preQuestions, preResponses, setPreResponses)}
          {activeStep === 2 && renderTherapeuticMedia()}
          {activeStep === 3 && renderQuestions(postQuestions, postResponses, setPostResponses)}
          {activeStep === 4 && renderResults()}
        </CardContent>
      </Card>
    </Box>
  );
}

export default EmotionAssessment;

