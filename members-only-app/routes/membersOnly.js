const express = require("express");
const router = express.Router();
const indexGet = require("../controllers/indexGet");
const userController = require("../controllers/userControllers");
const messageController = require("../controllers/messageControllers");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// TODO: Consider doing the passport stuff in here, since it is specific to this portion of 
// routes only

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

passport.use(new LocalStrategy(userController.verifyLoginAttempt));

passport.serializeUser(userController.userSerializationCallback);
passport.deserializeUser(userController.userDesirializationCallback);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

router.get("/", indexGet);

router.get("/sign-up", userController.userCreateGet);
router.post("/sign-up", userController.userCreatePost);

router.get("/become-a-member", userController.userStatusMemberGet);
router.post("/become-a-member", userController.userStatusMemberPost);

router.get("/create-message", messageController.messageCreateGet);
router.post("/create-message", messageController.messageCreatePost);

router.post("/delete-message", messageController.messageDeletePost);

module.exports = router;
