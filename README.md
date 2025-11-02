# AI Healthcare Management System

A comprehensive MERN stack healthcare management system with role-based access control for administrators, doctors, and patients.

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
- **Appointments**: Book, view, and manage medical appointments
- **Medications**: Track current medications and adherence
- **Health Records**: View lab results, vital signs, and medical history
- **Health Tracking**: Record and monitor personal health metrics
- **Settings**: Manage personal information and preferences

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
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

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
│   │   │   └── ...
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
│   └── package.json
├── models/                 # MongoDB models
│   ├── User.js
│   ├── Appointment.js
│   ├── Medication.js
│   ├── HealthRecord.js
│   └── HealthTracking.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── admin.js
│   ├── doctor.js
│   └── patient.js
├── middleware/             # Custom middleware
│   └── auth.js
├── controllers/            # Business logic
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
   git clone <repository-url>
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

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the application**
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

### Appointment Model
- Patient and doctor references
- Scheduling information (date, time, duration)
- Appointment details (type, status, notes)
- Room assignment and follow-up tracking

### Medication Model
- Prescription details (name, dosage, frequency)
- Patient and doctor references
- Adherence tracking
- Reminder settings

### HealthRecord Model
- Various record types (lab results, vital signs, medical history)
- File attachments support
- Privacy settings
- Doctor and patient references

### HealthTracking Model
- Personal health metrics tracking
- Multiple tracking types (blood pressure, weight, etc.)
- Historical data with timestamps
- Status and notes

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
- `PUT /api/auth/change-password` - Change password

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/patients` - Get all patients
- `POST /api/admin/patients` - Create patient
- `PUT /api/admin/patients/:id` - Update patient
- `DELETE /api/admin/patients/:id` - Delete patient
- Similar endpoints for doctors, treatments, and medicines

### Doctor Routes
- `GET /api/doctor/dashboard` - Doctor dashboard
- `GET /api/doctor/patients` - Get assigned patients
- `GET /api/doctor/patients/:id` - Get patient details
- `POST /api/doctor/schedule` - Schedule appointment
- `POST /api/doctor/prescriptions` - Prescribe medication

### Patient Routes
- `GET /api/patient/dashboard` - Patient dashboard
- `GET /api/patient/appointments` - Get appointments
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/medications` - Get medications
- `POST /api/patient/health-tracking` - Record health data

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material Design**: Clean and modern interface
- **Color-coded Status**: Visual indicators for different states
- **Interactive Components**: Modals, forms, and data tables
- **Real-time Updates**: Live data refresh capabilities
- **Accessibility**: ARIA labels and keyboard navigation

## 🔮 Future Enhancements

- **Real-time Notifications**: WebSocket integration
- **File Upload**: Document and image management
- **Email Integration**: Automated notifications
- **AI Features**: Health predictions and recommendations
- **Mobile App**: React Native version
- **Analytics Dashboard**: Advanced reporting
- **Telemedicine**: Video consultation features
- **Integration**: Third-party health devices

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