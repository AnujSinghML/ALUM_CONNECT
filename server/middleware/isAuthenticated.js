// server/middleware/isAuthenticated.js
module.exports = {
  isAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: 'Not authenticated' });
  }
};