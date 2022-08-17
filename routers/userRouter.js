require("dotenv").config();
const User = require("../models/userModel");
const userController = require("../controllers/userController");
const userAuthorization = require("../middlewares/authorization");

const express = require("express");
const router = express.Router();

router
  .route("/users")
  .get(userAuthorization.userAuth, userController.getUsers)
  .post(userAuthorization.adminAuth, userController.createUser);

router
  .route("/users/me")
  .get(userAuthorization.userAuth, userController.getMyProfile);

router
  .route("/users/:id")
  .get(userAuthorization.adminAuth, userController.getUserById)
  .patch(userAuthorization.adminAuth, userController.updateUser)
  .delete(userAuthorization.userAuth, userController.deleteUser);

router.route("/users/login").post(userController.login);

module.exports = router;
