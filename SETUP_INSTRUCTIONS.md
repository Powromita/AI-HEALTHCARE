# Emotion Assessment System - Setup Instructions

## Overview

This system implements a video/audio-based emotion assessment flow that:
1. Shows initial videos/audios
2. Asks pre-assessment questions
3. Shows therapeutic media (opposite emotion)
4. Asks post-assessment questions
5. Calculates genuineness score using ML

## Current Project Status

### ✅ Completed
- **Authentication System**: JWT-based auth for Admin, Doctor, Patient
- **Role-based Dashboards**: Separate dashboards for each role
- **Basic Health Tracking**: Blood pressure, heart rate, weight, etc.
- **Appointments System**: Booking and management
- **Medications**: Prescription tracking
- **Health Records**: Lab results and medical history

### 🆕 New Features Added
- **Emotion Assessment Models**:
  - `MediaContent`: Stores videos/audios with emotion tags
  - `EmotionQuestion`: Pre and post assessment questions
  - `EmotionSession`: Tracks complete assessment flow
- **Emotion Assessment Flow**: Complete frontend component
- **ML Model Structure**: Python-based emotion and genuineness detection
- **API Routes**: Backend endpoints for emotion assessment

## Installation Steps

### 1. Backend Setup

```bash
# Install backend dependencies (if not already done)
npm install

# Install additional dependencies for emotion assessment
npm install express mongoose cors dotenv bcryptjs jsonwebtoken

# Make sure MongoDB is running
# Update config.env with your MongoDB URI
```

### 2. Frontend Setup

```bash
cd client

# Install dependencies (if not already done)
npm install

# Dependencies should already include:
# - @mui/material
# - @mui/icons-material
# - axios
# - react-router-dom
```

### 3. Database Setup

The new models will be automatically created when you run the server:
- `MediaContent` collection
- `EmotionQuestion` collection
- `EmotionSession` collection

### 4. Seed Initial Data (Important!)

You need to populate initial data:

#### A. Create Media Content

Use MongoDB or create a seeding script:

```javascript
// scripts/seedMediaContent.js
const MediaContent = require('../models/MediaContent');

const initialMedia = [
  {
    title: "Calming Nature Sounds",
    description: "Relaxing audio to start your assessment",
    mediaType: "audio",
    fileUrl: "/media/calming-nature.mp3",
    duration: 120,
    targetEmotion: "calm",
    emotionCategory: "positive",
    contentType: "initial",
    isActive: true
  },
  // Add more media...
];

const therapeuticMedia = [
  {
    title: "Happy Uplifting Video",
    description: "Designed to improve mood",
    mediaType: "video",
    fileUrl: "/media/happy-video.mp4",
    duration: 180,
    targetEmotion: "happy",
    emotionCategory: "positive",
    contentType: "therapeutic",
    isActive: true
  },
  // Add more therapeutic media...
];
```

#### B. Create Assessment Questions

```javascript
// scripts/seedQuestions.js
const EmotionQuestion = require('../models/EmotionQuestion');

const preQuestions = [
  {
    questionText: "How are you feeling right now?",
    questionType: "mental",
    questionStage: "pre",
    options: [
      { text: "Very Happy", emotionMapping: "happy", score: 5 },
      { text: "Happy", emotionMapping: "happy", score: 4 },
      { text: "Neutral", emotionMapping: "neutral", score: 3 },
      { text: "Sad", emotionMapping: "sad", score: 2 },
      { text: "Very Sad", emotionMapping: "sad", score: 1 }
    ],
    order: 1,
    isActive: true
  },
  // Add more questions...
];
```

### 5. ML Model Setup (Optional for now)

```bash
cd ml-model
pip install -r requirements.txt

# Create training_data.json with initial labeled data
# Then run:
python emotion_detection_model.py
```

## Running the Application

### Start Backend

```bash
npm run server
# or
nodemon server.js
```

Server runs on `http://localhost:5000`

### Start Frontend

```bash
cd client
npm start
```

Frontend runs on `http://localhost:3000`

## Usage Flow

### For Patients:

1. **Login** as a patient
2. **Navigate** to "Emotion Assessment" in the sidebar
3. **Start Session**: Click "Start Assessment"
4. **Watch Initial Media**: Watch the recommended videos/audios
5. **Answer Pre-Assessment**: Answer questions about current state
6. **Watch Therapeutic Media**: Watch content designed to improve mood
7. **Answer Post-Assessment**: Answer questions again
8. **View Results**: See genuineness score and improvement

### For Admins/Doctors:

Currently, admins and doctors can:
- View patient records
- Manage appointments
- Prescribe medications

(You may want to add endpoints to view emotion assessment history)

## API Endpoints

### Emotion Assessment

- `POST /api/emotion/session/start` - Start new session
- `GET /api/emotion/media/initial` - Get initial media
- `POST /api/emotion/session/record-initial-media` - Record media watch
- `GET /api/emotion/questions/pre` - Get pre-assessment questions
- `POST /api/emotion/assessment/pre` - Submit pre-assessment
- `POST /api/emotion/session/record-therapeutic-media` - Record therapeutic media
- `GET /api/emotion/questions/post` - Get post-assessment questions
- `POST /api/emotion/assessment/post` - Submit post-assessment
- `GET /api/emotion/sessions/history` - Get session history

## Next Steps to Complete

### 1. Media Storage
- Set up file storage (AWS S3, Cloudinary, or local)
- Upload actual video/audio files
- Update `MediaContent.fileUrl` with real URLs

### 2. Video/Audio Player
- Integrate HTML5 video/audio player
- Track actual watch duration
- Detect completion (vs just clicking "Mark as Watched")

### 3. ML Model Integration
- Set up Python Flask/FastAPI service
- Connect Node.js backend to ML service
- Replace basic emotion assessment with ML predictions

### 4. Admin Interface
- Create admin panel to manage:
  - Media content (upload, edit, delete)
  - Assessment questions (create, edit, delete)
  - View patient assessment history

### 5. Enhanced Features
- Track response times
- Analyze click patterns
- Add more behavioral features for genuineness
- Implement real-time emotion tracking (if using webcam)

### 6. Testing
- Unit tests for controllers
- Integration tests for API
- Frontend component tests
- ML model validation

## File Structure

```
AI-HEALTHCARE/
├── models/
│   ├── MediaContent.js          # Video/Audio content
│   ├── EmotionQuestion.js       # Assessment questions
│   ├── EmotionSession.js        # Assessment sessions
│   └── ...
├── controllers/
│   └── emotionController.js     # Emotion assessment logic
├── routes/
│   └── emotion.js               # Emotion API routes
├── ml-model/
│   ├── emotion_detection_model.py
│   ├── requirements.txt
│   └── ML_TRAINING_GUIDE.md
├── client/
│   └── src/
│       └── components/
│           └── patient/
│               └── EmotionAssessment.js
└── ...
```

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `config.env`
- Check network/firewall settings

### Media Not Loading
- Ensure media files exist at specified URLs
- Check CORS settings
- Verify file paths are correct

### ML Model Not Working
- Ensure Python dependencies installed
- Check model files exist in `models/` directory
- Verify training data format

### Frontend Errors
- Clear browser cache
- Delete `node_modules` and reinstall
- Check console for specific errors

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Check GitHub issues (if applicable)

---

**Ready to start building!** Begin by seeding your database with initial media content and questions, then test the full assessment flow.

