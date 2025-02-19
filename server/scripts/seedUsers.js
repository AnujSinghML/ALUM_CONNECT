const mongoose = require('mongoose');
const User = require('../models/users');
const dotenv = require('dotenv');

dotenv.config();

const users = [
  {
    name: 'Anuj Sanjay Singh',
    email: 'bt22cse113@iiitn.ac.in',
    password: 'anuj123!',
    role: 'student',
    dob: new Date('2003-08-08'),
    branch: 'Computer Science',
    currentCompany: 'IIIT-N',
    location: 'Nagpur',
    batch: '2022',
    homeTown: 'Mumbai',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/anujsanjaysingh/',
      instagram: 'https://www.instagram.com/glockholm',
      github: 'https://github.com/AnujSinghML',
      x: 'https://x.com/anujsingh_08?t=iZX1epaBvzYhjavy1_nIIw&s=09'
    }
  },
  {
    name: 'Vashu Prashar',
    email: 'bt22csd021@iiitn.ac.in',
    password: 'vashu123!', 
    role: 'student',
    dob: new Date('2004-08-16'),
    branch: 'Computer Science - Data Science',
    currentCompany: null,
    currentCompanyRole: '',
    location: 'Nagpur',
    batch: '2022',
    homeTown: 'Saharanpur,UP',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/vashuprashar',
      instagram: 'https://www.instagram.com/vashuprashar',
      github: 'https://github.com/vashuprashar',
      x: null
    }
  },
  {
    name: 'Amit Yadav',
    email: 'bt21ece000@iiitn.ac.in',
    password: 'amit123!',
    role: 'alumni',
    dob: new Date('2002-06-20'),
    branch: 'Computer Science - Data Science',
    currentCompany: 'OceanGate',
    currentCompanyRole: 'SDE-1',
    location: 'Pune',
    batch: '2021',
    homeTown: 'Haryana',
    socialLinks: {
      linkedin: '',
      instagram: '',
      github: '',
      x: null
    }
  },
  // Add additional users similarly...
  {
    name: 'Admin1',
    email: 'admin@boom.com',
    password: 'admin123!',
    role: 'admin',
    dob: new Date('1990-01-01'),
    branch: 'Administration',
    currentCompany: 'Indian Institute of Information Technology Nagpur',
    location: 'Delhi',
    batch: 'N/A',
    homeTown: 'Delhi',
    socialLinks: {
      linkedin: '',
      instagram: '',
      github: '',
      x: ''
    }
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users
    const createdUsers = await User.create(users);
    console.log('Created users:', createdUsers.map(user => user.email));

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedUsers();
