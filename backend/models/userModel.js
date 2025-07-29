const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: false, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
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
module.exports = User;

