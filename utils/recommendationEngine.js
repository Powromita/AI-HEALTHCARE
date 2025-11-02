/**
 * Recommendation-Based ML Engine
 * Uses collaborative filtering and content-based recommendation
 * No external APIs - all processing done locally
 */

/**
 * Content-Based Recommendation Engine
 */
class RecommendationEngine {
  constructor(emotionData, mediaContent = []) {
    this.emotionData = emotionData || {};
    this.mediaContent = mediaContent;
    this.userHistory = []; // Store user interaction history
  }

  /**
   * Recommend media based on detected emotion
   */
  recommendMedia(detectedEmotion, userHistory = [], excludedMediaIds = []) {
    const emotionInfo = this.emotionData[detectedEmotion] || this.emotionData['neutral'];
    
    if (!emotionInfo) {
      return this.getRandomMedia(excludedMediaIds);
    }

    const oppositeEmotion = emotionInfo.oppositeEmotion || this.getOppositeEmotion(detectedEmotion);
    const recommendedTags = emotionInfo.recommendedContent || [];
    
    // Filter out excluded media
    let availableMedia = this.mediaContent.filter(m => 
      !excludedMediaIds.includes(m._id?.toString())
    );

    // Score media based on multiple factors
    const scoredMedia = availableMedia.map(media => {
      let score = 0;
      
      // Factor 1: Match target emotion (highest priority)
      if (media.targetEmotion === oppositeEmotion) {
        score += 50;
      }
      
      // Factor 2: Match recommended content tags
      if (media.tags && recommendedTags.length > 0) {
        const matchingTags = media.tags.filter(tag => 
          recommendedTags.some(rt => tag.toLowerCase().includes(rt.toLowerCase()))
        );
        score += matchingTags.length * 10;
      }
      
      // Factor 3: Category match
      if (media.emotionCategory === emotionInfo.category) {
        score += 15;
      }
      
      // Factor 4: Effectiveness score (if available)
      if (media.effectivenessScore) {
        score += media.effectivenessScore * 2;
      }
      
      // Factor 5: Usage count (prefer less used for diversity)
      score += (100 - Math.min(media.usageCount || 0, 100)) * 0.1;
      
      // Factor 6: Duration preference (prefer shorter for initial engagement)
      if (media.duration <= 180) {
        score += 5;
      }
      
      return {
        media,
        score
      };
    });

    // Sort by score and return top recommendations
    return scoredMedia
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.media);
  }

  /**
   * Collaborative filtering - recommend based on similar users
   */
  collaborativeRecommend(userId, userHistory, allSessions = []) {
    // Find users with similar emotion patterns
    const similarUsers = this.findSimilarUsers(userId, userHistory, allSessions);
    
    // Get media liked by similar users
    const recommendedMediaIds = new Set();
    
    similarUsers.forEach(similarUser => {
      similarUser.effectiveMedia?.forEach(mediaId => {
        recommendedMediaIds.add(mediaId);
      });
    });
    
    return Array.from(recommendedMediaIds).slice(0, 5);
  }

  /**
   * Find users with similar emotion patterns
   */
  findSimilarUsers(userId, userHistory, allSessions) {
    // Calculate user emotion profile
    const userEmotionProfile = this.calculateEmotionProfile(userHistory);
    
    // Calculate profiles for all other users
    const otherUsers = [];
    
    allSessions.forEach(session => {
      if (session.patient?.toString() !== userId?.toString()) {
        const profile = this.calculateEmotionProfile([{
          preAssessment: session.preAssessment,
          postAssessment: session.postAssessment
        }]);
        
        const similarity = this.calculateSimilarity(userEmotionProfile, profile);
        
        if (similarity > 0.5) {
          otherUsers.push({
            userId: session.patient,
            profile,
            similarity,
            effectiveMedia: this.getEffectiveMediaForSession(session)
          });
        }
      }
    });
    
    return otherUsers.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
  }

  /**
   * Calculate emotion profile from user history
   */
  calculateEmotionProfile(userHistory) {
    const profile = {
      emotions: {},
      averageIntensity: 0,
      commonEmotions: [],
      improvementPattern: []
    };
    
    userHistory.forEach(session => {
      const preEmotion = session.preAssessment?.assessedEmotion?.overall || 'neutral';
      const postEmotion = session.postAssessment?.assessedEmotion?.overall || 'neutral';
      const improvement = session.postAssessment?.improvement || 'same';
      
      profile.emotions[preEmotion] = (profile.emotions[preEmotion] || 0) + 1;
      profile.improvementPattern.push(improvement);
    });
    
    // Calculate most common emotions
    profile.commonEmotions = Object.entries(profile.emotions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion]) => emotion);
    
    return profile;
  }

  /**
   * Calculate similarity between two emotion profiles
   */
  calculateSimilarity(profile1, profile2) {
    // Jaccard similarity for common emotions
    const emotions1 = new Set(profile1.commonEmotions);
    const emotions2 = new Set(profile2.commonEmotions);
    
    const intersection = new Set([...emotions1].filter(e => emotions2.has(e)));
    const union = new Set([...emotions1, ...emotions2]);
    
    const jaccard = intersection.size / union.size;
    
    // Improvement pattern similarity
    const improvements1 = profile1.improvementPattern || [];
    const improvements2 = profile2.improvementPattern || [];
    
    let improvementSimilarity = 0;
    const minLength = Math.min(improvements1.length, improvements2.length);
    if (minLength > 0) {
      let matches = 0;
      for (let i = 0; i < minLength; i++) {
        if (improvements1[i] === improvements2[i]) matches++;
      }
      improvementSimilarity = matches / minLength;
    }
    
    // Combined similarity
    return (jaccard * 0.6 + improvementSimilarity * 0.4);
  }

  /**
   * Get effective media for a session
   */
  getEffectiveMediaForSession(session) {
    const effectiveMedia = [];
    
    if (session.postAssessment?.improvement === 'improved') {
      session.therapeuticMedia?.forEach(media => {
        if (media.media) {
          effectiveMedia.push(media.media.toString());
        }
      });
    }
    
    return effectiveMedia;
  }

  /**
   * Get opposite emotion
   */
  getOppositeEmotion(emotion) {
    const opposites = {
      'sad': 'happy',
      'anxious': 'calm',
      'stressed': 'relaxed',
      'angry': 'calm',
      'happy': 'calm',
      'neutral': 'happy',
      'tired': 'energetic',
      'energetic': 'relaxed'
    };
    
    return opposites[emotion] || 'calm';
  }

  /**
   * Get random media as fallback
   */
  getRandomMedia(excludedMediaIds = []) {
    const available = this.mediaContent.filter(m => 
      !excludedMediaIds.includes(m._id?.toString()) && m.isActive
    );
    
    return available.slice(0, 3);
  }

  /**
   * Diagnose user emotion from responses and media behavior
   */
  diagnoseEmotion(questionResponses, mediaBehavior = {}) {
    // Calculate emotion scores from responses
    const emotionScores = {};
    
    questionResponses.forEach(response => {
      const question = response.question;
      const selectedOption = response.selectedOption;
      
      if (question && question.options) {
        const option = question.options.find(o => o.text === selectedOption);
        if (option && option.emotionMapping) {
          const emotion = option.emotionMapping.toLowerCase();
          const score = (option.score || 1) * (question.weight || 1);
          emotionScores[emotion] = (emotionScores[emotion] || 0) + score;
        }
      }
    });
    
    // Factor in media behavior
    if (mediaBehavior.watchedDuration && mediaBehavior.watchedDuration > 0) {
      // Longer watch time might indicate engagement with certain emotions
      const avgDuration = mediaBehavior.totalDuration / mediaBehavior.mediaCount;
      if (avgDuration > 120) {
        // User watched longer - might indicate they're trying to improve negative emotions
        Object.keys(emotionScores).forEach(emotion => {
          if (['sad', 'anxious', 'stressed', 'angry'].includes(emotion)) {
            emotionScores[emotion] *= 1.2; // Increase weight
          }
        });
      }
    }
    
    // Determine primary emotion
    const sortedEmotions = Object.entries(emotionScores)
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedEmotions.length === 0) {
      return { emotion: 'neutral', confidence: 0.5 };
    }
    
    const primaryEmotion = sortedEmotions[0][0];
    const primaryScore = sortedEmotions[0][1];
    const totalScore = Object.values(emotionScores).reduce((a, b) => a + b, 0);
    
    const confidence = totalScore > 0 ? Math.min(1, primaryScore / totalScore) : 0.5;
    
    // Get emotion details
    const emotionInfo = this.emotionData[primaryEmotion] || {};
    
    return {
      emotion: primaryEmotion,
      confidence,
      intensity: emotionInfo.intensity || this.calculateIntensity(emotionScores),
      symptoms: emotionInfo.symptoms || [],
      physicalSigns: emotionInfo.physicalSigns || [],
      mentalSigns: emotionInfo.mentalSigns || [],
      allScores: emotionScores
    };
  }

  /**
   * Calculate emotion intensity
   */
  calculateIntensity(emotionScores) {
    const maxScore = Math.max(...Object.values(emotionScores));
    const totalScore = Object.values(emotionScores).reduce((a, b) => a + b, 1);
    
    // Normalize to 1-5 scale
    return Math.round((maxScore / totalScore) * 5);
  }

  /**
   * Assess genuineness from session data
   */
  assessGenuineness(session) {
    let genuinenessScore = 0.5; // Base score
    const factors = [];
    
    // Factor 1: Response consistency
    const consistency = this.calculateResponseConsistency(
      session.preAssessment?.responses || [],
      session.postAssessment?.responses || []
    );
    genuinenessScore += consistency * 0.2;
    factors.push({ name: 'Response Consistency', score: consistency });
    
    // Factor 2: Improvement alignment
    const preEmotion = session.preAssessment?.assessedEmotion?.overall || 'neutral';
    const postEmotion = session.postAssessment?.assessedEmotion?.overall || 'neutral';
    const improvement = session.postAssessment?.improvement || 'same';
    
    const expectedImprovement = this.getExpectedImprovement(preEmotion);
    const actualImprovement = improvement === 'improved';
    
    if (expectedImprovement && actualImprovement) {
      genuinenessScore += 0.2;
      factors.push({ name: 'Improvement Alignment', score: 0.9 });
    } else if (preEmotion === 'neutral' && improvement === 'same') {
      genuinenessScore += 0.1;
      factors.push({ name: 'Improvement Alignment', score: 0.7 });
    } else {
      factors.push({ name: 'Improvement Alignment', score: 0.5 });
    }
    
    // Factor 3: Media watch behavior
    const mediaBehavior = this.analyzeMediaBehavior(session);
    genuinenessScore += mediaBehavior.score * 0.15;
    factors.push({ name: 'Media Engagement', score: mediaBehavior.score });
    
    // Factor 4: Session duration reasonableness
    const duration = session.sessionDuration || 0;
    if (duration >= 300 && duration <= 1800) { // 5-30 minutes is reasonable
      genuinenessScore += 0.1;
      factors.push({ name: 'Session Duration', score: 0.8 });
    } else {
      factors.push({ name: 'Session Duration', score: 0.5 });
    }
    
    // Factor 5: Therapeutic media engagement
    if (session.therapeuticMedia && session.therapeuticMedia.length > 0) {
      const avgCompletion = session.therapeuticMedia.reduce((sum, m) => 
        sum + (m.completionRate || 0), 0) / session.therapeuticMedia.length;
      
      if (avgCompletion > 80) {
        genuinenessScore += 0.1;
        factors.push({ name: 'Therapeutic Engagement', score: 0.9 });
      } else {
        factors.push({ name: 'Therapeutic Engagement', score: avgCompletion / 100 });
      }
    }
    
    genuinenessScore = Math.min(1, Math.max(0, genuinenessScore));
    
    return {
      score: genuinenessScore,
      isGenuine: genuinenessScore >= 0.6,
      factors,
      confidence: Math.abs(genuinenessScore - 0.5) * 2 // Distance from neutral
    };
  }

  /**
   * Calculate response consistency
   */
  calculateResponseConsistency(preResponses, postResponses) {
    if (!preResponses || !postResponses || preResponses.length === 0) {
      return 0.5;
    }
    
    // Match questions and compare answers
    let consistency = 0;
    let count = 0;
    
    preResponses.forEach(preResp => {
      const postResp = postResponses.find(p => 
        p.question?.toString() === preResp.question?.toString()
      );
      
      if (postResp) {
        count++;
        // For consistency, we expect SOME change but not too much
        // Too similar = suspicious, too different = also suspicious
        if (preResp.selectedOption === postResp.selectedOption) {
          consistency += 0.3; // Some consistency is good
        } else {
          // Check if change is reasonable (neighboring options)
          consistency += 0.7; // Change is expected after therapeutic media
        }
      }
    });
    
    return count > 0 ? consistency / count : 0.5;
  }

  /**
   * Get expected improvement based on emotion
   */
  getExpectedImprovement(emotion) {
    const negativeEmotions = ['sad', 'anxious', 'stressed', 'angry', 'tired'];
    return negativeEmotions.includes(emotion.toLowerCase());
  }

  /**
   * Analyze media watch behavior
   */
  analyzeMediaBehavior(session) {
    const initialMedia = session.initialMedia || [];
    const therapeuticMedia = session.therapeuticMedia || [];
    
    const allMedia = [...initialMedia, ...therapeuticMedia];
    
    if (allMedia.length === 0) {
      return { score: 0.3, reason: 'No media watched' };
    }
    
    const avgCompletion = allMedia.reduce((sum, m) => 
      sum + (m.completionRate || 0), 0) / allMedia.length;
    
    const avgDuration = allMedia.reduce((sum, m) => 
      sum + (m.watchedDuration || 0), 0) / allMedia.length;
    
    let score = 0.5;
    
    // Higher completion is better
    if (avgCompletion > 80) {
      score += 0.3;
    } else if (avgCompletion > 50) {
      score += 0.15;
    }
    
    // Reasonable duration (not too short, not suspiciously long)
    if (avgDuration >= 30 && avgDuration <= 600) {
      score += 0.2;
    }
    
    return {
      score: Math.min(1, score),
      avgCompletion,
      avgDuration,
      mediaCount: allMedia.length
    };
  }
}

module.exports = RecommendationEngine;

