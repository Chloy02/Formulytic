const Response = require('../models/responseModel');

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
    // The request body will contain the large 'answers' object.
    const { answers } = req.body;

    // Create a new response document.
    // The 'submittedBy' ID comes from the JWT token after the user logs in.
    // The auth middleware (from Ajin) will add the user object to the request (req.user).
    const newResponse = new Response({
      submittedBy: req.user.id,
      answers,
    });

    // Save the new response to the database.
    const savedResponse = await newResponse.save();

    // Send a success confirmation back to the frontend.
    res.status(201).json({
      success: true,
      message: 'Response submitted successfully!',
      data: savedResponse,
    });

  } catch (error) {
    // Handle potential validation errors from the Mongoose schema.
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check the submitted data.',
        errors: error.errors,
      });
    }
    
    // Handle other server-side errors.
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving the response.',
    });
  }
};

/**
 * =================================================================
 * GET ALL RESPONSES (FOR ADMINS)
 * @route   GET /api/responses
 * @desc    Fetches a list of all submissions for the admin dashboard.
 * @access  Private (Admin only)
 * =================================================================
 */
exports.getAllResponses = async (req, res) => {
  try {
    // Fetch all documents from the 'responses' collection.
    // .populate() will replace the 'submittedBy' ID with the user's username.
    const responses = await Response.find().populate('submittedBy', 'username role');

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses,
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching responses.',
    });
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