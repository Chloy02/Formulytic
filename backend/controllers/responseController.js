const Response = require('../models/responseModel');
const responseSchema = require('../routes/responseSchema');

/**
 * =================================================================
 * SUBMIT A NEW RESPONSE
 * @route   POST /api/responses
 * @desc    Allows a logged-in user to submit their completed form.
 * @access  Private (requires user login)
 * =================================================================
 */
exports.submitResponse = async (req, res) => {
  try {
    // Validate answers against responseSchema
    const { error } = responseSchema.validate(req.body.answers);
    if (error) {
      return res.status(400).json({ message: 'Validation failed', details: error.details });
    }
    const response = await Response.create({
      submittedBy: req.user.id, // Changed from _id to id
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
    console.log('Save draft request body:', JSON.stringify(req.body, null, 2));
    console.log('User object from token:', req.user);
    console.log('User ID:', req.user.id); // Changed from _id to id
    
    // Check if user already has a draft
    let draft = await Response.findOne({ 
      submittedBy: req.user.id, // Changed from _id to id
      status: 'draft' 
    });

    if (draft) {
      // Update existing draft
      draft.answers = req.body.answers;
      draft.lastSaved = new Date();
      await draft.save();
      console.log('Draft updated successfully');
    } else {
      // Create new draft
      draft = await Response.create({
        submittedBy: req.user.id, // Changed from _id to id
        answers: req.body.answers,
        status: 'draft'
      });
      console.log('New draft created successfully');
    }
    
    res.status(201).json({ message: 'Draft saved', response: draft });
  } catch (err) {
    console.error('Error saving draft:', err);
    console.error('Error details:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getDraft = async (req, res) => {
  try {
    const draft = await Response.findOne({ 
      submittedBy: req.user.id, // Changed from _id to id
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

/**
 * =================================================================
 * GET A SINGLE RESPONSE (FOR ADMINS)
 * @route   GET /api/responses/:id
 * @desc    Fetches the full details of one specific submission.
 * @access  Private (Admin only)
 * =================================================================
 */
exports.getResponseById = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    // Find a single response by its unique MongoDB document ID (_id).
    const response = await Response.findById(req.params.id).populate('submittedBy', 'username role');

    // If no response is found with that ID.
    if (!response) {
      return res.status(404).json({ success: false, message: 'Response not found.' });
    }

    res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching the response.',
    });
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
