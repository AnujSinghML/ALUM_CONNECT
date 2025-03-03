const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../utils/cloudinary');
const Announcement = require('../models/Announcement');
const { isAlumni } = require('../middleware/authMiddleware');

// 1️⃣ Corrected Multer Storage Configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  }
});

// 2️⃣ Create a POST route to handle achievement creation
router.post('/add', isAlumni, upload.single('image'), async (req, res) => {
  try {
    const { type, title, description, name } = req.body;
    console.log("🟢 Request Body:", req.body);
    console.log("🟢 Received file:", req.file);

    let imageUrl = '';
    if (req.file) {
      // 3️⃣ Corrected Cloudinary Image Upload
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "achievements" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      console.log("🟢 Cloudinary Upload Response:", uploadResult);
      imageUrl = uploadResult.secure_url;
    }

    // 4️⃣ Save Achievement to Database
    const newAnnouncement = new Announcement({
      type,
      title,
      description,
      imageUrl,
      name
    });

    const savedAnnouncement = await newAnnouncement.save();
    console.log("🟢 Announcement Saved to DB:", savedAnnouncement);

    res.status(201).json({ message: 'Achievement created successfully', data: savedAnnouncement });
  } catch (err) {
    console.error("❌ Error creating achievement:", err);
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an announcement
router.delete('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Not found' });

    // Delete from Cloudinary
    if (announcement.imageUrl) {
      const imagePublicId = announcement.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`achievements/${imagePublicId}`);
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
