const User = require('../models/userModel');
// const { User, createUser } = require('../mockData'); // Temporary mock data
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  getUserInfo,
  saveUserInfo,
  getUserDetails,
} = require('../data/user/user.data');

function generateToken(id, role) {
  const data = jwt.sign(
    { id: id, role: role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return data;
}

async function register(req, res) {
  try {
    const { username, password, email } = req.body;

    const existing = await getUserInfo(username);
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed, email });

    const data = await saveUserInfo(newUser);

    const token = generateToken(data._id, data.role);

    res.status(data ? 201 : 400).json(data ? { message: 'Registered successfully', token } : { message: 'Registered unsuccessfully' });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Allow login with either username or email
    const user = await getUserInfo(username, 1);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    return res.status(200).json({ token, user: userData });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET api/auth/me
// @desc    Get current user's data
// @access  Private
async function getMe(req, res) {
  try {
    // req.user is attached by the auth middleware
    const id = req.user.id;

    if (!id) {
      res.status(400).json({ message: "Login" });
    }

    const user = await getUserDetails(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  register,
  login,
  getMe,
}