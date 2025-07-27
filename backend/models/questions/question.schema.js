const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Question Info Schema
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

// Section Schema
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

// Color Sub-Schema
const colorSchema = new mongoose.Schema({
  shade: {
    type: String,
    required: true, 
  },
  intensity: {
    type: Number,
    required: true, 
  },
}, { _id: false }); 


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
  color: {
    type: colorSchema,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  sections: {
    type: [sectionSchema],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-increment plugin for questionnaireID
questionnaireSchema.plugin(AutoIncrement, { inc_field: 'questionnaireID' });

module.exports = mongoose.model('Questionnaire', questionnaireSchema);
