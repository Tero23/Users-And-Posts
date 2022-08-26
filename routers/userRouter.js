require("dotenv").config();
const User = require("../models/userModel");
const userController = require("../controllers/userController");
const userAuthorization = require("../middlewares/authorization");

const express = require("express");
const router = express.Router();

router
  .route("/users")
  .get(
    userAuthorization.auth,
    userAuthorization.restrictTo("user", "admin", "superAdmin"),
    userController.getUsers
  )
  .post(
    userAuthorization.auth,
    userAuthorization.restrictTo("admin", "superAdmin"),
    userController.createUser
  );

router
  .route("/users/me")
  .get(
    userAuthorization.auth,
    userAuthorization.restrictTo("user", "admin", "superAdmin"),
    userController.getMyProfile
  );

router
  .route("/users/:id")
  .get(
    userAuthorization.auth,
    userAuthorization.restrictTo("admin", "superAdmin"),
    userController.getUserById
  )
  .patch(
    userAuthorization.auth,
    userAuthorization.restrictTo("admin", "superAdmin"),
    userController.updateUser
  )
  .delete(
    userAuthorization.auth,
    userAuthorization.restrictTo("user", "admin", "superAdmin"),
    userController.deleteUser
  );

router.route("/users/login").post(userController.login);

module.exports = router;
