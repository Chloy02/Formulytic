const express = require('express');
const router = express.Router();
const {
  submitResponse,
  saveDraft,
  getDraft,
  getAllResponses,
  getResponseById,
  deleteResponse,
} = require('../controllers/responseController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, submitResponse);
router.post('/draft', verifyToken, saveDraft);
router.get('/draft', verifyToken, getDraft);
router.get('/', verifyToken, getAllResponses);
router.get('/:id', verifyToken, getResponseById);
router.delete('/:id', verifyToken, deleteResponse);

module.exports = router;
