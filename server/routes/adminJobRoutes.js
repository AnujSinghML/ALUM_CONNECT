// server/routes/adminJobRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const { verifyAdmin } = require('../middleware/authMiddleware');

// GET all jobs for admin
router.get('/', verifyAdmin, async (req, res) => {
  console.log(
    "adminJobRoutes.js: GET /api/jobs/admin called by:",
    req.user ? req.user.email : 'unknown'
  );
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH update job status
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'filled', 'pending', 'expired'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    job.status = status;
    await job.save();
    res.json({ message: 'Job status updated', data: job });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE job opportunity
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
