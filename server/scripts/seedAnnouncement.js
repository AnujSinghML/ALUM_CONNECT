const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Announcement = require('../models/Announcement');
const { cloudinary } = require('../utils/cloudinary');

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

    // Upload event images to Cloudinary
    const eventImageResponses = [];
    for (let i = 0; i < 7; i++) {
      const response = await cloudinary.uploader.upload(
        `https://picsum.photos/800/600?random=${i}`, // Random event images
        { folder: 'announcements/events' }
      );
      eventImageResponses.push(response);
    }

    // Upload achievement images to Cloudinary
    const achievementImageResponses = [];
    for (let i = 0; i < 7; i++) {
      const response = await cloudinary.uploader.upload(
        `https://picsum.photos/200/200?random=${i}`, // Random profile images
        { folder: 'announcements/achievements' }
      );
      achievementImageResponses.push(response);
    }

    // Define sample events
    const events = [
      {
        name: "Tech Conference",
        type: 'event',
        title: 'Tech Conference 2025',
        description: 'Join us for an amazing tech conference featuring top industry experts!',
        imageUrl: eventImageResponses[0].secure_url,
      },
      {
        name: "Alumni Meetup",
        type: 'event',
        title: 'Annual Alumni Meetup',
        description: 'Connect with your batch mates and seniors at our annual alumni gathering.',
        imageUrl: eventImageResponses[1].secure_url,
      },
      {
        name: "Hackathon",
        type: 'event',
        title: 'Code For Change Hackathon',
        description: '48-hour coding challenge to solve real-world problems. Exciting prizes to be won!',
        imageUrl: eventImageResponses[2].secure_url,
      },
      {
        name: "Career Fair",
        type: 'event',
        title: 'Campus Placement Drive',
        description: 'Top companies will be visiting our campus for recruitment. Register now!',
        imageUrl: eventImageResponses[3].secure_url,
      },
      {
        name: "Workshop",
        type: 'event',
        title: 'AI & Machine Learning Workshop',
        description: 'Learn the fundamentals of AI and ML from industry professionals.',
        imageUrl: eventImageResponses[4].secure_url,
      },
      {
        name: "Cultural Fest",
        type: 'event',
        title: 'Annual Cultural Festival',
        description: 'Three days of music, dance, and fun activities. Don\'t miss out!',
        imageUrl: eventImageResponses[5].secure_url,
      },
      {
        name: "Research Symposium",
        type: 'event',
        title: 'International Research Symposium',
        description: 'Present your research work and get feedback from experts in your field.',
        imageUrl: eventImageResponses[6].secure_url,
      }
    ];

    // Define sample achievements
    const achievements = [
      {
        name: "Rahul Sharma",
        type: 'achievement',
        title: 'Best Innovator Award',
        description: 'Won the Best Innovator Award in AI at the National Technology Summit.',
        imageUrl: achievementImageResponses[0].secure_url,
      },
      {
        name: "Priya Patel",
        type: 'achievement',
        title: 'Research Publication',
        description: 'Published a paper in IEEE on advanced machine learning algorithms.',
        imageUrl: achievementImageResponses[1].secure_url,
      },
      {
        name: "Amit Kumar",
        type: 'achievement',
        title: 'Startup Success',
        description: 'Raised $2 million in seed funding for his education technology startup.',
        imageUrl: achievementImageResponses[2].secure_url,
      },
      {
        name: "Neha Singh",
        type: 'achievement',
        title: 'International Scholarship',
        description: 'Received a full scholarship to pursue PhD at MIT.',
        imageUrl: achievementImageResponses[3].secure_url,
      },
      {
        name: "Vikram Reddy",
        type: 'achievement',
        title: 'Coding Competition Winner',
        description: 'Secured first place in the International Coding Olympiad.',
        imageUrl: achievementImageResponses[4].secure_url,
      },
      {
        name: "Ananya Desai",
        type: 'achievement',
        title: 'Research Grant',
        description: 'Received a prestigious grant for research in renewable energy.',
        imageUrl: achievementImageResponses[5].secure_url,
      },
      {
        name: "Rajesh Gupta",
        type: 'achievement',
        title: 'Corporate Excellence',
        description: 'Promoted to CTO at a Fortune 500 company at the age of 35.',
        imageUrl: achievementImageResponses[6].secure_url,
      }
    ];

    // Combine events and achievements
    const announcements = [...events, ...achievements];

    // Insert into DB
    const createdAnnouncements = await Announcement.create(announcements);
    console.log(`Created ${createdAnnouncements.length} announcements`);

    // Close DB connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding announcements:', error);
    process.exit(1);
  }
};

seedAnnouncements();
