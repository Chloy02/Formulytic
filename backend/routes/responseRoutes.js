const express = require('express');
const router = express.Router();
const {
  submitResponse,
  getAllResponses,
  getResponseById,
} = require('../controllers/responseController');

const auth = require('../middleware/authMiddleware');

router.post('/responses', auth, submitResponse);
router.get('/responses', auth, getAllResponses);
router.get('/responses/:id', auth, getResponseById);

module.exports = router;
