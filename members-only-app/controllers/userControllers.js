const User = require("../models/user");

exports.userCreateGet = (req, res, next) => {
    res.render("userSignupForm");
};

exports.userCreatePost = (req, res, next) => {
    res.send("TODO: implement userCreatePost")
};

exports.userLoginGet = (req, res, next) => {
    res.send("TODO: implement userLoginGet");
};

// TODO: consider whether the below three functions are really controllers and if they 
// should really be in this file
// NOTE: 'done' is a parameter necessitated by the passport middleware in 
// ../routes/membersOnly.js
exports.verifyLoginAttempt = (username, password, done) => {
    // TODO: implement verifyUserDetails
};

exports.userSerializationCallback = (userDoc, done) => {
    // TODO: implement userSerializationCallback
};

exports.userDesirializationCallback = (userDocId, done) => {
    // TODO: implement userDeserializationCallback
};

exports.userStatusMemberGet = (req, res, next) => {
    res.send("TODO: implement userStatusMemberGet")
};

exports.userStatusMemberPost = (req, res, next) => {
    res.send("TODO: implement userStatusMemberPost");
};