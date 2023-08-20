const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/useModels");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    id: user._id,
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  req.user = newUser;
  try {
    await sendEmail({
      email: newUser.email,
      subject: "Accounts Create",
      message: "Your admin account has been created",
    });
  } catch (err) {
    console.log("Error=" + err);
  }
  //=============================================================
  createSendToken(newUser, 201, res);
});
exports.signin = catchAsync(async (req, res, next) => {
  console.log("Sign in query");
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  // console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 201, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  // const resetToken = user.createPasswordResetToken();
  const resetToken = Math.floor(Math.random() * 10000) + "";

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  const r = await User.updateOne(
    { email: req.body.email },
    {
      passwordResetToken: resetToken,
      passwordResetExpires: Date.now() + 10 * 60 * 1000,
    }
  );

  // 3) Send it to user's email

  const message = `Forgot your password? use this token : ${resetToken}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    const temp = await sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    console.log(temp);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = parseInt(req.body.token);
  const user = await User.findOne({
    email: req.body.email,
    passwordResetToken: token,
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  const pass = await bcrypt.hashSync(req.body.password, 12);
  console.log(pass);
  await User.updateOne(
    { passwordResetToken: token },
    {
      password: pass,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    }
  );
  createSendToken(user, 201, res);
});
exports.checkLogin = catchAsync(async (req, res, next) => {
  let token;
  let status = "success";
  let message = "Login successful";
  console.log(req.body);
  if (req.cookies.jwt) {
    console.log("Token in cookies");
    token = req.cookies.jwt.split(" ")[1];
  } else if (req.body.token) {
    console.log("Token in body");
    token = req.body.token.split(" ")[1];
  }
  if (!token) {
    status = "fail";
    message = "You are not logged in! Please log in to get access.";
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    status = "fail";
    message = "The user belonging to this token does no longer exist.";
  }
  req.user = currentUser;
  res.status(200).json({
    status,
    message,
  });
});

//a function that takes in a number of factors and assesses users maintenence calories
