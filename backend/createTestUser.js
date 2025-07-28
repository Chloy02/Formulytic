const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
require('dotenv').config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@formulytic.com' });
    if (existingUser) {
      console.log('Test user already exists');
      console.log('Email: test@formulytic.com');
      console.log('Password: test123');
      console.log('Project:', existingUser.project);
      process.exit(0);
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    const testUser = new User({
      email: 'test@formulytic.com',
      password: hashedPassword,
      role: 'user',
      project: 'project1'
    });

    await testUser.save();
    console.log('Test user created successfully');
    console.log('Email: test@formulytic.com');
    console.log('Password: test123');
    console.log('Project: project1');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
