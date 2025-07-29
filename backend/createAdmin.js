// Script to create hardcoded admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: false },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  project: {
    type: String,
    enum: ['project1', 'project2', 'admin'],
    required: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin' },
        { username: 'admin' }
      ],
      role: 'admin' 
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      email: 'admin@formulytic.com',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      project: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully:', {
      email: adminUser.email,
      username: adminUser.username,
      role: adminUser.role,
      project: adminUser.project
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
