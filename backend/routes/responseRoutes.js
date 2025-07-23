const express = require('express');
const router = express.Router();

// Import the controller functions you just wrote.
const {
  submitResponse,
  saveDraft,
  getDraft,
  getAllResponses,
  getResponseById,
  deleteResponse,
} = require('../controllers/responseController');
const { verifyToken } = require('../middleware/authMiddleware');

<<<<<<< HEAD
// Import the middleware from Ajin's part.
// 'auth' checks if a user is logged in.
// 'adminAuth' checks if the logged-in user has the 'admin' role.
const { auth, adminAuth } = require('../middleware/authMiddleware');

// === DEFINE YOUR ROUTES ===
=======
router.post('/', verifyToken, submitResponse);
router.post('/draft', verifyToken, saveDraft);
router.get('/draft', verifyToken, getDraft);
router.get('/', verifyToken, getAllResponses);
router.get('/:id', verifyToken, getResponseById);
router.delete('/:id', verifyToken, deleteResponse);
>>>>>>> main

// 1. Submit Response Endpoint
// This route is protected by the 'auth' middleware.
// A user must be logged in to submit a form.
router.post('/', auth, submitResponse);

// 2. Get All Responses Endpoint (Admin Only)
// This route is protected by both 'auth' and 'adminAuth' middleware.
// A user must be logged in AND have the role of 'admin'.
router.get('/', [auth, adminAuth], getAllResponses);

// 3. Get Single Response Endpoint (Admin Only)
// This is also protected for admins only.
router.get('/:id', [auth, adminAuth], getResponseById);


module.exports = router;