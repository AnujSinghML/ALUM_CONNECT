// server\routes\jobRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const User = require('../models/users');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 });
    
    // Fetch author details for each job
    const jobsWithAuthors = await Promise.all(
      jobs.map(async (job) => {
        const author = await User.findOne({ email: job.authorEmail });
        return {
          ...job.toObject(),
          authorName: author ? author.name : 'Unknown Author',
          companyName: author ? author.companyName : 'Unknown Company'
        };
      })
    );
    
    res.json(jobsWithAuthors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new job
router.post('/createJob', isAuthenticated, async (req, res) => {
  try {
    console.log('Request reached createJob');
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('User in request:', req.user);
    
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'No authenticated user found' });
    }

    // Get the current count for jobId
    const count = await Job.countDocuments();
    const jobId = `JOB-${(count + 1).toString().padStart(4, '0')}`;

    const jobData = {
      jobId,
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      location: req.body.location,
      salary: req.body.salary,
      employmentType: req.body.employmentType,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
      authorEmail: req.user.email,
      tags: req.body.tags || [],
      status: 'pending',
      applicationUrl: req.body.applicationUrl,
      applicationDeadline: req.body.applicationDeadline
    };

    console.log('Creating job with data:', jobData);

    const job = new Job(jobData);
    await job.save();
    
    console.log('Job created successfully:', job);
    res.status(201).json(job);
  } catch (error) {
    console.error('Error in createJob:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors // Include mongoose validation errors if any
    });
  }
});
// Filter jobs by criteria
router.get('/filter', async (req, res) => {
    try {
      const { employmentType, location, tag } = req.query;
      const filter = {};
      
      if (employmentType) filter.employmentType = employmentType;
      if (location) filter.location = { $regex: location, $options: 'i' };
      if (tag) filter.tags = { $in: [tag] };
      
      const jobs = await Job.find(filter).sort({ createdAt: -1 });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Get job by ID
router.get('/:jobId', async (req, res) => {
  try {
    const job = await Job.findOne({ jobId: req.params.jobId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const author = await User.findOne({ email: job.authorEmail });
    const jobWithAuthor = {
      ...job.toObject(),
      authorName: author ? author.name : 'Unknown Author',
      companyName: author ? author.companyName : 'Unknown Company'
    };
    
    res.json(jobWithAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Filter jobs by criteria
router.get('/filter', async (req, res) => {
  try {
    const { employmentType, location, tag } = req.query;
    const filter = {};
    
    if (employmentType) filter.employmentType = employmentType;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (tag) filter.tags = { $in: [tag] };
    
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get jobs by author email
router.get('/author/:email', async (req, res) => {
  try {
    const jobs = await Job.find({ authorEmail: req.params.email });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job status
router.patch('/:jobId/status', isAuthenticated, async (req, res) => {
  try {
    const job = await Job.findOne({ jobId: req.params.jobId });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the user is the author of the job
    if (job.authorEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized to update this job' });
    }
    
    job.status = req.body.status;
    await job.save();
    
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



module.exports = router;