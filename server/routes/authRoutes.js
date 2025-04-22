// server\routes\authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();
const { ensureInstitutionalEmail } = require('../middleware/roleMiddleware');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// ✅ POST /auth/login
router.post("/login",ensureInstitutionalEmail, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);

      // ✅ Role validation
      if (req.body.role && req.body.role !== user.role) {
        return res.status(403).json({ error: "Unauthorized role" });
      }

      return res.json({
        message: "Logged in successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage, // Include profile image URL
        },
      });
    });
  })(req, res, next);
});

// ✅ GET /auth/profile
router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ✅ Handle social links properly
  const socialLinks = req.user.socialLinks || {};

  // ✅ Return complete profile
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    dob: req.user.dob,
    branch: req.user.branch,
    currentCompany: req.user.currentCompany,
    currentCompanyRole: req.user.currentCompanyRole,
    location: req.user.location,
    batch: req.user.batch,
    homeTown: req.user.homeTown,
    socialLinks: {
      linkedin: socialLinks.linkedin || null,
      instagram: socialLinks.instagram || null,
      github: socialLinks.github || null,
      x: socialLinks.x || socialLinks.twitter || null,
    },
    personalEmail: req.user.personalEmail,
    isActive: req.user.isActive,
    lastLogin: req.user.lastLogin,
    profileImage: req.user.profileImage, // Make sure to include profile image URL
  });
});

// ✅ POST /auth/logout
router.post("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("connect.sid"); // ✅ Clear session cookie
        return res.json({ message: "Logged out successfully" });
      });
    });
  } catch (error) {
    next(error);
  }
});

// Google Auth Routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        return res.redirect(`${process.env.VITE_API_BASE_URL}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
      }

      if (!user) {
        let errorMessage = 'Authentication failed.';
        
        // Customize error message based on info
        if (info && info.message) {
          if (info.message.includes('@iiitn.ac.in')) {
            errorMessage = 'Please use your IIIT Nagpur email (@iiitn.ac.in) to sign in.';
          } else if (info.message.includes('not registered')) {
            errorMessage = 'This email is not registered in our system. Please contact the administrator.';
          }
        }

        return res.redirect(`${process.env.VITE_API_BASE_URL}/login?error=${encodeURIComponent(errorMessage)}`);
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.redirect(`${process.env.VITE_API_BASE_URL}/login?error=${encodeURIComponent('Login failed. Please try again.')}`);
        }

        const role = user.role.toLowerCase();
        const redirectPath = role === 'admin' ? '/admin/announcements' : '/announcements';
        return res.redirect(`${process.env.VITE_API_BASE_URL}${redirectPath}`);
      });
    })(req, res, next);
  }
);

router.get('/debug-auth', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user ? {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      profileImage: req.user.profileImage, // Include profile image URL
    } : null,
    sessionDetails: {
      passport: req.session?.passport,
      exists: !!req.session
    }
  });
});

// Protected route
router.get('/protected', isAuthenticated, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      profileImage: req.user.profileImage, // Include profile image URL
    }
  });
});

// FIXED: Auth check route now includes complete user data including profileImage
router.get('/check', (req, res) => {
  try {
    if (req.isAuthenticated() && req.user) {
      // Convert the user document to a plain object if it's a Mongoose document
      const userObj = req.user.toObject ? req.user.toObject() : req.user;
      
      // Remove sensitive data like password
      const { password, __v, ...safeUserData } = userObj;
      
      return res.json({
        isAuthenticated: true,
        user: safeUserData  // Return complete user object including profileImage
      });
    } else {
      return res.json({
        isAuthenticated: false,
        user: null
      });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({
      isAuthenticated: false,
      error: 'Server error during authentication check'
    });
  }
});

module.exports = router;