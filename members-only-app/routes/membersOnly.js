const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const messageControllers = require("../controllers/messageControllers");
const authControllers = require("../controllers/authControllers");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

passport.use(new LocalStrategy(authControllers.verifyLoginAttempt));

passport.serializeUser(authControllers.userSerializationCallback);
passport.deserializeUser(authControllers.userDeserializationCallback);

router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

router.get("/", messageControllers.allMessagesGet);

router.get("/sign-up", userControllers.userCreateGet);
router.post("/sign-up", userControllers.userCreatePost);

router.get("/log-in", authControllers.userLoginGet);
// TODO: consider refactoring the below callback into userControllers.js
router.post("/log-in", authControllers.userLoginPost);

router.get("/become-a-member", userControllers.userStatusMemberGet);
router.post("/become-a-member", userControllers.userStatusMemberPost);

router.get("/create-message", messageControllers.messageCreateGet);
router.post("/create-message", messageControllers.messageCreatePost);

router.post("/delete-message", messageControllers.messageDeletePost);

module.exports = router;
