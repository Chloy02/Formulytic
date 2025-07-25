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
  getAllResponsesAdmin,
} = require('../controllers/responseController');
// Import authentication middleware
const { verifyToken } = require('../middleware/authMiddleware');

// Define routes with verifyToken middleware
router.get('/', verifyToken, getAllResponses);
router.post('/', verifyToken, submitResponse);
router.post('/draft', verifyToken, saveDraft);
router.get('/draft', verifyToken, getDraft);
router.get('/:id', verifyToken, getResponseById);
router.delete('/:id', verifyToken, deleteResponse);

router.get('/', getAllResponsesAdmin);

module.exports = router;