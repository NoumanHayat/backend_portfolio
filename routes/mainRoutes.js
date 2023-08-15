const express = require("express");
const multer = require("multer");
const mainController = require("./../controllers/mainController");

const router = express.Router();
router.route("/start").all(mainController.Starting);
router.route("/Contact").all(mainController.Contact);
router.route("/sendEmail").all(mainController.sendEmail);
router.route("/getContact").all(mainController.getContact);
module.exports = router;
