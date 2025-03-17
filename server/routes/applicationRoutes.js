// // const express = require('express');
// // const router = express.Router();
// // const Application = require('../models/application');
// // const Job = require('../models/job');

// // // // Submit a job application
// // // router.post('/apply', async (req, res) => {
// // //   try {
// // //     const { jobId, applicantName, applicantEmail, resumeUrl, coverLetter } = req.body;

// // //     // Check if the job exists
// // //     const job = await Job.findById(jobId);
// // //     if (!job) {
// // //       return res.status(404).json({ message: 'Job not found' });
// // //     }

// // //     const newApplication = new Application({
// // //       jobId,
// // //       applicantName,
// // //       applicantEmail,
// // //       resumeUrl,
// // //       coverLetter
// // //     });

// // //     await newApplication.save();
// // //     res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error submitting application', error });
// // //   }
// // // });

// // // // POST /api/applications/apply
// // // router.post('/apply', async (req, res) => {
// // //     try {
// // //         const { applicantName, applicantEmail, resumeUrl, coverLetter, jobId } = req.body;

// // //         if (!applicantName || !applicantEmail || !resumeUrl || !jobId) {
// // //             return res.status(400).json({ message: 'Missing required fields' });
// // //         }

// // //         // Simulate storing the application (replace with database logic)
// // //         console.log('New Job Application:', req.body);

// // //         res.status(201).json({ message: 'Application submitted successfully!' });
// // //     } catch (error) {
// // //         console.error('Error handling application:', error);
// // //         res.status(500).json({ message: 'Internal Server Error' });
// // //     }
// // // });

// // // // Handle job applications
// // // router.post('/apply', (req, res) => {
// // //     const { applicantName, applicantEmail, resumeUrl, coverLetter, jobId } = req.body;

// // //     if (!applicantName || !applicantEmail || !resumeUrl || !jobId) {
// // //         return res.status(400).json({ message: 'Missing required fields' });
// // //     }

// // //     console.log('New Job Application:', req.body);
// // //     res.status(201).json({ message: 'Application submitted successfully!' });
// // // });

// // // router.post('/apply', (req, res) => {
// // //     const { applicantName, applicantEmail, resumeUrl, coverLetter, jobId } = req.body;

// // //     if (!applicantName || !applicantEmail || !resumeUrl || !jobId) {
// // //         return res.status(400).json({ message: 'Missing required fields' });
// // //     }

// // //     console.log('New Job Application:', req.body);
// // //     res.status(201).json({ message: 'Application submitted successfully!' });
// // // });

// // // router.post("/:jobId/apply", async (req, res) => {
// // //     const { jobId } = req.params;  // Get job ID from URL
// // //     const { applicantName, applicantEmail, resumeUrl, coverLetter } = req.body;

// // //     if (!jobId || !applicantName || !applicantEmail || !resumeUrl || !coverLetter) {
// // //         return res.status(400).json({ message: "Missing required fields" });
// // //     }

// // //     // Save application logic...
// // //     res.json({ message: "Application submitted successfully!", jobId });
// // // });

// // // // Submit application with correct jobId
// // // router.post("/:jobId/apply", async (req, res) => {
// // //     const { jobId } = req.params;
// // //     const { applicantName, applicantEmail, resumeUrl, coverLetter } = req.body;

// // //     if (!jobId || !applicantName || !applicantEmail || !resumeUrl || !coverLetter) {
// // //         return res.status(400).json({ message: "Missing required fields" });
// // //     }

// // //     try {
// // //         const job = await Job.findOne({ jobId });  // Ensure job exists
// // //         if (!job) {
// // //             return res.status(404).json({ message: "Job not found" });
// // //         }

// // //         const application = new Application({
// // //             jobId,
// // //             applicantName,
// // //             applicantEmail,
// // //             resumeUrl,
// // //             coverLetter
// // //         });

// // //         await application.save();
// // //         res.json({ message: "Application submitted successfully!", jobId });
// // //     } catch (error) {
// // //         console.error("Error submitting application:", error);
// // //         res.status(500).json({ message: "Internal Server Error" });
// // //     }
// // // });

// // // Submit application with correct jobId
// // router.post("/:jobId/apply", async (req, res) => {
// //     const { jobId } = req.params;
// //     const { applicantName, applicantEmail, resumeUrl, coverLetter } = req.body;

// //     if (!jobId || !applicantName || !applicantEmail || !resumeUrl || !coverLetter) {
// //         return res.status(400).json({ message: "Missing required fields" });
// //     }

// //     try {
// //         const job = await Job.findOne({ jobId });  // Ensure job exists
// //         if (!job) {
// //             return res.status(404).json({ message: "Job not found" });
// //         }

// //         const application = new Application({
// //             jobId,
// //             applicantName,
// //             applicantEmail,
// //             resumeUrl,
// //             coverLetter
// //         });

// //         await application.save();
// //         res.json({ message: "Application submitted successfully!", jobId });
// //     } catch (error) {
// //         console.error("Error submitting application:", error);
// //         res.status(500).json({ message: "Internal Server Error" });
// //     }
// // });

// // // Get all applications for a job
// // router.get('/job/:jobId', async (req, res) => {
// //   try {
// //     const applications = await Application.find({ jobId: req.params.jobId });
// //     res.json(applications);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching applications', error });
// //   }
// // });

// // // Get applications by applicant email
// // router.get('/applicant/:email', async (req, res) => {
// //   try {
// //     const applications = await Application.find({ applicantEmail: req.params.email });
// //     res.json(applications);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching applications', error });
// //   }
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Job = require("../models/job");
// const Application = require("../models/application");

// // Submit an application
// router.post("/:jobId/apply", async (req, res) => {
//     const { jobId } = req.params;  // Extract jobId from URL
//     const { applicantName, applicantEmail, resumeUrl, coverLetter } = req.body;

//     if (!jobId || !applicantName || !applicantEmail || !resumeUrl || !coverLetter) {
//         return res.status(400).json({ message: "Missing required fields" });
//     }

//     try {
//         // Find job by string `jobId` (not `_id`)
//         const job = await Job.findOne({ jobId });

//         if (!job) {
//             return res.status(404).json({ message: "Job not found" });
//         }

//         // Create a new application
//         const application = new Application({
//             jobId,  // Now correctly stored as a string
//             applicantName,
//             applicantEmail,
//             resumeUrl,
//             coverLetter
//         });

//         await application.save();
//         res.json({ message: "Application submitted successfully!", jobId });
//     } catch (error) {
//         console.error("Error submitting application:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const Application = require("../models/application");
const mongoose = require("mongoose");

// Submit an application
router.post("/:jobId/apply", async (req, res) => {
    const { jobId } = req.params;  // This will now be the MongoDB _id
    const { applicantName, applicantEmail, resumeUrl, coverLetter } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID" });
    }

    if (!applicantName || !applicantEmail || !resumeUrl || !coverLetter) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Find job by MongoDB _id
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Create and save application
        const application = new Application({
            jobId: job._id, // Store as an ObjectId
            applicantName,
            applicantEmail,
            resumeUrl,
            coverLetter
        });

        await application.save();
        res.json({ message: "Application submitted successfully!", jobId: job._id });
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
