const express = require("express");
const router = express.Router();
const indexGet = require("../controllers/indexGet");
const userController = require("../controllers/userControllers");

router.get("/", indexGet);

router.get("/sign-up", userController.userCreateGet);

router.post("/sign-up", userController.userCreatePost);

router.get("/become-a-member", userController.userStatusMemberGet);

router.post("/become-a-member", userController.userStatusMemberPost);

module.exports = router;
