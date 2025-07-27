const router = require('express').Router();
const { getAllQuestions, getQuestionByIndex, addNewQuestion } = require('../controllers/questions.controler');

router.get('/', getAllQuestions);
router.get('/:id', getAllQuestions);
router.get('/id/:index', getQuestionByIndex);
router.post('', addNewQuestion);
router.post('/published', addNewQuestion);

module.exports = router;