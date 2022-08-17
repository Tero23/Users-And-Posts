const User = require("../models/userModel");
require("../db/connection");

exports.getUsers = async (req, res) => {
  try {
    const role = req.query.role;
    console.log(req.query);
    if (!role) {
      if (req.user.role !== "superAdmin") throw new Error("Forbidden!");
      const users = await User.find({});
      return res.status(200).json({
        message: "Here are all the users and admins!",
        count: users.length,
        users,
      });
    }
    if (role === "user") {
      if (req.user.role === "user") throw new Error("Forbidden!");
      const users = await User.find({ role: "user" });
      return res.status(200).json({
        message: "Here are all the users!",
        count: users.length,
        users,
      });
    }
    if (role === "admin") {
      if (req.user.role !== "superAdmin") throw new Error("Forbidden!");
      const admins = await User.find({ role: "admin" });
      return res.status(200).json({
        message: "Here are all the admins!",
        count: admins.length,
        admins,
      });
    } else {
      throw new Error("Invalid Query!");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    if (req.body.role === "admin" && req.user.role === "admin")
      throw new Error("You cannot create admins!");
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User successfully Created", user });
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
    if (req.user.role === "admin" && user.role !== "user")
      throw new Error("You cannot read other admin profile!");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send(error.message);
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
    if (req.user.role === "admin" && user.role !== "user")
      throw new Error("You cannot update other admins!");
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).json({ message: "User Updated!", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  try {
    if (user.role === "superAdmin") throw new Error("You Cannot be deleted!");
    if (req.user._id === user._id) {
      const now = new Date();
      user.deletedAt = now;
      user.tokens = [];
      await user.save();
      return res.status(200).json({ message: "User deleted!", user });
    }
    if (req.user.role === "user") throw new Error("You cannot delete others");
    if (req.user.role === "admin" && user.role !== "user")
      throw new Error("You can delete only users!");
    const now = new Date();
    user.deletedAt = now;
    user.tokens = [];
    await user.save();
    res.json({ message: "User deleted!", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
