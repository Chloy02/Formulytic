const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Qustions Information Schema
const questionInfoSchema = new mongoose.Schema({
    questionID: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    questionType: {
        type: String,
        required: true,
        enum: ['text', 'multiple-choice', 'checkbox', 'rating', 'number', 'date'],
    },
    options: {
        type: [String],
        default: [],
    },
});

// Section
const sectionSchema = new mongoose.Schema({
    sectionTitle: {
        type: String,
        required: true,
    },
    sectionDescription: {
        type: String,
        required: true,
    },
    questions: [questionInfoSchema],
});

// Questionnaire Schema
const questionnaireSchema = new mongoose.Schema({
    questionnaireID: {
        type: Number,
        unique: true,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
    questionnaireTitle: {
        type: String,
        required: true,
    },
    questionnaireDescription: {
        type: [String],
        required: true,
    },
    sections: [sectionSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

questionnaireSchema.plugin(AutoIncrement, { inc_field: 'questionnaireID' });

module.exports = mongoose.model('Questionnaire', questionnaireSchema);
