const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexContoller");

router.get("/", indexController.index);

module.exports = router;
