const { getQuestions, addQuestion } = require('../data/questions/questions.data');

// add a new question
async function addNewQuestion(req, res) {
    try {
        const url = req.originalUrl;
        const question = req.body;

        if (!question) {
            return res.status(400).json({ message: 'Question data is required' });
        }

        if (url.includes('/published')) {
            question.status = 'published';
        }


        const newQuestion = await addQuestion(question);
        return res.status(201).json(newQuestion);
    } catch {
        console.error('Error fetching questions:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// get all the question
async function getAllQuestions(req, res) {
    try {
        const url = req.originalUrl;

        let questions = '';

        questions = await getQuestions('published');

        if (url.includes('/draft')) {
            questions = await getQuestions(url.split('/').pop());
        }
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    getAllQuestions,
    addNewQuestion
};