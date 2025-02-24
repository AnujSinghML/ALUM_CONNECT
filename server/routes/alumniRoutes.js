// server/routes/alumniRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');

// GET /api/alumni - fetch all alumni profiles with optional filters
router.get('/', async (req, res) => {
  try {
    const { batch, branch, currentCompany, location } = req.query;
    // Start with only alumni
    const filter = { role: 'alumni' };

    if (batch) {
      filter.batch = batch;
    }
    if (branch) {
      // You can use regex for case-insensitive match if needed
      filter.branch = { $regex: branch, $options: 'i' };
    }
    if (currentCompany) {
      filter.currentCompany = { $regex: currentCompany, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const alumni = await User.find(filter)
      .select('name batch location currentCompany currentCompanyRole branch socialLinks');
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
