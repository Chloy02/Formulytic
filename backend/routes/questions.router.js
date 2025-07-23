const router = require('express').Router();
const { getAllQuestions, addNewQuestion } = require('../controllers/questions.controler');

router.get('/',getAllQuestions);
router.get('/:id',getAllQuestions);
router.post('', addNewQuestion);
router.post('/published', addNewQuestion);

module.exports = router;