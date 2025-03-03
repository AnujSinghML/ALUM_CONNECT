// server\middleware\authMiddleware.js
const verifyAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

const isAlumni = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (req.user.role !== "alumni") {
    return res.status(403).json({ error: "Only alumni can create job opportunities" });
  }

  next();
};

module.exports = { verifyAdmin, isAlumni };

