const { validateSignIn } = require("../middlewares/validation");
const User = require("../models/userModel");
require("../db/connection");
const joi = require("joi");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getUsers = catchAsync(async (req, res, next) => {
  const role = req.query.role;
  if (!role) {
    if (req.user.role !== "superAdmin") {
      return next(new AppError("Forbidden!", 403));
    }
    const users = await User.find({});
    return res.status(200).json({
      message: "Here are all the users and admins!",
      count: users.length,
      users,
    });
  }
  if (role === "user") {
    if (req.user.role === "user") {
      return next(new AppError("Forbidden!", 403));
    }
    const users = await User.find({ role: "user" });
    return res.status(200).json({
      message: "Here are all the users!",
      count: users.length,
      users,
    });
  }
  if (role === "admin") {
    if (req.user.role !== "superAdmin") {
      return next(new AppError("Forbidden!", 403));
    }
    const admins = await User.find({ role: "admin" });
    return res.status(200).json({
      message: "Here are all the admins!",
      count: admins.length,
      admins,
    });
  } else {
    return next("Bad Request!", 400);
  }
});

exports.createUser = catchAsync(async (req, res, next) => {
  if (req.body.role === "admin" && req.user.role === "admin")
    return next(new AppError("You cannot create admins!", 403));
  const user = new User(req.body);
  await user.save();
  res.status(201).json({ message: "User successfully Created", user });
});

exports.getMyProfile = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return next(new AppError("Invalid ID!", 403));
  res.status(200).json({ message: "Here is your profile", user });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user || user.deletedAt !== undefined)
    return next(new AppError("There is no such user Id!", 404));
  if (req.user.role === "admin" && user.role !== "user")
    return next(new AppError("You cannot read other admin profile!", 403));
  res.status(200).json({ user });
});

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findByCredentials(req.body.email, req.body.password);
  console.log(user);
  if (!user || user.deletedAt !== undefined)
    return next(new AppError("There is no such user!", 404));
  const token = await user.generateAuthTokens();
  await user.save();
  res.status(200).json({ user, token });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "role"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) res.status(404).send({ message: "Invalid Update!" });
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    return next(new AppError("No user found with that ID!", 404));
  }
  if (req.user.role === "admin" && user.role !== "user")
    return next(new AppError("You cannot update other admins!", 403));
  updates.forEach((update) => (user[update] = req.body[update]));
  await user.save();
  res.status(200).json({ message: "User Updated!", user });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  if (user.role === "superAdmin")
    return next(new AppError("You Cannot be deleted!", 403));
  if (req.user._id === user._id) {
    const now = new Date();
    user.deletedAt = now;
    user.tokens = [];
    await user.save();
    return res.status(200).json({ message: "User deleted!", user });
  }
  if (req.user.role === "user")
    return next(new AppError("You cannot delete others", 403));
  if (req.user.role === "admin" && user.role !== "user")
    return next(new AppError("You can delete only users!", 403));
  const now = new Date();
  user.deletedAt = now;
  user.tokens = [];
  await user.save();
  res.json({ message: "User deleted!", user });
});
