const User = require('../../models/userModel');

async function getUserInfo(uname, emailFlag = 0) {
    try {
        const data = emailFlag
            ? await User.findOne({ $or: [{ username: uname }, { email: uname }] })
            : await User.findOne({ username: uname });

        return data;
    } catch (err) {
        console.error("Error to get User Info: " + err);
        throw new Error("Error to get user Info");
    }
}

async function saveUserInfo(data) {
    try {
        const response = await User.create(data);
        return response;
    } catch (err) {
        console.error("Error to save user info: " + err);
        throw new Error("Error to save user info");
    }
}

async function getUserDetails(id) {
    try {
        const response = await User.findById(id)
        .lean()
        .select({password:0});

        return response;
    } catch (err) {
        console.error("Error to find user details: " + err);
        throw new Error('Error getting user details.');
    }
}

module.exports = {
    getUserInfo,
    saveUserInfo,
    getUserDetails,
}