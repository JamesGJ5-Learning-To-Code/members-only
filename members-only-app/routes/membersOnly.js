const express = require("express");
const router = express.Router();
const indexGet = require("../controllers/indexGet");
const userControllers = require("../controllers/userControllers");
const messageControllers = require("../controllers/messageControllers");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { body } = require("express-validator");

// TODO: Consider doing the passport stuff in here, since it is specific to this portion of 
// routes only

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // TODO: consider setting secure to true
        secure: false,
        maxAge: 3600000,
    },
}));

passport.use(new LocalStrategy(userControllers.verifyLoginAttempt));

passport.serializeUser(userControllers.userSerializationCallback);
passport.deserializeUser(userControllers.userDesirializationCallback);

router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

router.get("/", indexGet);

router.get("/sign-up", userControllers.userCreateGet);
router.post("/sign-up", userControllers.userCreatePost);

router.get("/log-in", userControllers.userLoginGet);
// TODO: consider refactoring the below callback into userControllers.js
router.post("/log-in", userControllers.userLoginPost);

router.get("/become-a-member", userControllers.userStatusMemberGet);
router.post("/become-a-member", userControllers.userStatusMemberPost);

router.get("/create-message", messageControllers.messageCreateGet);
router.post("/create-message", messageControllers.messageCreatePost);

router.post("/delete-message", messageControllers.messageDeletePost);

module.exports = router;
