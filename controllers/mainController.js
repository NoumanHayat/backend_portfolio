const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const ContactModels = require("./../models/contactModels");
const sendEmail = require("./../utils/email");

exports.Starting = catchAsync(async (req, res, next) => {
  res.send('Work');
});
exports.Contact = catchAsync(async (req, res, next) => {
  console.log("email:"+req.body.email);
    var today = new Date();
    const newContact = await ContactModels.create({
      name:req.body.name,
      email:req.body.email,
      subject:req.body.subject,
      message:req.body.message,
      Date: today.getTime(),
    });
    console.log(newContact);
    try {
      await sendEmail({
        email: req.body.email,
        subject: "Thank You for Reaching Out to Us!",
        message: `Dear ${req.body.name} \n\nI hope this email finds you well. I wanted to express my heartfelt gratitude for reaching out to us through our website. Your interest and engagement mean a lot to us.\nWe understand the importance of your inquiry and would like to assure you that we are already working on gathering the information you seek. Our team is dedicated to providing you with the most accurate and relevant details, and we'll be sure to get back to you via email at the earliest convenience.\nFor any further updates or to explore more about our services, please feel free to visit our official website: noumanhayat.online. We regularly update our site with the latest information to keep you informed and engaged.\nOnce again, thank you for considering us for your needs. We're excited about the opportunity to assist you and look forward to connecting with you soon.\nShould you have any questions or require immediate assistance, please don't hesitate to contact us directly. We're here to help!\nBest Regards,\nNouman Hayat\n`,
      });
    } catch (err) {
      console.log("Error=" + err);
    }
    res.status(200).json({
      status: "success",
      message: "Contact is added successfully!",
    });
});
exports.sendEmail = catchAsync(async (req, res, next) => {
  console.log("newContact");
  try {
    await sendEmail({
      email: `${req.body.email}`,
      subject: `${req.body.subject}`,
      message: `${req.body.message}`
    });
  } catch (err) {
    console.log("Error=" + err);
  }
  res.status(200).json({
    status: "success",
    message: "Send email successfully!",
  });
}); 
exports.getContact = catchAsync(async (req, res, next) => {
  const items = await ContactModels.find();
  console.log(items);
  res.status(200).json({
    status: "success",
    message: items,
  });
});
exports.deleteContact = catchAsync(async (req, res, next) => {
  var myquery = { name: req.body.name, email: req.body.email,subject: req.body.subject};
  const ress = await ContactModels.deleteOne(myquery);
 
  res.status(200).json({
    status: "success",
    message:"Delete Contact",
  });
})