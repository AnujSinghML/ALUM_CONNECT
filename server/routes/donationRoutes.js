// server/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');
const { isAdmin } = require('../middleware/authMiddleware');

// Create donation
router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;

// Get all donations (admin only)
// router.get('/', isAdmin, async (req, res) => {
//   try {
//     const donations = await Donation.find().sort({ createdAt: -1 });
//     res.json(donations);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Update donation status (admin only)
// router.patch('/:id/status', isAdmin, async (req, res) => {
//   try {
//     const donation = await Donation.findById(req.params.id);
//     if (!donation) {
//       return res.status(404).json({ message: 'Donation not found' });
//     }
//     donation.status = req.body.status;
//     await donation.save();
//     res.json(donation);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

