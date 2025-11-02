# AI Healthcare Management System

A comprehensive MERN stack healthcare management system with role-based access control for administrators, doctors, and patients. Includes an advanced **emotion assessment system** with recommendation-based ML.

## 🎨 Design System

This project uses the **Blue Jungle** color palette:
- **Primary Dark Blue**: `#011D4D` - Main brand color
- **Medium Blue**: `#034078` - Secondary actions
- **Teal Blue**: `#1282A2` - Accent color
- **Light Off-White**: `#E4DFDA` - Background
- **Brown**: `#63372C` - Patient theme accent

## 🚀 Features

### 🔐 Authentication System
- Role-based login/signup (Admin, Doctor, Patient)
- JWT-based authentication
- Secure password hashing
- Session management

### 👨‍💼 Admin Dashboard
- **Overview**: System statistics and health monitoring
- **Patient Management**: Add, edit, delete, and view patient records
- **Doctor Management**: Manage doctor profiles and specializations
- **Treatment Scheduling**: Schedule and manage medical treatments
- **Medicine Scheduling**: Prescribe and track medications
- **System Settings**: Configure system-wide settings and user management

### 👩‍⚕️ Doctor Dashboard
- **Patient Overview**: View assigned patients and their health status
- **Patient Management**: Detailed patient profiles with medical history
- **Schedule Management**: Manage appointments and availability
- **Prescription Management**: Prescribe medications and track adherence
- **Health Records**: Add and manage patient health records
- **Reports**: Generate patient and performance reports

### 🏥 Patient Dashboard
- **Health Overview**: Personal health statistics and recent activity
- **Emotion Assessment**: Video/audio-based emotion assessment with ML recommendations
- **Appointments**: Book, view, and manage medical appointments
- **Medications**: Track current medications and adherence
- **Health Records**: View lab results, vital signs, and medical history
- **Health Tracking**: Record and monitor personal health metrics
- **Settings**: Manage personal information and preferences

### 🧠 Emotion Assessment System (NEW)
- **Video/Audio Based**: Uses media consumption to understand emotional state
- **ML-Powered Recommendations**: Recommendation-based system using CSV emotion data
- **Question-Based Assessment**: Pre and post-assessment questions
- **Therapeutic Media**: Shows opposite emotion content based on diagnosis
- **Genuineness Detection**: ML-based authenticity assessment
- **No External APIs**: All processing done locally using MongoDB and CSV data

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### ML System
- **Recommendation Engine** - Content-based filtering for media recommendations
- **CSV Data Integration** - Emotion data from CSV file
- **Python ML Models** - Emotion detection and genuineness assessment (optional)

## 📁 Project Structure

```
AI-HEALTHCARE/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── admin/      # Admin-specific components
│   │   │   ├── doctor/     # Doctor-specific components
│   │   │   ├── patient/    # Patient-specific components
│   │   │   │   └── EmotionAssessment.js  # Emotion assessment UI
│   │   │   └── ...
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
│   └── package.json
├── models/                 # MongoDB models
│   ├── User.js
│   ├── Appointment.js
│   ├── Medication.js
│   ├── HealthRecord.js
│   ├── HealthTracking.js
│   ├── MediaContent.js    # Video/audio content
│   ├── EmotionQuestion.js  # Assessment questions
│   └── EmotionSession.js   # Assessment sessions
├── controllers/            # Business logic
│   └── emotionController.js  # Emotion assessment logic
├── routes/                 # API routes
│   ├── auth.js
│   ├── admin.js
│   ├── doctor.js
│   ├── patient.js
│   └── emotion.js         # Emotion assessment API
├── utils/                  # Utility functions
│   ├── csvParser.js       # CSV data parser
│   └── recommendationEngine.js  # ML recommendation engine
├── ml-model/              # ML model structure
│   ├── emotion_detection_model.py
│   ├── ML_TRAINING_GUIDE.md
│   └── requirements.txt
├── data/                   # Emotion data
│   ├── emotions.csv       # CSV file (add your data here)
│   └── README.md
├── scripts/               # Utility scripts
│   └── seedEmotionData.js  # Seed initial data
├── middleware/             # Custom middleware
│   └── auth.js
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Powromita/AI-HEALTHCARE.git
   cd AI-HEALTHCARE
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp config.env .env
   # Edit .env with your configuration
   ```

5. **Add emotion CSV data** (Optional)
   ```bash
   # Place your emotions.csv file in the data/ directory
   # See data/README.md for format
   ```

6. **Seed initial data** (Optional)
   ```bash
   node scripts/seedEmotionData.js
   ```

7. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

8. **Run the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately:
   # Server only
   npm run server
   
   # Client only (in another terminal)
   npm run client
   ```

### Default Login Credentials

For testing purposes, you can use these mock credentials:

- **Admin**: `admin@healthcare.com` / `password123`
- **Doctor**: `doctor@healthcare.com` / `password123`
- **Patient**: `patient@healthcare.com` / `password123`

## 📊 Database Models

### User Model
- Personal information (name, email, phone, address)
- Role-based fields (specialization for doctors)
- Medical information (blood type, allergies, emergency contact)
- Authentication fields (password, last login)

### Emotion Assessment Models (NEW)

#### MediaContent
- Stores videos and audios with emotion tags
- Content types: initial (shown first) or therapeutic (recommended)
- Emotion categories: positive, negative, neutral
- Effectiveness tracking

#### EmotionQuestion
- Pre and post-assessment questions
- Question types: mental, physical, combined
- Emotion mapping for response options
- Weighted scoring for ML

#### EmotionSession
- Complete assessment session tracking
- Pre and post-assessment responses
- ML-based emotion diagnosis
- Genuineness assessment
- Improvement tracking

### Other Models
- **Appointment**: Patient and doctor references, scheduling
- **Medication**: Prescription details, adherence tracking
- **HealthRecord**: Lab results, vital signs, medical history
- **HealthTracking**: Personal health metrics tracking

## 🧠 Emotion Assessment System

### How It Works

1. **Initial Media**: User watches recommended videos/audios
2. **Pre-Assessment**: Answers questions about current emotional/physical state
3. **ML Diagnosis**: System diagnoses emotion using:
   - Question responses
   - Media watch behavior
   - CSV emotion data
4. **Therapeutic Media**: System recommends opposite emotion content
5. **Post-Assessment**: User answers questions again
6. **Genuineness Assessment**: ML evaluates response authenticity

### CSV Data Format

Place your `emotions.csv` file in the `data/` directory. See `data/README.md` for complete format.

Required: `emotion`  
Optional: `intensity`, `symptoms`, `oppositeEmotion`, `recommendedContent`, `category`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Protected API routes
- CORS configuration

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Emotion Assessment (NEW)
- `POST /api/emotion/session/start` - Start new assessment session
- `GET /api/emotion/media/initial` - Get initial media recommendations
- `POST /api/emotion/session/record-initial-media` - Record media watch
- `GET /api/emotion/questions/pre` - Get pre-assessment questions
- `POST /api/emotion/assessment/pre` - Submit pre-assessment & get therapeutic media
- `POST /api/emotion/session/record-therapeutic-media` - Record therapeutic media
- `GET /api/emotion/questions/post` - Get post-assessment questions
- `POST /api/emotion/assessment/post` - Submit post-assessment & get results
- `GET /api/emotion/sessions/history` - Get session history

### Other Endpoints
- Admin, Doctor, and Patient routes (see full documentation)

## 📚 Documentation

- **SETUP_INSTRUCTIONS.md** - Complete setup guide
- **CSV_INTEGRATION_GUIDE.md** - CSV integration and ML system guide
- **RECOMMENDATION_SYSTEM_SUMMARY.md** - Recommendation engine documentation
- **EMOTION_ASSESSMENT_SUMMARY.md** - Emotion assessment system overview
- **ml-model/ML_TRAINING_GUIDE.md** - ML model training guide
- **data/README.md** - CSV file format guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@aihealthcare.com or create an issue in the repository.

## 🙏 Acknowledgments

- Material-UI for the component library
- React team for the amazing framework
- MongoDB for the database solution
- All contributors and testers

---

**Note**: This is a demo project for educational purposes. For production use, ensure proper security measures, data validation, and compliance with healthcare regulations (HIPAA, etc.).
