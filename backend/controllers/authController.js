const User = require('../models/userModel');
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
    const { username, password, email, role } = req.body;

    // Validation
    const errors = {};

    // Name (username) validation
    if (!username || username.trim().length === 0) {
      errors.name = 'Name is required.';
    } else if (username.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    // Email validation
    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format.';
    } else if (!email.toLowerCase().endsWith('@gmail.com')) {
      errors.email = 'Please use a Gmail address (@gmail.com).';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }

    const existing = await getUserInfo(username);
    const existingByEmail = await User.findOne({ email });
    
    if (existing) {
      return res.status(400).json({ 
        message: 'User already exists',
        errors: { name: 'A user with this name already exists.' }
      });
    }

    if (existingByEmail) {
      return res.status(400).json({ 
        message: 'User already exists',
        errors: { email: 'An account with this email already exists.' }
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username: username.trim(), 
      password: hashed, 
      email,
      role: role || 'user' // Default to 'user' if no role specified
    });

    const data = await saveUserInfo(newUser);

    const token = generateToken(data._id, data.role);

    res.status(data ? 201 : 400).json(data ? { message: 'Account created successfully!', token } : { message: 'Registration failed' });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ 
      message: 'Server error occurred. Please try again.',
      error: 'Server error' 
    });
  }
};

async function login(req, res) {
  try {
    const { email, password } = req.body; // Changed to expect email instead of username

    // Hardcoded admin check
    if (email === 'admin@formulytic.com' && password === 'admin123') {
      const token = generateToken('admin_hardcoded', 'admin');
      const userData = {
        id: 'admin_hardcoded',
        username: 'admin',
        email: 'admin@formulytic.com',
        role: 'admin'
      };
      return res.status(200).json({ token, user: userData });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with provided credentials' });
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