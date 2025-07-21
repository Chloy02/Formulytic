const Response = require('../models/responseModel');

exports.submitResponse = async (req, res) => {
  try {
    const response = await Response.create({
      submittedBy: req.user._id,
      answers: req.body.answers,
      status: 'submitted'
    });
    res.status(201).json({ message: 'Response submitted', response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveDraft = async (req, res) => {
  try {
    // Check if user already has a draft
    let draft = await Response.findOne({ 
      submittedBy: req.user._id, 
      status: 'draft' 
    });

    if (draft) {
      // Update existing draft
      draft.answers = req.body.answers;
      draft.lastSaved = new Date();
      await draft.save();
    } else {
      // Create new draft
      draft = await Response.create({
        submittedBy: req.user._id,
        answers: req.body.answers,
        status: 'draft'
      });
    }
    
    res.status(201).json({ message: 'Draft saved', response: draft });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDraft = async (req, res) => {
  try {
    const draft = await Response.findOne({ 
      submittedBy: req.user._id, 
      status: 'draft' 
    });
    
    if (!draft) {
      return res.status(404).json({ message: 'No draft found' });
    }
    
    res.json(draft);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllResponses = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const responses = await Response.find({ status: 'submitted' }).populate('submittedBy', 'username');
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

exports.deleteResponse = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const response = await Response.findByIdAndDelete(req.params.id);
    if (!response) return res.status(404).json({ message: 'Response not found' });
    res.json({ message: 'Response deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
