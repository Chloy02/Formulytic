const Questionnaire = require('../../models/questions/question.schema');

// Add question
async function addQuestion(question) {
    if (!question) {
        throw new Error('Question is required');
    }
    return await Questionnaire.create(question);
}

async function getQuestion(state) {
    return await Questionnaire.find({ status: state || 'published' })
        .lean()
        .select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
}

async function getQuestions() {
    return await Questionnaire.find({})
        .lean()
        .select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0, sections: 0, createdBy: 0 });
}

async function getQuestionById(id) {
    return await Questionnaire.find({ questionnaireID: id })
}

module.exports = {
    addQuestion,
    getQuestion,
    getQuestions,
    getQuestionById,
}