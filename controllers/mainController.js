const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const ContactModels = require("./../models/contactModels");
exports.Starting = catchAsync(async (req, res, next) => {
  res.send('Work');
});
exports.Contact = catchAsync(async (req, res, next) => {
    var today = new Date();
    const newContact = await ContactModels.create({
      name:req.body.name,
      email:req.body.email,
      subject:req.body.subject,
      message:req.body.message,
      Date: today.getTime(),
    });
    console.log(newContact);
    res.status(200).json({
      status: "success",
      message: "Contact is added successfully!",
    });
});
