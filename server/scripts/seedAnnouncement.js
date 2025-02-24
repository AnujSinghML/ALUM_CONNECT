const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Announcement = require('../models/Announcement');
const { cloudinary } = require('../utils/cloudinary'); // Ensure correct path

dotenv.config();
console.log("Mongo URI:", process.env.MONGO_URI); 
const seedAnnouncements = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Delete existing announcements
    await Announcement.deleteMany({});
    console.log('Cleared existing announcements');

    console.log("Cloudinary Keys:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


    // Upload a sample event image to Cloudinary
    const eventImageResponse = await cloudinary.uploader.upload(
      'https://picsum.photos/800/600', // Random event image from Unsplash
      { folder: 'announcements' }
    );

    const achievementImageResponse = await cloudinary.uploader.upload(
      'https://picsum.photos/200/200', // Random profile image from Unsplash
      { folder: 'announcements' }
    );

    // Define sample announcements
    const announcements = [
  {
    name: "Tech Conference",  // ✅ Add this field
    type: 'event',
    title: 'Tech Conference 2025',
    description: 'Join us for an amazing tech conference featuring top industry experts!',
    imageUrl: eventImageResponse.secure_url,
  },
  {
    name: "Rahul Sharma Achievement",  // ✅ Add this field
    type: 'achievement',
    title: 'Student Achievement',
    description: 'Rahul Sharma won the Best Innovator Award in AI!',
    imageUrl: achievementImageResponse.secure_url,
  }
];


    // Insert into DB
    const createdAnnouncements = await Announcement.create(announcements);
    console.log('Created announcements:', createdAnnouncements);

    // Close DB connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding announcements:', error);
    process.exit(1);
  }
};

seedAnnouncements();
