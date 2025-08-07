const Response = require('../models/responseModel');
const responseSchema = require('../routes/responseSchema');
const { preventDuplicateDrafts } = require('../cleanupDrafts');

const {
  createResponse,
  getResponse,
  getUserResponseWithID,
  getSavedDraft,
  updateUserDraft,
  getAllResponsesFromDB,
  saveDraftToDB,
  deleteResponse: deleteResponseFromDB,
} = require('../data/response/response.data');

/**
 * ================================================================
 * SUBMIT A NEW RESPONSE
 * @route   POST /api/responses
 * @desc    Allows a logged-in user to submit their completed form.
 * @access  Private (requires user login)
 * ================================================================
 */
const submitResponse = async (req, res) => {
  try {
    const answers = req.body.answers;
    const responseId = req.body.responseId;

    const { error } = responseSchema.validate(answers);

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.details,
      });
    }

    const data = {
      responseId,
      submittedBy: req.user.id,
      answers: answers,
      status: 'submitted',
    };

    const response = await createResponse(data);

    return res.status(201).json({ message: 'Response submitted', response });
  } catch (err) {
    console.error("Error is: ", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * ================================================================
 * SAVE A DRAFT
 * @route   POST /api/responses/draft
 * @desc    Save or update user's draft answers.
 * @access  Private
 * ================================================================
 */
const saveDraft = async (req, res) => {
  try {
    const userID = req.user.id;
    const userLatestResponse = req.body.answers;
    let responseID = req.body.responseId;

    console.log("user ID: " + userID);

    if (!userLatestResponse || !userID) {
      return res.status(400).json({ message: 'User response not provided.' });
    }

    // Use the prevention utility to ensure only one draft exists
    const existingDraft = await preventDuplicateDrafts(userID);

    if (existingDraft) {
      // Update existing draft
      const updateData = {
        answers: userLatestResponse,
        lastSaved: new Date(),
        responseId: responseID || existingDraft.responseId // Preserve or update responseId
      };
      
      await updateUserDraft(userID, updateData);
      console.log("Existing draft updated for user:", userID);
      
      // Return the updated draft
      const updatedDraft = await getSavedDraft(userID);
      return res.status(201).json({ 
        message: 'Draft updated successfully', 
        response: updatedDraft[0] 
      });

    } else {
      // Create new draft (only if user has no existing draft)
      if (!responseID) {
        responseID = `draft_${userID}_${Date.now()}`;
      }

      const newDraftData = {
        responseId: responseID,
        submittedBy: userID,
        answers: userLatestResponse,
        status: 'draft',
        lastSaved: new Date()
      };
      
      const draft = await saveDraftToDB(newDraftData);
      console.log("New draft created for user:", userID);
      
      return res.status(201).json({ 
        message: 'Draft saved successfully', 
        response: draft 
      });
    }
  } catch (err) {
    console.error('Error saving draft:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * ================================================================
 * GET DRAFT
 * @route   GET /api/responses/draft
 * @desc    Retrieve a user's draft
 * @access  Private
 * ================================================================
 */
const getDraft = async (req, res) => {
  try {
    const userID = req.user.id;
    if (!userID) {
      return res.status(400).json({ message: 'User not found' });
    }

    const draft = await getSavedDraft(userID);

    if (!draft || draft.length === 0) {
      return res.status(404).json({ message: 'No draft found' });
    }

    // Return the first draft found
    return res.status(200).json(draft[0]);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * ================================================================
 * GET ALL RESPONSES
 * @route   GET /api/responses
 * @desc    Get all submitted responses for the logged-in user
 * @access  Private (user)
 * ================================================================
 */
const getAllResponses = async (req, res) => {
  try {
    const responses = await getAllResponsesFromDB(req.user.id);
    return res.status(200).json(responses);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * ================================================================
 * GET RESPONSE BY ID
 * @route   GET /api/responses/:id
 * @desc    Get full details of a specific response (Admin can view any, users can view their own)
 * @access  Private
 * ================================================================
 */
const getResponseById = async (req, res) => {
  try {
    const userID = req.user.id;
    const responseID = req.params.id;

    if (!userID || !responseID) {
      return res.status(400).json({ message: 'Missing user or response ID' });
    }

    // Check if user is admin or the owner of the response
    let response;
    if (req.user.role === 'admin') {
      // Admin can view any response by MongoDB _id
      response = await Response.findById(responseID).populate('submittedBy', 'username email');
    } else {
      // Regular user can only view their own responses by MongoDB _id
      response = await Response.findOne({ 
        _id: responseID, 
        submittedBy: userID 
      }).populate('submittedBy', 'username email');
    }

    if (!response) {
      return res.status(404).json({ 
        message: 'Response not found or you do not have permission to view it' 
      });
    }

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({
      message: 'Server error while fetching the response',
    });
  }
};

/**
 * ================================================================
 * DELETE RESPONSE
 * @route   DELETE /api/responses/:id
 * @desc    Admin-only: Delete a response
 * @access  Private (admin)
 * ================================================================
 */
const deleteResponse = async (req, res) => {
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ message: 'Access denied' });
  // }

  try {
    const userID = req.user.id;
    const responseID = req.params.id;

    if (!userID || !responseID) {
      return res.status(400).json({ message: 'Missing user or response ID' });
    }

    const result = await deleteResponseFromDB(responseID, userID);

    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ message: 'Response not found' });
    }

    return res.json({ message: 'Response deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


/**
 * ================================================================
 * Admin View Response
 * @route  Get /api/responses
 * @desc   Admin-only: Read Only
 * @access Private (admin)
 * ================================================================
*/
async function getAllResponsesAdmin(req, res) {
  try {
    console.log('Admin endpoint called - fetching all responses...');
    const result = await getResponse();
    console.log('Response from getResponse:', result);
    console.log('Sending response with length:', result.length);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error in getAllResponsesAdmin:', err);
    return res.status(500).json(err);
  }
}

module.exports = {
  submitResponse,
  saveDraft,
  getDraft,
  getAllResponses,
  getResponseById,
  deleteResponse,
  getAllResponsesAdmin,
};
