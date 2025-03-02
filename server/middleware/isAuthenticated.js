// server\middleware\isAuthenticated.js
module.exports = {
    isAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        console.log('User authenticated:', req.user); // Add logging
        return next();
      }
      return res.status(401).json({ message: 'Not authenticated' }); // Return JSON instead of redirect
    }
  };