const express = require("express");
const router = express.Router();
const indexGet = require("../controllers/indexGet");

router.get("/", indexGet);

module.exports = router;
