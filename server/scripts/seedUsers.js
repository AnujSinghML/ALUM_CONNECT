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
    },
    personalEmail: 'anujsanjaysinghwork@gmail.com'
  },
  {
    name: 'Vasu Parashar',
    email: 'bt22csd021@iiitn.ac.in',
    password: 'vasu123!', 
    role: 'student',
    dob: new Date('2004-08-18'),
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
    },
    personalEmail: null
  },
  {
    name: 'Amit Yadav',
    email: 'bt20ece001@iiitn.ac.in',
    password: 'amit123!',
    role: 'alumni',
    dob: new Date('2002-06-20'),
    branch: 'Electronics and Communication Engineering ',
    currentCompany: 'OceanGate',
    currentCompanyRole: 'SDE-1',
    location: 'Pune',
    batch: '2020',
    homeTown: 'Haryana',
    socialLinks: {
      linkedin: 'https://www.linkedin.com',
      instagram: 'https://www.instagram.com',
      github: '',
      x: 'https://x.com/'
    },
    personalEmail: null
  },
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
      instagram: 'https://www.instagram.com',
      github: '',
      x: 'https://x.com/'
    },
    personalEmail: null
  },
  // Add additional alumni/users here as needed...
  {
    name: 'Ashok Tripathi',
    email: 'bt20cse001@iiitn.ac.in',
    password: 'ashok123!',
    role: 'alumni',
    dob: new Date('2002-06-03'),
    branch: 'Computer Science',
    currentCompany: 'Amazon',
    currentCompanyRole: 'SWE',
    location: 'Banglore',
    batch: '2020',
    homeTown: 'Mumbai',
    socialLinks: {
      linkedin: 'https://www.linkedin.com',
      instagram: 'https://www.instagram.com',
      github: 'https://github.com/',
      x: null
    },
    personalEmail: null
  },
  {
    name: 'Simran Ahuja',
    email: 'bt20cse002@iiitn.ac.in',
    password: 'simran123!',
    role: 'alumni',
    dob: new Date('2002-07-21'),
    branch: 'Computer Science',
    currentCompany: 'Flipkart',
    currentCompanyRole: 'SDE - 1',
    location: 'Banglore',
    batch: '2020',
    homeTown: 'Delhi',
    socialLinks: {
      linkedin: '',
      instagram: 'https://www.instagram.com',
      github: 'https://github.com/',
      x: null
    },
    personalEmail: null
  },
  {
    name: 'Rudransh Singh',
    email: 'bt19cse001@iiitn.ac.in',
    password: 'rudransh123!',
    role: 'alumni',
    dob: new Date('2000-08-01'),
    branch: 'Computer Science',
    currentCompany: 'Google',
    currentCompanyRole: 'SDE - 2',
    location: 'Banglore',
    batch: '2019',
    homeTown: 'Lucknow',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/',
      instagram: 'https://www.instagram.com',
      github: 'https://github.com/',
      x: null
    },
    personalEmail: null
  },
  {
    name: 'Rashmi Singhania',
    email: 'bt19cse002@iiitn.ac.in',
    password: 'rashmi123!',
    role: 'alumni',
    dob: new Date('2000-06-21'),
    branch: 'Computer Science',
    currentCompany: 'Flipkart',
    currentCompanyRole: 'SDE - 2',
    location: 'Hyderabad',
    batch: '2019',
    homeTown: 'Hyderabad',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/',
      instagram: 'https://www.instagram.com',
      github: 'https://github.com/',
      x: null
    },
    personalEmail: null
  },
  {
    name: 'Amir Shaikh',
    email: 'bt18cse001@iiitn.ac.in',
    password: 'amir123!',
    role: 'alumni',
    dob: new Date('1999-09-20'),
    branch: 'Computer Science',
    currentCompany: 'Mercedes',
    currentCompanyRole: 'ML Engineer',
    location: 'Germany',
    batch: '2019',
    homeTown: 'Mumbai',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/',
      instagram: 'https://www.instagram.com/',
      github: 'https://github.com/',
      x: 'https://x.com/'
    },
    personalEmail: null
  },
];


const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    // Step 1: Delete all existing user documents
    await User.deleteMany({});
    console.log('All existing users deleted');
    
    // Step 2: Create each user individually to trigger the pre-save hook
    // that will hash the passwords automatically
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Added user: ${userData.email}`);
    }
    
    console.log(`${users.length} users successfully added to the database`);
    
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed after error');
    }
    process.exit(1);
  }
};

// Run seeder
seedUsers();
