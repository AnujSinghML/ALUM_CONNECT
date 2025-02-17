// server/routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// POST /auth/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
  if (err) return next(err);
  if (!user) return res.status(400).json({ error: info.message });
  req.logIn(user, (err) => {
    if (err) return next(err);
    
    // Role validation: compare the role sent in the request with the role in the database.
    if (req.body.role && req.body.role !== user.role) {
      return res.status(403).json({ error: 'Unauthorized role' });
    }
    
    return res.json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
})(req, res, next);
});  
// GET /auth/profile
router.get('/profile', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Map socialLinks to socialMedia if needed
  const socialMedia = req.user.socialMedia || req.user.socialLinks || {};
  
  // Return the complete profile data
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
    socialMedia: {
      linkedin: socialMedia.linkedin,
      instagram: socialMedia.instagram,
      github: socialMedia.github,
      twitter: socialMedia.x || socialMedia.twitter  // Handle both x and twitter
    },
    isActive: req.user.isActive,
    lastLogin: req.user.lastLogin
  });
});

// POST /auth/logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
