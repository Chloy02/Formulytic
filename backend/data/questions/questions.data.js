const Questionnaire = require('../schema/question.schema');

// Add question
async function addQuestion(question) {
    if (!question) {
        throw new Error('Question is required');
    }
    return await Questionnaire.create(question);
}

async function getQuestions(state) {
    return await Questionnaire.find({status: state || 'published'})
        .lean()
        .select({_id: 0, __v: 0, createdAt: 0, updatedAt: 0});
}


module.exports = {
    addQuestion,
    getQuestions,
}