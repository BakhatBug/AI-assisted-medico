# AI-Assisted Medico

A full-stack health and fitness application that uses AI to provide personalized diet plans. The system analyzes full-body photos using computer vision and generates custom meal plans using Google's Gemini AI.

## 🚀 Features

- **User Authentication** - Secure login/registration with JWT tokens
- **Health Profile Management** - Track weight, height, BMI, BMR, and daily calorie needs
- **AI-Powered Diet Plans** - Generate 7-day personalized meal plans using Gemini AI
- **Computer Vision Validation** - Real-time validation of body position using YOLOv8 pose detection
- **Gamification** - XP system, levels, and daily login streaks
- **Progress Tracking** - Historical data with visual insights

## 🏗️ Architecture

The application consists of three independent microservices:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   FRONTEND      │────────▶│    BACKEND      │────────▶│   AI SERVICE    │
│   (React)       │         │   (Node.js)     │         │   (Python)      │
│   Port: 5173    │         │   Port: 4000    │         │   Port: 5000    │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       │                            │                            │
       │                            │                            │
       │                            ▼                            ▼
       │                    ┌──────────────┐           ┌──────────────┐
       │                    │   MongoDB    │           │  Gemini AI   │
       │                    │   Database   │           │  YOLOv8 Model│
       │                    └──────────────┘           └──────────────┘
       │
       └────────────────▶ Direct API calls for Vision
```

### Service Communication:
- **Frontend → Backend**: User auth, profile CRUD, save diet plans
- **Frontend → AI Service**: Direct calls for image validation & plan generation
- **Backend → MongoDB**: Store user data, profiles, plans
- **AI Service → Gemini**: Generate personalized diet plans
- **AI Service → YOLOv8**: Validate body posture in images

## 🛠️ Technology Stack

### Frontend (React + TypeScript)
- **React 19** - UI Framework
- **TypeScript** - Type safety
- **React Router DOM** - Navigation
- **Axios** - HTTP requests
- **Tailwind CSS** - Styling
- **React Webcam** - Camera access
- **Vite** - Build tool

### Backend (Node.js + TypeScript)
- **Express** - Web framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **TypeScript** - Type safety

### AI Service (Python)
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Google Generative AI (Gemini)** - AI text/image generation
- **Ultralytics YOLOv8** - Pose detection
- **OpenCV** - Image processing

## 📋 Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB
- Google Gemini API Key
- Webcam access (for image capture)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-assisted-medico
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=mongodb://localhost:27017/medico
# JWT_SECRET=your_jwt_secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
# Create .env file with:
# GEMINI_API_KEY=your_gemini_api_key
python -m uvicorn app.main:app --reload
```

### 5. Database
Ensure MongoDB is running on your system.

## 🔄 Application Flow

### 1. User Registration/Login
Users create accounts or login with existing credentials. JWT tokens are issued for authentication.

### 2. Health Profile Setup
Users input their personal health data (age, gender, height, weight, activity level, goal). The system calculates BMI, BMR, and daily calorie needs.

### 3. AI Diet Plan Generation
- User positions themselves in front of the camera
- Real-time computer vision validates proper body positioning using YOLOv8
- When positioned correctly, a full-body image is captured
- Image + user data is sent to Gemini AI for personalized 7-day meal plan generation
- Plan is saved to user's profile and displayed

### 4. Progress Tracking
Users can view their saved diet plans and track progress over time.

## 📊 API Endpoints

### Backend (Port 4000)
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/health` - Get user's health profile
- `POST /api/health` - Create/update health profile
- `POST /api/health/save-plan` - Save AI-generated diet plan

### AI Service (Port 5000)
- `POST /api/vision/validate` - Validate body position in image
- `POST /api/plan/generate` - Generate AI diet plan
- `POST /api/chat` - Generic Gemini chatbot

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are issued upon successful login/registration
- Stored in localStorage on the frontend
- Included in Authorization header for protected routes
- 30-day expiration

## 🤖 AI Features

### Computer Vision (YOLOv8)
- Real-time pose detection to ensure proper image capture
- Validates head and feet visibility
- Checks body positioning (not too close/far from camera)

### Diet Plan Generation (Gemini AI)
- Analyzes full-body images for physique assessment
- Considers user stats (age, weight, height, activity, goals)
- Generates personalized 7-day meal plans
- Includes estimated stats and detailed meal breakdowns

## 🎮 Gamification

- **XP System**: Earn XP through daily logins and activities
- **Levels**: XP determines user level (calculated as floor(sqrt(XP/50)) + 1)
- **Streaks**: Daily login streaks with automatic tracking

## 📱 User Interface

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Live camera validation with visual cues
- **Intuitive Navigation**: Clean sidebar navigation with user stats
- **Progress Visualization**: Clear display of health metrics and diet plans

## 🔧 Development

### Project Structure
```
ai-assisted-medico/
├── frontend/          # React application
├── backend/           # Node.js/Express API
├── ai-service/        # Python FastAPI service
├── .gitignore
└── README.md
```

### Environment Variables

#### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/medico
JWT_SECRET=your_secure_jwt_secret
```

#### AI Service (.env)
```
GEMINI_API_KEY=your_google_gemini_api_key
```

## 🚨 Troubleshooting

### Frontend Issues
- Ensure backend is running on port 4000
- Check browser console for CORS errors
- Verify localStorage contains valid JWT token

### Backend Issues
- Verify MongoDB connection
- Check JWT_SECRET and MONGO_URI in .env
- Ensure all dependencies are installed

### AI Service Issues
- Verify GEMINI_API_KEY is set
- Ensure YOLOv8 model (yolov8n-pose.pt) is present
- Check Python dependencies are installed

### Camera Issues
- Grant camera permissions in browser
- Use HTTPS in production (required for camera access)
- Ensure no other applications are using the camera

## 📈 Future Enhancements

- Mobile app development
- Integration with fitness trackers
- Advanced analytics and reporting
- Social features and community
- Integration with nutrition databases
- Voice-guided workout plans

## 📄 License

This project is for educational purposes.

## 👥 Contributors

- Developed as part of internship project

## 📞 Support

For questions or issues, please check the troubleshooting section or contact the development team.