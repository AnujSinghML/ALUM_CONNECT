// const path = require('path');
// const express = require('express');
// const session = require('express-session');
// const connectDB = require('./config/db');
// const passport = require('passport');
// const dotenv = require('dotenv');
// const cors = require('cors'); 
// const errorHandler = require('./middleware/errorHandler');

// // Load environment variables
// dotenv.config({ path: path.join(__dirname, '.env') });

// // Verify required environment variables
// const requiredEnvVars = [
//   'MONGO_URI',
//   'SESSION_SECRET',
//   'GOOGLE_CLIENT_ID',
//   'GOOGLE_CLIENT_SECRET',
//   'GOOGLE_CALLBACK_URL',
//   'VITE_API_BASE_URL'
// ];

// const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
// if (missingEnvVars.length > 0) {
//   console.error('Missing required environment variables:', missingEnvVars);
//   process.exit(1);
// }

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Logging middleware
// // app.use((req, res, next) => {
// //   console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
// //   next();
// // });

// // Configuration logging
// // console.log('Starting server with configuration:');
// // console.log('Environment:', process.env.NODE_ENV || 'development');
// // console.log('Frontend URL:', process.env.VITE_API_BASE_URL);
// // console.log('Google Callback URL:', process.env.GOOGLE_CALLBACK_URL);


// // CORS configuration
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? process.env.VITE_API_BASE_URL 
//     : 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));


// // Body parser middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Session configuration
// const sessionConfig = {
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
//   }
// };

// app.use(session(sessionConfig));

// // Passport initialization
// app.use(passport.initialize());
// app.use(passport.session());
// require('./config/passport')(passport);

// // Health check
// app.get('/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'ok',
//     environment: process.env.NODE_ENV,
//     timestamp: new Date().toISOString()
//   });
// });

// // Auth state check
// app.get('/auth/check', (req, res) => {
//   res.json({ 
//     isAuthenticated: req.isAuthenticated(),
//     user: req.user ? {
//       id: req.user.id,
//       email: req.user.email,
//       role: req.user.role
//     } : null
//   });
// });

// // Routes
// app.use('/auth', require('./routes/authRoutes'));
// app.use('/api/profile', require('./routes/profileRoutes'));
// app.use('/api/announcements', require('./routes/announcementRoutes'));
// app.use('/api/admin/announcements', require('./routes/adminAnnouncementRoutes'));
// app.use('/api/donations', require('./routes/donationRoutes'));
// app.use('/api/opportunities', require('./routes/opportunityRoutes'));
// app.use('/api/jobs/admin', require('./routes/adminJobRoutes'));
// app.use('/api/jobs', require('./routes/jobRoutes'));
// app.use('/api/alumni', require('./routes/alumniRoutes'));
// app.use("/api/forum", require("./routes/forumRoutes"));
// app.use('/api/donations/admin', require('./routes/adminDonationRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));


// // 404 handler
// app.use((req, res, next) => {
//   console.log(`404 Not Found: ${req.method} ${req.url}`);
//   res.status(404).json({ 
//     error: 'Not Found',
//     path: req.url,
//     method: req.method
//   });
// });

// // Error handling
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   console.error('Stack:', err.stack);
  
//   if (err.name === 'UnauthorizedError') {
//     return res.status(401).json({ error: 'Unauthorized access' });
//   }
  
//   res.status(err.status || 500).json({
//     error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
//     path: req.url,
//     method: req.method
//   });
// });

// app.use(errorHandler);

// // Start server
// const PORT = process.env.PORT || 3000;
// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`Server URL: http://localhost:${PORT}`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTP server');
//   server.close(() => {
//     console.log('HTTP server closed');
//     process.exit(0);
//   });
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception:', err);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   process.exit(1);
// });

// module.exports = app;

const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors'); 
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');

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

// Security Middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.VITE_API_BASE_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cookie', 
    'X-Requested-With',
    'Pragma',
    'Cache-Control' 
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    autoRemove: 'interval',
    autoRemoveInterval: 10
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

// Apply session middleware
app.use(session(sessionConfig));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
const routes = [
  { path: '/auth', router: require('./routes/authRoutes') },
  { path: '/api/profile', router: require('./routes/profileRoutes') },
  { path: '/api/announcements', router: require('./routes/announcementRoutes') },
  { path: '/api/admin/announcements', router: require('./routes/adminAnnouncementRoutes') },
  { path: '/api/donations', router: require('./routes/donationRoutes') },
  { path: '/api/opportunities', router: require('./routes/opportunityRoutes') },
  { path: '/api/jobs/admin', router: require('./routes/adminJobRoutes') },
  { path: '/api/jobs', router: require('./routes/jobRoutes') },
  { path: '/api/alumni', router: require('./routes/alumniRoutes') },
  { path: '/api/forum', router: require('./routes/forumRoutes') },
  { path: '/api/donations/admin', router: require('./routes/adminDonationRoutes') },
  { path: '/api/users', router: require('./routes/userRoutes') },
  { path: '/api/messages', router: require('./routes/messageRoutes') }
];

// Apply routes
routes.forEach(route => {
  app.use(route.path, route.router);
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    status: err.status || 500
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'An unexpected error occurred'
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const initializeSocketIO = require('./config/socketConfig');
const io = initializeSocketIO(server, sessionConfig);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };