// // server\middleware\authMiddleware.js
// const verifyAdmin = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ error: "Not authenticated" });
//   }

//   if (req.user.role !== "admin") {
//     return res.status(403).json({ error: "Admin access required" });
//   }

//   next();
// };

// const isAlumni = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ error: "Not authenticated" });
//   }

//   if (req.user.role !== "alumni") {
//     return res.status(403).json({ error: "Only alumni can create job opportunities" });
//   }

//   next();
// };

// module.exports = { verifyAdmin, isAlumni };

// server/middleware/authMiddleware.js
const { ensureRole } = require('./roleMiddleware');

const verifyAdmin = (req, res, next) => {
  return ensureRole(['admin'])(req, res, next);
};

const isAlumni = (req, res, next) => {
  return ensureRole(['alumni'])(req, res, next);
};

const isStudent = (req, res, next) => {
  return ensureRole(['student'])(req, res, next);
};

module.exports = { verifyAdmin, isAlumni, isStudent };