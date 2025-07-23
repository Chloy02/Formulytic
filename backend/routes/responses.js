const express = require('express');
const router = express.Router();
const Response = require('../models/responseModel'); // Adjust the path if needed

/**
 * @route   POST /api/responses
 * @desc    Create a new survey response
 * @access  Public
 */
router.post('/', async (req, res) => {
  // Destructure the expected fields from the request body for clarity
  const { submittedBy, answers } = req.body;

  // Basic check to ensure the required top-level fields are present
  if (!submittedBy || typeof submittedBy !== 'string' || submittedBy.trim() === '' ||
      !answers || typeof answers !== 'object' || Array.isArray(answers) || Object.keys(answers).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input: submittedBy must be a non-empty string and answers must be a non-empty object.',
    });
  }
  try {
    // Create a new Response document using the provided data
    // Mongoose will automatically validate the entire nested 'answers' object against your schema
    const newResponse = new Response({
      submittedBy,
      answers,
    });

    // Save the validated document to the database
    const savedResponse = await newResponse.save();

    // Create a filtered version of the response with only safe fields
    const safeResponse = {
      id: savedResponse._id,
      submittedBy: savedResponse.submittedBy,
      answers: savedResponse.answers,
      status: savedResponse.status,
      submittedAt: savedResponse.createdAt
    };

    // Respond with a 201 (Created) status and only the safe data
    res.status(201).json({
      success: true,
      message: 'Response submitted successfully!',
      data: safeResponse,
    });

  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      console.error('Validation Error:', error.message);
      // Create a clean list of validation errors to send to the client
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed. Please check your data.',
        messages: errors,
      });
    }

    // Handle other potential server errors
    console.error('Server Error:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred on the server.',
    });  }
});

module.exports = router;