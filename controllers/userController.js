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
    const activeAdmins = admins.filter(
      (admin) => admin.deletedAt === undefined
    );
    res.status(200).json({ count: activeAdmins.length, activeAdmins });
  } catch (error) {
    res.status(500).send(error.message);
  }
  res.send("Here are all the admins!");
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    const activeUsers = users.filter((user) => user.deletedAt === undefined);
    res.status(200).json({ count: activeUsers.length, activeUsers });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllAdminsAndUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    const activeUsers = users.filter((user) => user.deletedAt === undefined);
    const admins = await User.find({ role: "admin" });
    const activeAdmins = admins.filter(
      (admin) => admin.deletedAt === undefined
    );
    const everybody = [...activeUsers, ...activeAdmins];
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
    if (!user || user.deletedAt !== undefined)
      throw new Error("There is no such user Id!");
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
    if (user.deletedAt !== undefined) throw new Error("There is no such user!");
    const token = await user.generateAuthTokens();
    await user.save();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "role"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) res.status(404).send({ message: "Invalid Update!" });
  try {
    const user = await User.findOne({ _id: req.params.id });
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).json({ message: "User Updated!", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateUserByAdmin = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "role"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) res.status(404).send({ message: "Invalid Update!" });
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user.role !== "user") throw new Error("You can only update users!");
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).json({ message: "User Updated!", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateMyProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "role"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) res.status(404).send({ message: "Invalid Update!" });
  try {
    const user = await User.findOne({ _id: req.user.id });
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).json({ message: "User Updated!", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const now = new Date();
    user.deletedAt = now;
    user.tokens = [];
    await user.save();
    res.json({ message: "User deleted!", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const now = new Date();
    if (user.role !== "user") throw new Error("You cannot delete Admins!");
    user.deletedAt = now;
    user.tokens = [];
    await user.save();
    res.json({ message: "User deleted!", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
