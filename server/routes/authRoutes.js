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
      return res.json({
        message: 'Logged in successfully',
        user: { id: user.id, email: user.email, role: user.role }
      });
    });
  })(req, res, next);
});

module.exports = router;
