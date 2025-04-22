// server/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Adjust path if needed
const { upload } = require('../utils/cloudinary');

// Auth middleware
const authCheck = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'Unauthorized'
    });
  }
  next();
};

// Profile image upload route
router.post('/upload-image', authCheck, async (req, res) => {
  try {
    // Use direct cloudinary upload for better error handling
    upload.single('profileImage')(req, res, async function(err) {
      if (err) {
        console.error('Multer/Cloudinary Error:', err);
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      }

      // Check if file was provided
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      console.log('File uploaded successfully to Cloudinary:', req.file);

      try {
        // Get the image URL from Cloudinary
        const imageUrl = req.file.path; // Ensure this is the correct property for your setup

        console.log('Image URL from Cloudinary:', imageUrl);

        // Update user profile with image URL
        const userId = req.user.id || req.user._id;
        
        console.log('Updating user with ID:', userId);
        
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profileImage: imageUrl },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        console.log('User updated successfully with new profile image');

        // Return success with image URL
        res.status(200).json({
          success: true,
          message: 'Profile image uploaded successfully',
          imageUrl: imageUrl
        });
      } catch (dbError) {
        console.error('Database Error:', dbError);
        res.status(500).json({
          success: false,
          message: 'Failed to update user profile with new image'
        });
      }
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred during image upload'
    });
  }
});

// Update profile information
router.patch('/update', authCheck, async (req, res) => {
  try {
    const { location, currentCompany, currentCompanyRole, personalEmail, socialLinks } = req.body;
    
    // Build update object
    const updateData = {};
    if (location) updateData.location = location;
    if (currentCompany !== undefined) updateData.currentCompany = currentCompany;
    if (currentCompanyRole !== undefined) updateData.currentCompanyRole = currentCompanyRole;
    if (personalEmail !== undefined) updateData.personalEmail = personalEmail;
    if (socialLinks) updateData.socialLinks = socialLinks;

    // Update user in database
    const userId = req.user.id || req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports = router;