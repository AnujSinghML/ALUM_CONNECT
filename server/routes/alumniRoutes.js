// server/routes/alumniRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');

// GET /api/alumni - fetch alumni profiles with optional filters and pagination
router.get('/', async (req, res) => {
  try {
    const { batch, branch, currentCompany, location, page, limit } = req.query;
    // Base filter: only alumni
    const filter = { role: 'alumni' };

    if (batch) {
      filter.batch = batch;
    }
    if (branch) {
      filter.branch = { $regex: branch, $options: 'i' };
    }
    if (currentCompany) {
      filter.currentCompany = { $regex: currentCompany, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Pagination: default to page 1 and limit 10 if not provided
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Count total documents for pagination
    const total = await User.countDocuments(filter);
    const alumni = await User.find(filter)
      .select('name batch location currentCompany currentCompanyRole branch socialLinks')
      .skip(skip)
      .limit(limitNum);

    res.json({
      data: alumni,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
