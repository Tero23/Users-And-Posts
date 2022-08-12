const User = require("../models/userModel");
require("../db/connection");

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthTokens();
    await user.save();
    res.status(201).json({ message: "User successfully Created", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createUserByAdmin = async (req, res) => {
  try {
    const user = new User(req.body);
    if (user.role !== "user") throw new Error("You can create only users!");
    const token = await user.generateAuthTokens();
    await user.save();
    res.status(201).json({ message: "User successfully Created", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({ count: admins.length, admins });
  } catch (error) {
    res.status(500).send(error.message);
  }
  res.send("Here are all the admins!");
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllAdminsAndUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    const admins = await User.find({ role: "admin" });
    const everybody = [...users, ...admins];
    res.status(200).json({ count: everybody.length, AllUsers: everybody });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(200).json({ message: "Here is your profile", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw new Error("There is no such user Id!");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send(Error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthTokens();
    await user.save();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
