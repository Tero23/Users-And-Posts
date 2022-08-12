const User = require("../models/userModel");

exports.getAllAdmins = async (req, res) => {
  res.send("Here are all the admins!");
};

exports.getAllUsers = async (req, res) => {
  res.send("Here are all the users!");
};

exports.getAllAdminsAndUsers = async (req, res) => {
  res.send("Here are all the admins and the users!");
};

exports.getMyProfile = async (req, res) => {
  res.send("Here is your profile!");
};

exports.getUserById = async (req, res) => {
  res.send("Here is your user with that id!");
};

exports.login = async (req, res) => {
  res.send("Login Successfull!");
};
