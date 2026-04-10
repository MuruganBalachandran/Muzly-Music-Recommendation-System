# Muzly.AI - AI-Powered Music Recommendation Platform

## 🎵 Overview

Muzly.AI is an innovative music recommendation platform that uses artificial intelligence, emotion detection, and contextual analysis to provide personalized music recommendations. The system analyzes facial expressions, environmental context, and user preferences to suggest the perfect soundtrack for any moment.

---

## ✨ Key Features

### 🎭 Emotion-Based Recommendations
- Real-time facial emotion detection
- 7 emotion categories (Happy, Sad, Angry, Disgust, Fear, Surprise, Neutral)
- AI-powered music matching

### 🖼️ Image Context Analysis
- Upload images to get mood-based recommendations
- Scene understanding using computer vision
- Environmental context integration

### 🎼 Smart Music Discovery
- Personalized song recommendations
- Multi-language support
- Genre and artist filtering
- Favorites management

### 👤 User Features
- Profile management
- Listening history
- Activity tracking
- Favorites collection

### 🛡️ Admin Dashboard
- User management
- Song library management
- Activity monitoring
- Analytics and statistics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Muzly.AI Platform                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Frontend   │  │   Backend    │  │   AI Model   │  │
│  │              │  │              │  │              │  │
│  │  React +     │◄─┤  Node.js +   │◄─┤  Python +    │  │
│  │  TypeScript  │  │  Express +   │  │  TensorFlow  │  │
│  │  + Vite      │  │  MongoDB     │  │  + Flask     │  │
│  │              │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js:** v18+ 
- **Python:** 3.8+
- **MongoDB:** 4.4+
- **npm:** 9+

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd muzly-ai
```

#### 2. Setup Backend (Node.js + MongoDB)
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB
mongod

# Seed admin user
node src/scripts/seedAdmin.js

# Start server
npm run dev
```

Server runs on: `http://127.0.0.1:5000`

#### 3. Setup AI Model (Python + Flask)
```bash
cd model

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python api_server.py
```

Model API runs on: `http://127.0.0.1:8000`

#### 4. Setup Frontend (React + Vite)
```bash
cd client
npm install

# Create .env file
cp .env.example .env
# Edit .env with API endpoints

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:8080`

---

## 📁 Project Structure

```
muzly-ai/
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── package.json
│
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Mongoose models
│   │   ├── routers/       # API routes
│   │   ├── middlewares/   # Express middlewares
│   │   └── utils/         # Utilities
│   └── package.json
│
├── model/                  # AI Model (Python + Flask)
│   ├── src/               # Model source code
│   ├── emotion_model/     # Trained models
│   ├── api_server.py      # Flask API
│   └── requirements.txt
│
├── docs/                   # Documentation
├── CLIENT.md              # Frontend documentation
├── SERVER.md              # Backend documentation
├── MODEL.md               # AI Model documentation
└── README.md              # This file
```

---

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/muzly
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@muzly.ai
```

### Frontend Environment Variables (.env)
```env
VITE_NODE_API_BASE=http://127.0.0.1:5000/api/v1
VITE_PYTHON_API_BASE=http://127.0.0.1:8000
```

### Model Environment Variables
```env
FLASK_ENV=development
MODEL_PATH=emotion_model/best_emotion_model.h5
MONGO_URI=mongodb://127.0.0.1:27017/muzly
```

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/verify-email` - Verify email with OTP

### Song Endpoints
- `GET /api/v1/songs` - Get all songs
- `GET /api/v1/songs/:id` - Get song by ID
- `GET /api/v1/songs/play/:id` - Stream song audio
- `POST /api/v1/songs` - Create song (admin)

### User Endpoints
- `GET /api/v1/user/profile` - Get user profile
- `PATCH /api/v1/user/profile` - Update profile
- `POST /api/v1/user/toggle-favorite` - Toggle favorite

### Admin Endpoints
- `GET /api/v1/admin/stats` - Get statistics
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/activity/admin/all` - Get activity logs

### AI Model Endpoints
- `POST /detect-emotion` - Detect emotion from image
- `POST /recommend` - Get music recommendations

---

## 🎯 Usage

### For Users

1. **Sign Up**
   - Create account with email
   - Verify email with OTP
   - Complete profile

2. **Discover Music**
   - Upload image for emotion detection
   - Browse song library
   - Search by artist, language, or genre
   - Add songs to favorites

3. **Listen**
   - Play songs directly in browser
   - Control playback (play/pause/volume)
   - View listening history

4. **Manage Profile**
   - Update profile information
   - View statistics
   - Manage favorites

### For Admins

1. **Dashboard**
   - View platform statistics
   - Monitor user activity
   - Track system health

2. **Content Management**
   - Add/edit/delete songs
   - Manage artists and languages
   - Moderate content

3. **User Management**
   - View all users
   - Monitor user activity
   - Manage permissions

---

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

### Model Tests
```bash
cd model
python -m pytest test/
```

---

## 📦 Production Deployment

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
# Deploy /dist folder to hosting service
```

### Model
```bash
cd model
gunicorn -w 4 -b 0.0.0.0:8000 api_server:app
```

---

## 🔒 Security

- JWT authentication with HTTP-only cookies
- bcrypt password hashing
- Input validation and sanitization
- CORS configuration
- Rate limiting
- XSS protection
- MongoDB injection prevention

---

## 🎨 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Nodemailer

### AI/ML
- Python
- TensorFlow/Keras
- Flask
- OpenCV
- NumPy

---

## 📊 Database Schema

### Users Collection
- User credentials and profile
- Favorites and preferences
- Activity statistics

### Songs Collection
- Song metadata
- Audio files (Buffer)
- Emotion tags

### Activities Collection
- User actions
- IP addresses
- Status tracking

### Artists & Languages Collections
- Reference data
- Metadata

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

Proprietary - Muzly.AI. All rights reserved.

---

## 👥 Team

- **Murugan B** - AI Full Stack Developer
- **Vidhya S** - GenAI Developer

---

## 📧 Contact

For questions or support, please contact:
- Email: support@muzly.ai
- Website: https://muzly.ai

---

## 🙏 Acknowledgments

- FER2013 dataset for emotion detection training
- Open source community
- All contributors and testers

---

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Social features (sharing, playlists)
- [ ] Advanced recommendation algorithms
- [ ] Real-time collaboration
- [ ] Spotify/Apple Music integration
- [ ] Voice-based emotion detection
- [ ] Multi-language support expansion

---

## 🐛 Known Issues

See [Issues](https://github.com/your-repo/issues) for a list of known issues and feature requests.

---

## 📖 Additional Documentation

- [CLIENT.md](./CLIENT.md) - Frontend documentation
- [SERVER.md](./SERVER.md) - Backend documentation
- [MODEL.md](./MODEL.md) - AI Model documentation

---

**Made with ❤️ by the Muzly.AI Team**
