require("dotenv").config();
const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.auth = catchAsync(async function (req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("You are not logged in!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  const user = await User.findById(decoded._id);
  if (!user)
    return next(
      new AppError("The user belonging to the token does no longer exist!", 401)
    );
  req.token = token;
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You cannot perform this task!", 403));
    next();
  };
};

// exports.adminAuth = async function (req, res, next) {
//   try {
//     const token = req.header("Authorization").replace("Bearer ", "");
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findOne({
//       _id: decoded._id,
//       "tokens.token": token,
//     });
//     if (!user) throw new Error();
//     if (user.role === "user")
//       throw new Error("You are not an admin or a super admin!");
//     req.token = token;
//     req.user = user;
//     next();
//   } catch (e) {
//     res.status(401).send({ error: "Please authenticate" });
//   }
// };

// exports.userAuth = async function (req, res, next) {
//   try {
//     const token = req.header("Authorization").replace("Bearer ", "");
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findOne({
//       _id: decoded._id,
//       "tokens.token": token,
//     });
//     if (!user) throw new Error();
//     req.token = token;
//     req.user = user;
//     next();
//   } catch (e) {
//     res.status(401).send({ error: "Please authenticate" });
//   }
// };
