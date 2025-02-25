// server\server.js
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors'); 
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware MUST come before passport.initialize
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport
require('./config/passport')(passport);

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/opportunities', require('./routes/opportunityRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use("/api/forum", require("./routes/forumRoutes"));


// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});