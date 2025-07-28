const Response = require('../../models/responseModel');

async function createResponse(data) {
    try {
        const dataRes = await Response.create(data);
        return dataRes;
    } catch (err) {
        console.error("Error", err);
        throw new Error("Error to create.");
    }
}

async function getResponse() {
    try {
        console.log('Attempting to fetch all responses...');
        const data = await Response.find({});
        console.log('Found responses count:', data.length);
        console.log('Sample response:', data.length > 0 ? data[0] : 'No data found');
        return data;
    } catch (err) {
        console.error('Error in getResponse:', err);
        throw new Error("Error to get the data.");
    }
}

async function getSavedDraft(userID, responseID) {
    try {
        let data = responseID ? await Response.find({
            responseId: responseID,
            submittedBy: userID,
            status: 'draft'
        }) : await Response.find({
            submittedBy: userID,
            status: 'draft'
        });
        return data;
    } catch (err) {

        throw new Error("Error to get the Draft data." + err);
    }
}


async function updateUserDraft(userID, data) {
    try {
        const result = await Response.updateOne(
            { submittedBy: userID },
            { $set: data }
        );
        return result;
    } catch (err) {
        throw new Error("Error to update the drafts");
    }
}

async function saveDraftToDB(data) {
    try {
        const result = await Response.create(data);
        return result;
    } catch (err) {
        throw new Error("Error to save the Draft: " + err)
    }
}

async function getAllResponsesFromDB(username) {
    try {
        const result = await Response.find({ status: 'submitted', submittedBy: username }).populate('submittedBy', 'username');
        return result;
    } catch (err) {
        throw new Error("Cannot get user responses.");
    }
}

async function getUserResponseWithID(id, userID) {
    try {
        const result = await Response.find({ responseId: id, submittedBy: userID });
        return result;
    } catch (err) {
        throw new Error("Error to get the user Response.");
    }
}

async function deleteResponse(id, userID) {
    try {
        const result = await Response.deleteOne({ responseId: id, submittedBy: userID });
        return result;
    } catch (err) {
        throw new Error("Error to delete the user’s Response");
    }
}

module.exports = {
    createResponse,
    getResponse,
    getSavedDraft,
    updateUserDraft,
    saveDraftToDB,
    getAllResponsesFromDB,
    getUserResponseWithID,
    deleteResponse,
}