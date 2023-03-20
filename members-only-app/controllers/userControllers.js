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

exports.userStatusMemberGet = (req, res, next) => {
    res.render("membershipForm");
};

exports.userStatusMemberPost = [
    body("passcode")
        .isLength({ min: 1 })
        .withMessage("Please enter a passcode")
        .custom((value) => value === process.env.SECRET_PASSCODE)
        .withMessage("Incorrect passcode"),
    (req, res, next) => {
        if (res.locals.currentUser === undefined) {
            return next();
        }
        const errorResultObject = validationResult(req);
        if (!errorResultObject.isEmpty()) {
            return res.render("membershipForm", {
                errorArray: errorResultObject.array(),
            })
        }
        const updatedUser = new User({
            forename: res.locals.currentUser.forename,
            lastName: res.locals.currentUser.lastName,
            username: res.locals.currentUser.username,
            password: res.locals.currentUser.password,
            status: "member",
            _id: res.locals.currentUser.id,
        });
        User.findByIdAndUpdate(res.locals.currentUser.id, updatedUser, {})
        .then(() => res.redirect("/"))
        .catch((err) => next(err));
    }
];