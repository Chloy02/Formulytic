const express = require('express');
const router = express.Router();
const {
  submitResponse,
  getAllResponses,
  getResponseById,
} = require('../controllers/responseController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, submitResponse);
router.get('/', verifyToken, getAllResponses);
router.get('/:id', verifyToken, getResponseById);

module.exports = router;
