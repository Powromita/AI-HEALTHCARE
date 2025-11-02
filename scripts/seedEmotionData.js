/**
 * Seed script for Emotion Assessment System
 * Run: node scripts/seedEmotionData.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MediaContent = require('../models/MediaContent');
const EmotionQuestion = require('../models/EmotionQuestion');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-healthcare';

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await MediaContent.deleteMany({});
    // await EmotionQuestion.deleteMany({});
    // console.log('Cleared existing data');

    // Seed Media Content
    console.log('Seeding Media Content...');
    
    const initialMedia = [
      {
        title: "Calming Nature Sounds",
        description: "Relaxing audio with nature sounds to start your assessment",
        mediaType: "audio",
        fileUrl: "https://example.com/media/calming-nature.mp3",
        duration: 120,
        targetEmotion: "calm",
        emotionCategory: "positive",
        contentType: "initial",
        tags: ["nature", "calming", "relaxation"],
        isActive: true
      },
      {
        title: "Morning Motivation Video",
        description: "Uplifting video to begin your day positively",
        mediaType: "video",
        fileUrl: "https://example.com/media/morning-motivation.mp4",
        thumbnailUrl: "https://example.com/media/morning-motivation-thumb.jpg",
        duration: 180,
        targetEmotion: "energetic",
        emotionCategory: "positive",
        contentType: "initial",
        tags: ["motivation", "energy", "morning"],
        isActive: true
      },
      {
        title: "Peaceful Meditation Audio",
        description: "Guided meditation for inner peace",
        mediaType: "audio",
        fileUrl: "https://example.com/media/peaceful-meditation.mp3",
        duration: 300,
        targetEmotion: "relaxed",
        emotionCategory: "positive",
        contentType: "initial",
        tags: ["meditation", "peace", "relaxation"],
        isActive: true
      }
    ];

    const therapeuticMedia = [
      {
        title: "Happy Uplifting Video",
        description: "Designed to improve mood and bring joy",
        mediaType: "video",
        fileUrl: "https://example.com/media/happy-video.mp4",
        thumbnailUrl: "https://example.com/media/happy-video-thumb.jpg",
        duration: 240,
        targetEmotion: "happy",
        emotionCategory: "positive",
        contentType: "therapeutic",
        tags: ["happiness", "joy", "uplifting"],
        isActive: true
      },
      {
        title: "Calm and Peaceful Audio",
        description: "Therapeutic audio for anxiety and stress relief",
        mediaType: "audio",
        fileUrl: "https://example.com/media/calm-therapeutic.mp3",
        duration: 360,
        targetEmotion: "calm",
        emotionCategory: "positive",
        contentType: "therapeutic",
        tags: ["calm", "anxiety", "stress-relief"],
        isActive: true
      },
      {
        title: "Energizing Workout Video",
        description: "Boost your energy and motivation",
        mediaType: "video",
        fileUrl: "https://example.com/media/energizing-workout.mp4",
        thumbnailUrl: "https://example.com/media/energizing-workout-thumb.jpg",
        duration: 200,
        targetEmotion: "energetic",
        emotionCategory: "positive",
        contentType: "therapeutic",
        tags: ["energy", "workout", "motivation"],
        isActive: true
      },
      {
        title: "Deep Relaxation Audio",
        description: "For stress and anger management",
        mediaType: "audio",
        fileUrl: "https://example.com/media/deep-relaxation.mp3",
        duration: 420,
        targetEmotion: "relaxed",
        emotionCategory: "positive",
        contentType: "therapeutic",
        tags: ["relaxation", "stress", "anger"],
        isActive: true
      }
    ];

    for (const media of [...initialMedia, ...therapeuticMedia]) {
      const existing = await MediaContent.findOne({ title: media.title });
      if (!existing) {
        await MediaContent.create(media);
        console.log(`Created media: ${media.title}`);
      } else {
        console.log(`Media already exists: ${media.title}`);
      }
    }

    // Seed Assessment Questions
    console.log('\nSeeding Assessment Questions...');

    const preQuestions = [
      {
        questionText: "How are you feeling right now emotionally?",
        questionType: "mental",
        questionStage: "pre",
        options: [
          { text: "Very Happy", emotionMapping: "happy", score: 5 },
          { text: "Happy", emotionMapping: "happy", score: 4 },
          { text: "Neutral", emotionMapping: "neutral", score: 3 },
          { text: "Sad", emotionMapping: "sad", score: 2 },
          { text: "Very Sad", emotionMapping: "sad", score: 1 }
        ],
        category: "mood",
        order: 1,
        weight: 2,
        isRequired: true,
        isActive: true
      },
      {
        questionText: "How would you describe your stress level?",
        questionType: "mental",
        questionStage: "pre",
        options: [
          { text: "Very Calm", emotionMapping: "calm", score: 5 },
          { text: "Calm", emotionMapping: "calm", score: 4 },
          { text: "Moderate", emotionMapping: "neutral", score: 3 },
          { text: "Stressed", emotionMapping: "stressed", score: 2 },
          { text: "Very Stressed", emotionMapping: "stressed", score: 1 }
        ],
        category: "stress",
        order: 2,
        weight: 2,
        isRequired: true,
        isActive: true
      },
      {
        questionText: "How is your energy level today?",
        questionType: "physical",
        questionStage: "pre",
        options: [
          { text: "Very Energetic", emotionMapping: "energetic", score: 5 },
          { text: "Energetic", emotionMapping: "energetic", score: 4 },
          { text: "Normal", emotionMapping: "neutral", score: 3 },
          { text: "Tired", emotionMapping: "sad", score: 2 },
          { text: "Very Tired", emotionMapping: "sad", score: 1 }
        ],
        category: "energy",
        order: 3,
        weight: 1.5,
        isRequired: true,
        isActive: true
      },
      {
        questionText: "Are you feeling anxious or worried?",
        questionType: "mental",
        questionStage: "pre",
        options: [
          { text: "Not at all", emotionMapping: "calm", score: 5 },
          { text: "Slightly", emotionMapping: "neutral", score: 4 },
          { text: "Moderately", emotionMapping: "anxious", score: 3 },
          { text: "Very much", emotionMapping: "anxious", score: 2 },
          { text: "Extremely", emotionMapping: "anxious", score: 1 }
        ],
        category: "stress",
        order: 4,
        weight: 2,
        isRequired: true,
        isActive: true
      },
      {
        questionText: "How well did you sleep last night?",
        questionType: "physical",
        questionStage: "pre",
        options: [
          { text: "Very Well", emotionMapping: "relaxed", score: 5 },
          { text: "Well", emotionMapping: "calm", score: 4 },
          { text: "Okay", emotionMapping: "neutral", score: 3 },
          { text: "Poorly", emotionMapping: "stressed", score: 2 },
          { text: "Very Poorly", emotionMapping: "stressed", score: 1 }
        ],
        category: "sleep",
        order: 5,
        weight: 1.5,
        isRequired: true,
        isActive: true
      }
    ];

    const postQuestions = [
      {
        questionText: "How are you feeling now after watching the content?",
        questionType: "mental",
        questionStage: "post",
        options: [
          { text: "Much Better", emotionMapping: "happy", score: 5 },
          { text: "Better", emotionMapping: "happy", score: 4 },
          { text: "Same", emotionMapping: "neutral", score: 3 },
          { text: "Worse", emotionMapping: "sad", score: 2 },
          { text: "Much Worse", emotionMapping: "sad", score: 1 }
        ],
        category: "mood",
        order: 1,
        weight: 2,
        isRequired: true,
        isActive: true
      },
      {
        questionText: "Has your stress level changed?",
        questionType: "mental",
        questionStage: "post",
        options: [
          { text: "Much More Calm", emotionMapping: "calm", score: 5 },
          { text: "More Calm", emotionMapping: "calm", score: 4 },
          { text: "Same", emotionMapping: "neutral", score: 3 },
          { text: "More Stressed", emotionMapping: "stressed", score: 2 },
          { text: "Much More Stressed", emotionMapping: "stressed", score: 1 }
        ],
        category: "stress",
        order: 2,
        weight: 2,
        isRequired: true,
        isActive: true
      },
      {
        questionText: "How would you rate your current emotional state?",
        questionType: "mental",
        questionStage: "post",
        options: [
          { text: "Excellent", emotionMapping: "happy", score: 5 },
          { text: "Good", emotionMapping: "happy", score: 4 },
          { text: "Okay", emotionMapping: "neutral", score: 3 },
          { text: "Poor", emotionMapping: "sad", score: 2 },
          { text: "Very Poor", emotionMapping: "sad", score: 1 }
        ],
        category: "mood",
        order: 3,
        weight: 2,
        isRequired: true,
        isActive: true
      },
      {
        questionText: "Did the content help you feel better?",
        questionType: "combined",
        questionStage: "post",
        options: [
          { text: "Yes, significantly", emotionMapping: "happy", score: 5 },
          { text: "Yes, somewhat", emotionMapping: "happy", score: 4 },
          { text: "Not really", emotionMapping: "neutral", score: 3 },
          { text: "No, I feel worse", emotionMapping: "sad", score: 2 }
        ],
        category: "mood",
        order: 4,
        weight: 2.5,
        isRequired: true,
        isActive: true
      },
      {
        questionText: "How is your energy level now?",
        questionType: "physical",
        questionStage: "post",
        options: [
          { text: "Much More Energetic", emotionMapping: "energetic", score: 5 },
          { text: "More Energetic", emotionMapping: "energetic", score: 4 },
          { text: "Same", emotionMapping: "neutral", score: 3 },
          { text: "Less Energetic", emotionMapping: "sad", score: 2 },
          { text: "Much Less Energetic", emotionMapping: "sad", score: 1 }
        ],
        category: "energy",
        order: 5,
        weight: 1.5,
        isRequired: true,
        isActive: true
      }
    ];

    for (const question of [...preQuestions, ...postQuestions]) {
      const existing = await EmotionQuestion.findOne({ 
        questionText: question.questionText,
        questionStage: question.questionStage
      });
      if (!existing) {
        await EmotionQuestion.create(question);
        console.log(`Created question: ${question.questionText.substring(0, 50)}...`);
      } else {
        console.log(`Question already exists: ${question.questionText.substring(0, 50)}...`);
      }
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`- Media Content: ${await MediaContent.countDocuments()}`);
    console.log(`- Assessment Questions: ${await EmotionQuestion.countDocuments()}`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the seeding script
seedData();

