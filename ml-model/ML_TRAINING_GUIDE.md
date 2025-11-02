# Emotion Assessment System - ML Model Training Guide

This guide explains how to train the ML models for emotion detection and genuineness assessment.

## Overview

The ML system consists of two models:
1. **Emotion Detection Model**: Predicts user's emotional state from responses and behavior
2. **Genuineness Detection Model**: Assesses whether user responses are genuine or potentially misleading

## Setup

### 1. Install Dependencies

```bash
cd ml-model
pip install -r requirements.txt
```

### 2. Prepare Training Data

You need training data in one of these formats:

#### Option A: JSON File
Create `training_data.json` with the following structure:

```json
[
  {
    "pre_assessment": {
      "responses": [
        {
          "question": {
            "options": [
              {
                "text": "Very happy",
                "emotionMapping": "happy",
                "score": 5
              }
            ],
            "weight": 1
          },
          "selectedOption": "Very happy"
        }
      ],
      "assessed_emotion": {
        "overall": "sad"
      }
    },
    "post_assessment": {
      "responses": [...],
      "assessed_emotion": {
        "overall": "happy"
      },
      "improvement": "improved"
    },
    "initial_media": [
      {
        "watchedDuration": 120,
        "completionRate": 100
      }
    ],
    "genuineness_assessment": {
      "is_genuine": true
    },
    "session_duration": 600
  }
]
```

#### Option B: MongoDB
Connect to your MongoDB database and ensure you have completed sessions with `genuinenessAssessment.isGenuine` labeled.

## Training the Models

### Step 1: Collect Initial Data

Before training, you need labeled data:
1. Run the emotion assessment system
2. Manually label sessions as genuine or not genuine (initially)
3. Export session data from MongoDB or save as JSON

### Step 2: Run Training

```bash
python emotion_detection_model.py
```

The script will:
1. Load training data
2. Prepare features from sessions
3. Train emotion detection model
4. Train genuineness detection model
5. Save models to `models/` directory

### Step 3: Evaluate Models

Check the output for:
- **Accuracy scores**: Should be >70% for good performance
- **Classification reports**: Shows precision, recall, F1-score per class
- **Confusion matrices**: Visualizes prediction errors

### Step 4: Integration with Backend

Once trained, integrate models with your Node.js backend:

1. Create a Python API service (Flask/FastAPI) that loads the models
2. Call the Python service from Node.js when processing assessments
3. Or use a Node.js ML library (like TensorFlow.js) to run the model directly

## Feature Engineering

The model uses these features:

### Response Features
- Number of responses
- Emotion scores from each response option
- Response weights and categories

### Media Behavior Features
- Number of videos/audios watched
- Total watch duration
- Average completion rate

### Consistency Features
- Consistency between pre and post responses
- Improvement patterns
- Response time patterns (if tracked)

### Session Features
- Total session duration
- Number of therapeutic media watched

## Improving Model Performance

### 1. Collect More Data
- More labeled sessions = better model
- Aim for at least 500+ labeled sessions
- Balance genuine vs non-genuine examples

### 2. Feature Engineering
- Add more features (response times, click patterns, etc.)
- Extract behavioral patterns
- Consider user history

### 3. Model Tuning
- Adjust hyperparameters in the model code
- Try different algorithms (SVM, Neural Networks, etc.)
- Use cross-validation

### 4. Active Learning
- Start with basic rules/heuristics
- Label edge cases manually
- Retrain with new data periodically

## Model Integration Options

### Option 1: Python Microservice
Create a Flask/FastAPI service that loads the models:

```python
from flask import Flask, request, jsonify
from emotion_detection_model import EmotionDetectionModel

app = Flask(__name__)
model = EmotionDetectionModel()
model.load_model()

@app.route('/predict/emotion', methods=['POST'])
def predict_emotion():
    data = request.json
    result = model.predict_emotion(data)
    return jsonify(result)

@app.route('/predict/genuineness', methods=['POST'])
def predict_genuineness():
    data = request.json
    result = model.predict_genuineness(data)
    return jsonify(result)
```

Call from Node.js:
```javascript
const axios = require('axios');
const result = await axios.post('http://localhost:5001/predict/emotion', sessionData);
```

### Option 2: TensorFlow.js
Convert model to TensorFlow.js format and run in Node.js directly.

### Option 3: Cloud ML Service
Deploy models to AWS SageMaker, Google Cloud ML, or Azure ML.

## Continuous Improvement

1. **Monitor Performance**: Track prediction accuracy over time
2. **Collect Feedback**: Let doctors/admin label sessions manually
3. **Retrain Regularly**: Retrain models with new data monthly
4. **A/B Testing**: Test different model versions

## Next Steps

1. ✅ Set up Python environment
2. ✅ Prepare initial training data
3. ✅ Train initial models
4. ✅ Integrate with backend API
5. ✅ Deploy to production
6. ✅ Monitor and improve

