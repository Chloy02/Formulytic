const { getQuestions, getQuestionById, getQuestion, addQuestion } = require('../data/questions/questions.data');

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
    } catch (error) {
        console.error('Error fetching questions:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// get all the question
async function getAllQuestions(req, res) {
    try {
        const url = req.originalUrl;

        let questions = '';
        console.log('Fetching questions from URL:', url);

        questions = await getQuestion('published');

        console.log('Fetching questions from URL:', url);

        if (url.includes('/draft')) {
            questions = await getQuestion(url.split('/').pop());
        }
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// // get only question info not any description
// async function getAllQuestions(req, res) {
//     try {
//         const question = await getQuestions();

//         return res.status(200).json(question);
//     } catch (err) {
//         console.error('Error fetching questions:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// }

async function getQuestionByIndex(req, res) {
    try {
        const url = req.url.split('/').pop();
        const question = await getQuestionById(url);
        console.log('URL is', url, ' ', question);

        return res.status(200).json(question);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    // getAllQuestion,
    addNewQuestion,
    getAllQuestions,
    getQuestionByIndex,
};