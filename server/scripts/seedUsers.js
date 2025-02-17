// scripts/seedUsers.js
const mongoose = require('mongoose');
const User = require('../models/users');
const dotenv = require('dotenv');

dotenv.config();

const users = [
 {
    name: 'Anuj Sanjay Singh',
    email: 'bt22cse113@iiitn.ac.in',
    password: 'anuj123!',
    role: 'student'
  },
  {
    name: 'Vashu Prashar',
    email: 'bt22csd021@iiitn.ac.in',
    password: 'vashu123!',
    role: 'student'
  },
  {
    name: 'Ankush Amritosh Jha',
    email: 'bt22csh023@iiitn.ac.in',
    password: 'ankush123!',
    role: 'student'
  },
  {
    name: 'Mohammed Tabish Sohail',
    email: 'bt22cse050@iiitn.ac.in',
    password: 'tabish123!',
    role: 'student'
  },
  {
    name: 'Amit Yadav',
    email: 'bt21ece000@iiitn.ac.in',
    password: 'amit123!',
    role: 'alumni'
  },
  {
    name: 'Admin1',
    email: 'admin@boom.com',
    password: 'admin123!',
    role: 'admin'
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