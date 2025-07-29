const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

// Import the User model from frontend
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  project: {
    type: String,
    enum: ['project1', 'project2'],
    required: true
  }
}, {
  timestamps: true
});

async function testUserCreation() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Test creating a user
    const testUser = {
      email: 'test@example.com',
      password: 'hashedpassword123',
      role: 'user',
      project: 'project1'
    };
    
    console.log('🧪 Testing user creation with:', testUser);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('🗑️  Removing existing test user...');
      await User.deleteOne({ email: testUser.email });
    }
    
    // Create new user
    const newUser = new User(testUser);
    await newUser.save();
    
    console.log('✅ User created successfully:', newUser._id);
    
    // Clean up
    await User.deleteOne({ email: testUser.email });
    console.log('🧹 Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing user creation:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      keyValue: error.keyValue
    });
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testUserCreation();
