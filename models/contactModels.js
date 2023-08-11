const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  subject: {
    type: String,
    required: [true, "Please provide Subject"],
   
  },
  message: {
    type: String,
    required: [true, "Please provide Subject"],
  },
});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
