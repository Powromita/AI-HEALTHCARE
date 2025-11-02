"""
Emotion Detection ML Model for Healthcare Assessment
This model predicts emotions and genuineness from user responses and behavior
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import json

class EmotionDetectionModel:
    """
    ML Model for emotion detection and genuineness assessment
    """
    
    def __init__(self):
        self.emotion_model = None
        self.genuineness_model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        
    def prepare_features(self, data):
        """
        Prepare features from emotion session data
        
        Features include:
        - Response patterns (pre-assessment)
        - Response times
        - Media watch behavior
        - Response consistency between pre and post
        - Improvement patterns
        """
        features = []
        
        for session in data:
            feature_vector = []
            
            # Pre-assessment response features
            pre_responses = session.get('pre_assessment', {}).get('responses', [])
            feature_vector.append(len(pre_responses))  # Number of responses
            
            # Extract emotion scores from responses
            emotion_scores = {
                'happy': 0, 'sad': 0, 'anxious': 0, 'stressed': 0,
                'angry': 0, 'calm': 0, 'energetic': 0, 'focused': 0,
                'relaxed': 0, 'neutral': 0
            }
            
            for response in pre_responses:
                question = response.get('question', {})
                options = question.get('options', [])
                selected = response.get('selectedOption', '')
                
                for option in options:
                    if option.get('text') == selected:
                        emotion = option.get('emotionMapping', 'neutral')
                        score = option.get('score', 0)
                        weight = question.get('weight', 1)
                        emotion_scores[emotion] += score * weight
            
            # Add emotion score features
            feature_vector.extend([
                emotion_scores['happy'],
                emotion_scores['sad'],
                emotion_scores['anxious'],
                emotion_scores['stressed'],
                emotion_scores['angry'],
                emotion_scores['calm'],
                emotion_scores['energetic'],
                emotion_scores['focused'],
                emotion_scores['relaxed'],
                emotion_scores['neutral']
            ])
            
            # Media watch features
            initial_media = session.get('initial_media', [])
            feature_vector.append(len(initial_media))  # Number of initial media watched
            
            total_watch_duration = sum([m.get('watchedDuration', 0) for m in initial_media])
            avg_completion_rate = np.mean([m.get('completionRate', 0) for m in initial_media]) if initial_media else 0
            feature_vector.append(total_watch_duration)
            feature_vector.append(avg_completion_rate)
            
            # Post-assessment features
            post_responses = session.get('post_assessment', {}).get('responses', [])
            feature_vector.append(len(post_responses))
            
            # Post emotion scores
            post_emotion_scores = {
                'happy': 0, 'sad': 0, 'anxious': 0, 'stressed': 0,
                'angry': 0, 'calm': 0, 'energetic': 0, 'focused': 0,
                'relaxed': 0, 'neutral': 0
            }
            
            for response in post_responses:
                question = response.get('question', {})
                options = question.get('options', [])
                selected = response.get('selectedOption', '')
                
                for option in options:
                    if option.get('text') == selected:
                        emotion = option.get('emotionMapping', 'neutral')
                        score = option.get('score', 0)
                        weight = question.get('weight', 1)
                        post_emotion_scores[emotion] += score * weight
            
            feature_vector.extend([
                post_emotion_scores['happy'],
                post_emotion_scores['sad'],
                post_emotion_scores['anxious'],
                post_emotion_scores['stressed'],
                post_emotion_scores['angry'],
                post_emotion_scores['calm'],
                post_emotion_scores['energetic'],
                post_emotion_scores['focused'],
                post_emotion_scores['relaxed'],
                post_emotion_scores['neutral']
            ])
            
            # Improvement features
            pre_emotion = session.get('pre_assessment', {}).get('assessed_emotion', {}).get('overall', 'neutral')
            post_emotion = session.get('post_assessment', {}).get('assessed_emotion', {}).get('overall', 'neutral')
            improvement = session.get('post_assessment', {}).get('improvement', 'same')
            
            # Encode improvement
            improvement_map = {'improved': 2, 'same': 1, 'worse': 0, 'unclear': 0.5}
            feature_vector.append(improvement_map.get(improvement, 0))
            
            # Response consistency (compare pre and post)
            consistency_score = self._calculate_consistency(pre_responses, post_responses)
            feature_vector.append(consistency_score)
            
            # Session duration
            session_duration = session.get('session_duration', 0)
            feature_vector.append(session_duration)
            
            features.append(feature_vector)
        
        return np.array(features)
    
    def _calculate_consistency(self, pre_responses, post_responses):
        """
        Calculate consistency score between pre and post responses
        """
        if not pre_responses or not post_responses:
            return 0.5
        
        # Simple consistency: check if similar questions have similar answers
        consistency = 0
        count = 0
        
        # This is a simplified version - in practice, you'd match questions better
        min_len = min(len(pre_responses), len(post_responses))
        for i in range(min_len):
            pre_val = pre_responses[i].get('selectedOption', '')
            post_val = post_responses[i].get('selectedOption', '')
            if pre_val == post_val:
                consistency += 1
            count += 1
        
        return consistency / count if count > 0 else 0.5
    
    def prepare_labels(self, data, label_type='emotion'):
        """
        Prepare labels for training
        label_type: 'emotion' or 'genuineness'
        """
        labels = []
        
        for session in data:
            if label_type == 'emotion':
                emotion = session.get('pre_assessment', {}).get('assessed_emotion', {}).get('overall', 'neutral')
                labels.append(emotion)
            elif label_type == 'genuineness':
                is_genuine = session.get('genuineness_assessment', {}).get('is_genuine', True)
                labels.append(1 if is_genuine else 0)
        
        return np.array(labels)
    
    def train_emotion_model(self, X, y):
        """
        Train emotion detection model
        """
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model (using Random Forest - can be changed to other models)
        self.emotion_model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        
        self.emotion_model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.emotion_model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Emotion Model Accuracy: {accuracy:.2f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return accuracy
    
    def train_genuineness_model(self, X, y):
        """
        Train genuineness detection model
        """
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.genuineness_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        
        self.genuineness_model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.genuineness_model.predict(X_test_scaled)
        y_pred_proba = self.genuineness_model.predict_proba(X_test_scaled)[:, 1]
        
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Genuineness Model Accuracy: {accuracy:.2f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return accuracy
    
    def predict_emotion(self, session_data):
        """
        Predict emotion from session data
        """
        if self.emotion_model is None:
            raise ValueError("Model not trained. Call train_emotion_model first.")
        
        features = self.prepare_features([session_data])
        features_scaled = self.scaler.transform(features)
        
        prediction = self.emotion_model.predict(features_scaled)[0]
        probabilities = self.emotion_model.predict_proba(features_scaled)[0]
        
        emotion_probs = dict(zip(self.emotion_model.classes_, probabilities))
        
        return {
            'predicted_emotion': prediction,
            'confidence': float(max(probabilities)),
            'probabilities': emotion_probs
        }
    
    def predict_genuineness(self, session_data):
        """
        Predict genuineness from session data
        """
        if self.genuineness_model is None:
            raise ValueError("Model not trained. Call train_genuineness_model first.")
        
        features = self.prepare_features([session_data])
        features_scaled = self.scaler.transform(features)
        
        prediction = self.genuineness_model.predict(features_scaled)[0]
        probability = self.genuineness_model.predict_proba(features_scaled)[0][1]
        
        return {
            'is_genuine': bool(prediction),
            'genuineness_score': float(probability),
            'confidence': float(abs(probability - 0.5) * 2)  # Confidence from probability
        }
    
    def save_model(self, filepath_prefix='models/emotion_model'):
        """
        Save trained models
        """
        import os
        os.makedirs('models', exist_ok=True)
        
        if self.emotion_model:
            joblib.dump(self.emotion_model, f'{filepath_prefix}_emotion.pkl')
            joblib.dump(self.scaler, f'{filepath_prefix}_scaler_emotion.pkl')
        
        if self.genuineness_model:
            joblib.dump(self.genuineness_model, f'{filepath_prefix}_genuineness.pkl')
            joblib.dump(self.scaler, f'{filepath_prefix}_scaler_genuineness.pkl')
    
    def load_model(self, filepath_prefix='models/emotion_model'):
        """
        Load trained models
        """
        self.emotion_model = joblib.load(f'{filepath_prefix}_emotion.pkl')
        self.scaler = joblib.load(f'{filepath_prefix}_scaler_emotion.pkl')
        
        # Load genuineness model if exists
        try:
            self.genuineness_model = joblib.load(f'{filepath_prefix}_genuineness.pkl')
        except:
            pass


def load_data_from_mongodb(mongo_uri, database_name='ai-healthcare'):
    """
    Load training data from MongoDB
    You'll need to install pymongo: pip install pymongo
    """
    from pymongo import MongoClient
    
    client = MongoClient(mongo_uri)
    db = client[database_name]
    
    # Load completed sessions with genuineness labels
    sessions = list(db.emotionsessions.find({
        'sessionStatus': 'completed',
        'genuinenessAssessment.isGenuine': {'$ne': None}
    }))
    
    # Convert MongoDB documents to dict format
    data = []
    for session in sessions:
        data.append({
            'pre_assessment': session.get('preAssessment', {}),
            'post_assessment': session.get('postAssessment', {}),
            'initial_media': session.get('initialMedia', []),
            'therapeutic_media': session.get('therapeuticMedia', []),
            'genuineness_assessment': session.get('genuinenessAssessment', {}),
            'session_duration': session.get('sessionDuration', 0)
        })
    
    return data


def train_model():
    """
    Main training function
    """
    print("Loading data...")
    
    # Option 1: Load from MongoDB (if you have data in database)
    # mongo_uri = "mongodb://localhost:27017"
    # data = load_data_from_mongodb(mongo_uri)
    
    # Option 2: Load from JSON file (for initial training)
    try:
        with open('training_data.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("No training data found. Please provide training_data.json")
        print("Or load data from MongoDB using load_data_from_mongodb()")
        return
    
    if not data:
        print("No data available for training")
        return
    
    print(f"Loaded {len(data)} sessions")
    
    # Initialize model
    model = EmotionDetectionModel()
    
    # Prepare features
    print("Preparing features...")
    X = model.prepare_features(data)
    
    # Train emotion model
    print("\nTraining emotion detection model...")
    y_emotion = model.prepare_labels(data, label_type='emotion')
    model.train_emotion_model(X, y_emotion)
    
    # Train genuineness model
    print("\nTraining genuineness detection model...")
    y_genuineness = model.prepare_labels(data, label_type='genuineness')
    model.train_genuineness_model(X, y_genuineness)
    
    # Save models
    print("\nSaving models...")
    model.save_model()
    print("Models saved successfully!")
    
    return model


if __name__ == '__main__':
    # Train the models
    model = train_model()

