const path = require('path');
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors'); 
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Verify required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'SESSION_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'VITE_API_BASE_URL'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Logging middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
//   next();
// });

// Configuration logging
// console.log('Starting server with configuration:');
// console.log('Environment:', process.env.NODE_ENV || 'development');
// console.log('Frontend URL:', process.env.VITE_API_BASE_URL);
// console.log('Google Callback URL:', process.env.GOOGLE_CALLBACK_URL);


const allowedOrigins = [
  'http://localhost:5173',
  'http://15.206.215.46:5173',
  'http://15.206.215.46',
  'http://alumconnect.home.kg'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Required when using cookies, authentication headers, etc.
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));




// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

app.use(session(sessionConfig));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Auth state check
app.get('/auth/check', (req, res) => {
  res.json({ 
    isAuthenticated: req.isAuthenticated(),
    user: req.user ? {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    } : null
  });
});

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/admin/announcements', require('./routes/adminAnnouncementRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/opportunities', require('./routes/opportunityRoutes'));
app.use('/api/jobs/admin', require('./routes/adminJobRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use("/api/forum", require("./routes/forumRoutes"));
app.use('/api/donations/admin', require('./routes/adminDonationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


// 404 handler
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.url,
    method: req.method
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    path: req.url,
    method: req.method
  });
});

app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server URL: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;