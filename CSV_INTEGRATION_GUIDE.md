# CSV Integration Guide - Recommendation-Based ML System

## Overview

The emotion assessment system now uses a **recommendation-based ML model** that reads emotion data from a CSV file. **No external APIs or databases are used** - everything runs locally using MongoDB and the CSV file.

## ✅ What's Been Implemented

### 1. CSV Parser (`utils/csvParser.js`)
- Reads emotion data from CSV file
- Converts CSV data to emotion mapping structure
- Falls back to default emotions if CSV not found

### 2. Recommendation Engine (`utils/recommendationEngine.js`)
- **Content-Based Recommendation**: Recommends media based on detected emotion
- **Collaborative Filtering**: Uses similar users' patterns (future enhancement)
- **Emotion Diagnosis**: Diagnoses user emotion from questions + media behavior
- **Genuineness Assessment**: Assesses response authenticity

### 3. Updated Controller (`controllers/emotionController.js`)
- Uses recommendation engine for all emotion assessments
- Loads CSV data on startup
- Provides ML-based recommendations for therapeutic media

## 📋 CSV File Format

Place your `emotions.csv` file in the `data/` directory.

### Required Column:
- **emotion** (or **Emotion** or **name**): The emotion name (e.g., "happy", "sad", "anxious")

### Optional Columns:
- **intensity**: Numeric value 1-5
- **symptoms**: Comma-separated list (e.g., "joy,contentment,excitement")
- **triggers**: Comma-separated list
- **physicalSigns**: Comma-separated physical signs
- **mentalSigns**: Comma-separated mental signs
- **oppositeEmotion**: The opposite emotion (e.g., "happy" for "sad")
- **recommendedContent**: Comma-separated tags (e.g., "uplifting,motivational")
- **category**: "positive", "negative", or "neutral"
- **severity**: "mild", "moderate", or "severe"

### Example CSV Format:

```csv
emotion,intensity,symptoms,oppositeEmotion,recommendedContent,category,severity
happy,5,"joy,contentment,excitement",sad,"uplifting,motivational",positive,mild
sad,2,"sorrow,melancholy,depression",happy,"uplifting,inspiring",negative,moderate
anxious,3,"worry,nervousness,fear",calm,"calming,relaxing",negative,moderate
stressed,4,"tension,pressure,overwhelm",relaxed,"calming,meditation",negative,severe
calm,4,"peace,serenity,tranquility",anxious,"meditation,nature",positive,mild
angry,4,"irritation,frustration,rage",calm,"calming,peaceful",negative,moderate
energetic,5,"vigor,enthusiasm,vitality",tired,"motivational,workout",positive,mild
relaxed,4,"comfort,ease,rest",stressed,"soothing,peaceful",positive,mild
neutral,3,"balance,equilibrium",excited,"balanced,moderate",neutral,mild
```

## 🚀 Setup Instructions

### Step 1: Add Your CSV File

1. Create `data/emotions.csv` file (if not exists)
2. Add your emotion data with the format shown above
3. Place the file in the `data/` directory

### Step 2: Start the Server

```bash
npm run server
```

The system will:
- Load CSV data on startup
- Initialize the recommendation engine
- Log: "Emotion data initialized with X emotions"

### Step 3: Test the System

1. Login as a patient
2. Go to "Emotion Assessment"
3. Complete the assessment flow:
   - Watch initial media
   - Answer pre-assessment questions
   - System diagnoses emotion using CSV data
   - Get therapeutic media recommendations
   - Watch therapeutic media
   - Answer post-assessment questions
   - View genuineness assessment

## 🔍 How It Works

### 1. Emotion Diagnosis

When a user answers questions, the system:
1. Reads question responses
2. Analyzes media watch behavior (duration, completion)
3. Uses CSV emotion data to map responses to emotions
4. Calculates emotion scores based on:
   - Response selections
   - Question weights
   - Media engagement patterns
5. Determines primary emotion with confidence score

### 2. Media Recommendation

Based on diagnosed emotion:
1. Looks up emotion in CSV data
2. Gets opposite emotion and recommended content tags
3. Scores all available media based on:
   - Target emotion match (50 points)
   - Tag matches (10 points per tag)
   - Category match (15 points)
   - Effectiveness score (2x multiplier)
   - Usage diversity (less used = higher score)
   - Duration preference (shorter = better for engagement)
4. Returns top 3 recommendations

### 3. Genuineness Assessment

The system assesses authenticity by:
1. **Response Consistency**: Compares pre/post responses
2. **Improvement Alignment**: Checks if improvement matches expectations
3. **Media Engagement**: Analyzes watch behavior (duration, completion)
4. **Session Duration**: Reasonableness check
5. **Therapeutic Engagement**: Completion of therapeutic media

Final genuineness score: 0-1 (1 = most genuine)

## 📊 Recommendation Engine Features

### Content-Based Filtering
- Scores media based on emotion match
- Uses CSV data for emotion-to-content mapping
- Considers user media behavior

### Collaborative Filtering (Future)
- Finds users with similar emotion patterns
- Recommends media that worked for similar users
- Learns from effective sessions

### Diagnosis Features
- Question response analysis
- Media behavior integration
- Intensity calculation
- Symptom and sign extraction

## 🎯 Key Benefits

✅ **No External APIs**: Everything runs locally
✅ **No External Databases**: Uses only MongoDB
✅ **CSV-Based**: Easy to update emotion data
✅ **ML-Based Recommendations**: Intelligent media suggestions
✅ **Genuineness Detection**: Prevents fake responses
✅ **Customizable**: Easy to adjust scoring weights

## 🔧 Customization

### Adjust Recommendation Scoring

Edit `utils/recommendationEngine.js`:

```javascript
// In recommendMedia() method
// Factor 1: Match target emotion (highest priority)
if (media.targetEmotion === oppositeEmotion) {
  score += 50; // Adjust weight
}
```

### Add More Emotion Features

Edit CSV file to include:
- More symptoms
- Physical signs
- Mental signs
- Additional tags for recommendations

### Customize Genuineness Assessment

Edit `utils/recommendationEngine.js` in `assessGenuineness()`:
- Adjust factor weights
- Add new factors
- Modify threshold (currently 0.6)

## 📝 CSV File Location

The system looks for the CSV file at:
- **Path**: `data/emotions.csv`
- **Fallback**: If not found, uses default emotion mappings

## 🐛 Troubleshooting

### CSV Not Loading
- Check file path: `data/emotions.csv`
- Verify CSV format (check headers)
- Check console logs for errors

### Recommendations Not Working
- Ensure media content is in database
- Check that CSV has `oppositeEmotion` column
- Verify `recommendedContent` tags match media tags

### Genuineness Scores Too Low/High
- Adjust factor weights in `assessGenuineness()`
- Modify threshold value (0.6)
- Check if user data is being tracked correctly

## 🎓 Next Steps

1. ✅ Add your `emotions.csv` file
2. ✅ Test the recommendation system
3. ✅ Adjust CSV data based on results
4. ✅ Fine-tune recommendation scoring
5. ✅ Add more emotions to CSV as needed

---

**The system is now fully integrated with CSV data and recommendation-based ML!** 🚀

