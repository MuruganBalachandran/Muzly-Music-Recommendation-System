# Server - Backend Documentation

## Overview

Node.js + Express + MongoDB backend API for Muzly.AI music recommendation platform.

---

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer
- **Security:** bcrypt, helmet, cors
- **Validation:** Custom validators
- **Logging:** Winston

---

## Project Structure

```
server/
├── src/
│   ├── config/             # Configuration files
│   │   ├── db/            # Database configuration
│   │   └── index.js       # Environment variables
│   ├── controllers/        # Request handlers
│   │   ├── activity/      # Activity logging
│   │   ├── admin/         # Admin operations
│   │   ├── auth/          # Authentication
│   │   ├── song/          # Song operations
│   │   └── user/          # User operations
│   ├── middlewares/        # Express middlewares
│   │   ├── auth/          # Authentication middleware
│   │   ├── error/         # Error handling
│   │   └── logger/        # Request logging
│   ├── models/             # Mongoose models
│   │   ├── activity/      # Activity model
│   │   ├── admin/         # Admin model
│   │   ├── artist/        # Artist model
│   │   ├── language/      # Language model
│   │   ├── song/          # Song model
│   │   └── user/          # User model
│   ├── queries/            # Database queries
│   ├── routers/            # API routes
│   ├── scripts/            # Utility scripts
│   ├── services/           # Business logic
│   │   └── email/         # Email services
│   ├── utils/              # Utility functions
│   │   └── commonFunctions/ # Common utilities
│   ├── validations/        # Input validation
│   ├── app.js              # Express app configuration
│   └── index.js            # Server entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
└── package.json            # Dependencies
```

---

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique, required),
  password: String (hashed),
  role: String (user/admin),
  isVerified: Boolean,
  favorites: Array,
  songsDiscovered: Number,
  listeningTimeHours: Number,
  emailVerificationOtp: String,
  emailVerificationOtpExpiry: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Song Model
```javascript
{
  songname: String,
  artist: String,
  language: String,
  genre: String,
  emotion: String,
  image: String,
  album_image: String,
  audio: Buffer,
  audioContentType: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Model
```javascript
{
  user: ObjectId (ref: User),
  userEmail: String,
  action: String (enum),
  resource: String,
  details: String,
  status: String (success/failed/pending/error),
  ipAddress: String,
  userAgent: String,
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

### Artist Model
```javascript
{
  name: String (unique, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Language Model
```javascript
{
  name: String (unique, required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /signup` - Register new user
- `POST /signin` - Login user
- `POST /logout` - Logout user
- `POST /verify-email` - Verify email with OTP
- `POST /resend-otp` - Resend verification OTP
- `PATCH /change-password` - Change password
- `PATCH /update-profile` - Update profile
- `GET /me` - Get current user

### Songs (`/api/v1/songs`)
- `GET /` - Get all songs (with pagination)
- `GET /:id` - Get song by ID
- `GET /play/:id` - Stream song audio
- `POST /` - Create song (admin only)
- `PATCH /:id` - Update song (admin only)
- `DELETE /:id` - Delete song (admin only)

### User (`/api/v1/user`)
- `GET /profile` - Get user profile
- `PATCH /profile` - Update profile
- `POST /toggle-favorite` - Add/remove favorite
- `POST /log-activity` - Log user activity
- `GET /stats` - Get user statistics

### Admin (`/api/v1/admin`)
- `GET /stats` - Get dashboard statistics
- `GET /users` - Get all users
- `GET /songs` - Get all songs (admin view)

### Activity (`/api/v1/activity`)
- `POST /log` - Log activity
- `GET /admin/all` - Get all activities (admin only)

### Artists (`/api/v1/artists`)
- `GET /` - Get all artists
- `POST /` - Create artist (admin only)
- `PATCH /:id` - Update artist (admin only)
- `DELETE /:id` - Delete artist (admin only)

### Languages (`/api/v1/languages`)
- `GET /` - Get all languages
- `POST /` - Create language (admin only)
- `PATCH /:id` - Update language (admin only)
- `DELETE /:id` - Delete language (admin only)

---

## Authentication & Authorization

### JWT Authentication
- Tokens stored in HTTP-only cookies
- 30-day expiration
- Automatic refresh on valid requests

### Middleware
```javascript
protect()      // Requires authentication
authorize()    // Requires specific role (admin)
```

### Password Security
- bcrypt hashing with salt rounds
- Minimum 8 characters
- Password validation on registration

---

## Activity Logging System

### Tracked Activities
- **Auth:** Login, Logout, Signup, Email Verified, Password Reset
- **Songs:** Discovered, Favorited, Unfavorited, Listened, Played
- **Admin:** Song/Artist/Language Created/Updated/Deleted
- **Profile:** Profile Updated, Profile Viewed

### Activity Data
Each activity logs:
- User ID and email
- IP address
- User agent
- Action type
- Resource affected
- Status (success/failed/pending/error)
- Timestamp
- Additional metadata

### Usage
```javascript
await logUserActivity({
  req,
  action: 'Login',
  resource: 'Auth',
  details: 'User logged in successfully',
  status: 'success'
});
```

---

## Email Service

### Nodemailer Configuration
- SMTP transport
- HTML email templates
- OTP generation and sending
- Email verification workflow

### Email Types
- Verification OTP
- Password reset
- Welcome email

---

## Error Handling

### Custom Error Class
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}
```

### Global Error Handler
- Development: Full error details
- Production: User-friendly messages
- Logging: Winston logger

---

## Middleware Stack

### Security
- `helmet()` - Security headers
- `cors()` - Cross-origin requests
- `mongoSanitize()` - NoSQL injection prevention
- `xss()` - XSS protection

### Request Processing
- `express.json()` - JSON body parser
- `express.urlencoded()` - URL-encoded parser
- `cookieParser()` - Cookie parsing

### Logging
- `serverLogger()` - Request/response logging
- Winston logger for errors

---

## Database Configuration

### Connection
```javascript
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

### Indexes
- User: email (unique)
- Song: songname, artist, language
- Activity: user + createdAt, userEmail + createdAt
- Artist: name (unique)
- Language: name (unique)

---

## Environment Variables

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/muzly
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@muzly.ai
```

---

## Scripts

### Development
```bash
npm run dev
```
Runs with nodemon for auto-restart

### Production
```bash
npm start
```
Runs production server

### Seed Admin
```bash
node src/scripts/seedAdmin.js
```
Creates initial admin user

---

## Security Best Practices

1. **Password Hashing:** bcrypt with salt rounds
2. **JWT Tokens:** HTTP-only cookies
3. **Input Validation:** Sanitization and validation
4. **Rate Limiting:** Prevent brute force attacks
5. **CORS:** Configured for specific origins
6. **Helmet:** Security headers
7. **MongoDB Injection:** Sanitization middleware

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Logging

### Winston Logger
- Console transport (development)
- File transport (production)
- Error logging
- Request/response logging

### Log Levels
- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `debug` - Debug messages

---

## Database Queries

### Optimized Queries
- Pagination support
- Sorting and filtering
- Aggregation pipelines
- Indexed fields

### Query Functions
Located in `/queries` folder:
- `authQueries.js` - Authentication queries
- `userQueries.js` - User operations
- `songQueries.js` - Song operations
- `activityQueries.js` - Activity queries

---

## Testing

### Manual Testing
Use Postman or similar tools

### Test User
```javascript
Email: admin@muzly.ai
Password: AdminPassword123!
```

---

## Deployment

1. Set environment variables
2. Configure MongoDB connection
3. Set up email service
4. Configure CORS origins
5. Enable HTTPS
6. Set up process manager (PM2)
7. Configure reverse proxy (Nginx)

---

## Performance Optimization

- Database indexing
- Query optimization
- Caching strategies
- Connection pooling
- Compression middleware

---

## Monitoring

- Request logging
- Error tracking
- Performance metrics
- Database monitoring
- Activity analytics

---

## Troubleshooting

### Common Issues

**Issue:** MongoDB connection failed
**Solution:** Check MONGO_URI and MongoDB service

**Issue:** Email not sending
**Solution:** Verify EMAIL_* environment variables

**Issue:** JWT errors
**Solution:** Check JWT_SECRET configuration

---

## Contributing

1. Follow Node.js best practices
2. Use async/await for asynchronous code
3. Add error handling with try-catch
4. Document all functions
5. Use region comments for organization

---

## License

Proprietary - Muzly.AI
