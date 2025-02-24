// server\routes\authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// ✅ POST /auth/login
router.post("/login", (req, res, next) => {
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
    isActive: req.user.isActive,
    lastLogin: req.user.lastLogin,
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

module.exports = router;
