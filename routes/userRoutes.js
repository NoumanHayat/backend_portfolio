const express = require("express");
const multer = require("multer");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

//  const authController = require('./../controllers/authController');

const router = express.Router();
console.clear()
// const upload = multer({ dest: "/" });
router.route("/signup")
    .post(userController.signup)
router.route("/signin")
    .post(userController.signin)
router.route("/forgotPassword")
    .post(userController.forgotPassword)
router.route("/resetPassword")
    .post(userController.resetPassword)
router.route("/checkLogin")
    .all(userController.checkLogin)
//172.17.240.1
module.exports = router;