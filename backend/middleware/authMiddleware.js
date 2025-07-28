const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth header:', authHeader);
  
  if (!authHeader) return res.status(401).json({ message: 'No token, access denied' });

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  console.log('Extracted token:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(400).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  console.log('isAdmin middleware called');
  console.log('req.user:', JSON.stringify(req.user, null, 2));
  console.log('req.user.role:', req.user?.role);
  console.log('typeof req.user.role:', typeof req.user?.role);
  console.log('req.user.role === "admin":', req.user?.role === 'admin');
  
  if (req.user.role !== 'admin') {
    console.log('Access denied: user is not admin');
    return res.status(403).json({ message: 'Admins only!' });
  }
  console.log('Admin access granted');
  next();
};

module.exports = { verifyToken, isAdmin };
