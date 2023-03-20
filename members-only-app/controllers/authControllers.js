const User = require("../models/user");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.userLoginGet = (req, res, next) => {
    res.render("userLoginForm");
};

// NOTE: 'done' is a parameter necessitated by the passport middleware in 
// ../routes/membersOnly.js
exports.verifyLoginAttempt = async (username, password, done) => {
    // TODO: implement verifyUserDetails
    const persistedRequestBody = {
        username: username,
        password: password,
    };
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, {
                persistedRequestBody,
                message: "Incorrect username",
            });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) {
                throw err;
            } else if (res) {
                return done(null, user);
            }
            return done(null, false, {
                persistedRequestBody,
                message: "Incorrect password",
            });
        });
    } catch(err) {
        return done(err);
    };
};

exports.userLoginPost = [
    body("username").trim().escape(),
    body("password").escape(),
    passport.authenticate("local", {
        successRedirect: "/become-a-member",
        failureRedirect: "/log-in",
        // TODO: set up failureFlash so you can show errors mentioned in verifyLoginAttempt
    })
];

exports.userSerializationCallback = (user, done) => {
    done(null, user.id);
};

exports.userDesirializationCallback = async (userId, done) => {
    try {
        const user = await User.findById(userId);
        done(null, user);
    } catch(err) {
        done(err);
    };
};