const express = require('express');
const { upload } = require('../utils/cloudinary');
const Announcement = require('../models/Announcement');
const { verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Add an announcement
router.post('/add', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { type, title, description } = req.body;
    const imageUrl = req.file.path;

    const announcement = new Announcement({ type, title, description, imageUrl });
    await announcement.save();

    res.json({ message: 'Announcement added', announcement });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Delete an announcement
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Not found' });

    // Delete from Cloudinary
    const imagePublicId = announcement.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`announcements/${imagePublicId}`);

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
