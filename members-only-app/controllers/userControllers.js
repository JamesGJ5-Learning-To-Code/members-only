const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.userCreateGet = (req, res, next) => {
    res.render("userSignupForm");
};

exports.userCreatePost = [
    // TODO: figure out whether using isAlphanumeric/isAlpha below makes escape redundant--I guess 
    // errors don't prevent the data from still being used, so escape might be a good 
    // precaution
    // TODO: permit forename/last name special characters maybe
    body("forename")
        .isAlpha()
        .withMessage("Forename characters must be in the alphabet")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please enter a forename")
        .escape(),
    body("lastname")
        .isAlpha()
        .withMessage("Last name characters must be in the alphabet")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please enter a last name")
        .escape(),
    body("username")
        .isAlphanumeric()
        .withMessage("Username characters must be alphanumeric")
        .isLength({ min: 5 })
        .withMessage("Username must have at least 5 characters")
        .escape(),
    body("password")
        .isAlphanumeric()
        .withMessage("Password characters must be alphanumeric")
        .isLength({ min: 5 })
        .withMessage("Password must have at least 5 characters")
        .escape(),
    body("confirmpassword")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("The password fields must match")
        .escape(),
    body("isadmin")
        .escape(),
    async (req, res, next) => {
        const errorResultObject = validationResult(req);
        if (!errorResultObject.isEmpty()) {
            return res.render("userSignupForm", {
                persistedRequestBody: req.body,
                errorArray: errorResultObject.array(),
            });
        }
        try {
            const foundUserDoc = await User.findOne({ username: req.body.username })
            if (foundUserDoc) {
                return res.render("userSignupForm", {
                    persistedRequestBody: req.body,
                    errorArray: [{msg: "Username taken"}]
                });
            }
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {throw err}
                const newUser = new User({
                    forename: req.body.forename,
                    lastName: req.body.lastname,
                    username: req.body.username,
                    password: hashedPassword,
                    status: req.body.isadmin ? "admin" : "basic",
                });
                const result = await newUser.save();
                res.redirect("/");
            });
        } catch(err) {
            return next(err);
        }
    }
];

exports.userLoginGet = (req, res, next) => {
    res.render("userLoginForm");
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