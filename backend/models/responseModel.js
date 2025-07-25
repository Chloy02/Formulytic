const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  responseId: {
    type: String,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['draft', 'submitted'],
    default: 'draft'
  },
  lastSaved: {
    type: Date,
    default: Date.now,
  },
  answers: {
    type: Map,
  },
});

module.exports = mongoose.model('Response', responseSchema);
