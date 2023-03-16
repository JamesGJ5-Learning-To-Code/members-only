const User = require("../models/user");

exports.userCreateGet = (req, res, next) => {
    res.send("TODO: implement userCreateGet")
};

exports.userCreatePost = (req, res, next) => {
    res.send("TODO: implement userCreatePost")
};

// TODO: consider whether this is really a controller and if it should really be in this 
// file
// NOTE: 'done' is a parameter necessitated by the LocalStrategy constructor in 
// ../routes/membersOnly.js
exports.verifyLoginAttempt = (username, password, done) => {
    // TODO: implement verifyUserDetails
};

exports.userStatusMemberGet = (req, res, next) => {
    res.send("TODO: implement userStatusMemberGet")
};

exports.userStatusMemberPost = (req, res, next) => {
    res.send("TODO: implement userStatusMemberPost");
};