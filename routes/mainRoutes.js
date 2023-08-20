const express = require("express");
const multer = require("multer");
const mainController = require("./../controllers/mainController");
const authController = require("./../controllers/authController");

const router = express.Router();
router.route("/start").all(mainController.Starting);
router.route("/sendContact").all(mainController.Contact);
router.route("/sendEmail").all(mainController.sendEmail);
router.route("/getContact").all(authController.protect,mainController.getContact);
router.route("/deleteContact").all(mainController.deleteContact);
module.exports = router;
