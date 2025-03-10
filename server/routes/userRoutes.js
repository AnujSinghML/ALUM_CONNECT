// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { verifyAdmin } = require('../middleware/authMiddleware');

// GET /api/users
// Admin-only route to fetch all users
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/users/:id/role
// Admin-only route to update a user's role
router.patch('/:id/role', verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
