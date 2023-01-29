const express = require("express");
const router = express.Router();

const controller = require("../controllers/ConsumerController");

router.get("/", controller.get);

module.exports = router;