/**
 * CSV Parser Utility
 * Reads emotion CSV file and converts to usable format
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse CSV file and convert to JSON
 */
function parseCSV(filePath) {
  try {
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }
    
    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
        });
        data.push(row);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
}

/**
 * Parse a CSV line handling quoted values with commas
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current); // Push last value
  
  return values;
}

/**
 * Load emotion CSV data
 */
function loadEmotionData(csvFilePath = 'data/emotions.csv') {
  try {
    const fullPath = path.resolve(process.cwd(), csvFilePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`CSV file not found at ${fullPath}. Using default emotion mapping.`);
      return null;
    }
    
    const data = parseCSV(fullPath);
    console.log(`Loaded ${data.length} emotion records from CSV`);
    
    return data;
  } catch (error) {
    console.error('Error loading emotion CSV:', error);
    return null;
  }
}

/**
 * Convert CSV data to emotion mapping structure
 */
function convertCSVToEmotionMapping(csvData) {
  if (!csvData || csvData.length === 0) {
    return getDefaultEmotionMapping();
  }
  
  const emotionMapping = {};
  
  csvData.forEach(row => {
    // Adapt based on your CSV structure
    // Assuming CSV has columns like: emotion, intensity, symptoms, triggers, etc.
    const emotion = row.emotion || row.Emotion || row.name || '';
    
    if (emotion) {
      emotionMapping[emotion.toLowerCase()] = {
        emotion: emotion.toLowerCase(),
        intensity: parseFloat(row.intensity || row.Intensity || 0),
        symptoms: (row.symptoms || row.Symptoms || '').split(',').map(s => s.trim()).filter(s => s),
        triggers: (row.triggers || row.Triggers || '').split(',').map(t => t.trim()).filter(t => t),
        physicalSigns: (row.physicalSigns || row['Physical Signs'] || '').split(',').map(p => p.trim()).filter(p => p),
        mentalSigns: (row.mentalSigns || row['Mental Signs'] || '').split(',').map(m => m.trim()).filter(m => m),
        oppositeEmotion: (row.oppositeEmotion || row['Opposite Emotion'] || '').toLowerCase(),
        recommendedContent: (row.recommendedContent || row['Recommended Content'] || '').split(',').map(c => c.trim()).filter(c => c),
        category: (row.category || row.Category || 'neutral').toLowerCase(),
        severity: row.severity || row.Severity || 'moderate',
        ...row // Include all other fields
      };
    }
  });
  
  return emotionMapping;
}

/**
 * Default emotion mapping if CSV is not available
 */
function getDefaultEmotionMapping() {
  return {
    happy: {
      emotion: 'happy',
      intensity: 5,
      symptoms: ['joy', 'contentment', 'excitement'],
      oppositeEmotion: 'sad',
      recommendedContent: ['uplifting', 'motivational'],
      category: 'positive'
    },
    sad: {
      emotion: 'sad',
      intensity: 2,
      symptoms: ['sorrow', 'melancholy', 'depression'],
      oppositeEmotion: 'happy',
      recommendedContent: ['uplifting', 'inspiring'],
      category: 'negative'
    },
    anxious: {
      emotion: 'anxious',
      intensity: 3,
      symptoms: ['worry', 'nervousness', 'fear'],
      oppositeEmotion: 'calm',
      recommendedContent: ['calming', 'relaxing'],
      category: 'negative'
    },
    stressed: {
      emotion: 'stressed',
      intensity: 4,
      symptoms: ['tension', 'pressure', 'overwhelm'],
      oppositeEmotion: 'relaxed',
      recommendedContent: ['calming', 'meditation'],
      category: 'negative'
    },
    angry: {
      emotion: 'angry',
      intensity: 4,
      symptoms: ['irritation', 'frustration', 'rage'],
      oppositeEmotion: 'calm',
      recommendedContent: ['calming', 'peaceful'],
      category: 'negative'
    },
    calm: {
      emotion: 'calm',
      intensity: 4,
      symptoms: ['peace', 'serenity', 'tranquility'],
      oppositeEmotion: 'anxious',
      recommendedContent: ['meditation', 'nature'],
      category: 'positive'
    },
    energetic: {
      emotion: 'energetic',
      intensity: 5,
      symptoms: ['vigor', 'enthusiasm', 'vitality'],
      oppositeEmotion: 'tired',
      recommendedContent: ['motivational', 'workout'],
      category: 'positive'
    },
    relaxed: {
      emotion: 'relaxed',
      intensity: 4,
      symptoms: ['comfort', 'ease', 'rest'],
      oppositeEmotion: 'stressed',
      recommendedContent: ['soothing', 'peaceful'],
      category: 'positive'
    },
    neutral: {
      emotion: 'neutral',
      intensity: 3,
      symptoms: ['balance', 'equilibrium'],
      oppositeEmotion: 'excited',
      recommendedContent: ['balanced', 'moderate'],
      category: 'neutral'
    }
  };
}

module.exports = {
  parseCSV,
  loadEmotionData,
  convertCSVToEmotionMapping,
  getDefaultEmotionMapping
};

