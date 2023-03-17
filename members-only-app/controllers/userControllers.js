// TODO: consider putting authorisation controllers into separate file

const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

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
            const foundUser = await User.findOne({ username: req.body.username })
            if (foundUser) {
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

exports.userLoginPost = [
    body("username").trim().escape(),
    body("password").escape(),
    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err)
            } else if (!user) {
                return res.render("userLoginForm", {
                    persistedRequestBody: info.persistedRequestBody,
                    error: info.message
                });
            }
            res.redirect("/");
        })(req, res, next);
    }
];

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

exports.userStatusMemberGet = (req, res, next) => {
    res.render("membershipForm");
};

exports.userStatusMemberPost = (req, res, next) => {
    res.send("TODO: implement userStatusMemberPost");
};