const Response = require('../models/responseModel');

exports.submitResponse = async (req, res) => {
  try {
    const response = await Response.create({
      submittedBy: req.user._id,
      answers: req.body.answers,
    });
    res.status(201).json({ message: 'Response submitted', response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllResponses = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const responses = await Response.find().populate('submittedBy', 'username');
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResponseById = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const response = await Response.findById(req.params.id).populate('submittedBy', 'username');
    if (!response) return res.status(404).json({ message: 'Not found' });
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
