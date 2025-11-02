# Emotion Data Directory

Place your `emotions.csv` file in this directory.

## CSV File Format

The CSV file should have the following columns (column names are case-insensitive):

### Required Columns:
- **emotion** or **Emotion** or **name**: The name of the emotion (e.g., "happy", "sad", "anxious")

### Optional Columns:
- **intensity** or **Intensity**: Numeric value 1-5
- **symptoms** or **Symptoms**: Comma-separated list of symptoms
- **triggers** or **Triggers**: Comma-separated list of triggers
- **physicalSigns** or **Physical Signs**: Comma-separated physical signs
- **mentalSigns** or **Mental Signs**: Comma-separated mental signs
- **oppositeEmotion** or **Opposite Emotion**: The opposite emotion (e.g., "happy" for "sad")
- **recommendedContent** or **Recommended Content**: Comma-separated tags for recommended media
- **category** or **Category**: "positive", "negative", or "neutral"
- **severity** or **Severity**: "mild", "moderate", or "severe"

## Example CSV Format

```csv
emotion,intensity,symptoms,oppositeEmotion,recommendedContent,category
happy,5,"joy,contentment,excitement",sad,"uplifting,motivational",positive
sad,2,"sorrow,melancholy,depression",happy,"uplifting,inspiring",negative
anxious,3,"worry,nervousness,fear",calm,"calming,relaxing",negative
stressed,4,"tension,pressure,overwhelm",relaxed,"calming,meditation",negative
calm,4,"peace,serenity,tranquility",anxious,"meditation,nature",positive
```

## File Location

Place your file as: `data/emotions.csv`

The system will automatically load this file on startup. If the file is not found, it will use default emotion mappings.

