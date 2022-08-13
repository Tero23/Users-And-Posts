require("dotenv").config();
const User = require("../models/userModel");
const userController = require("../controllers/userController");
const userAuthorization = require("../middlewares/authorization");

const express = require("express");
const router = express.Router();

router.route("/me").post(async (req, res) => {
  const me = new User({
    username: "Tro",
    role: "superAdmin",
    email: "doumaniant@gmail.com",
    password: process.env.MY_PASSWORD,
  });
  const token = await me.generateAuthTokens();
  res.status(200).json({ msg: "Super Admin Created!" });
});

router
  .route("/me/admins")
  .get(userAuthorization.auth, userController.getAllAdmins);

router
  .route("/me/users")
  .get(userAuthorization.auth, userController.getAllUsers)
  .post(userAuthorization.auth, userController.createUser);

router
  .route("/me/admins&users")
  .get(userAuthorization.auth, userController.getAllAdminsAndUsers);
router
  .route("/admins/users")
  .get(userAuthorization.adminAuth, userController.getAllUsers)
  .post(userAuthorization.adminAuth, userController.createUserByAdmin);
router
  .route("/admins/me")
  .get(userAuthorization.adminAuth, userController.getMyProfile);
router
  .route("/users/me")
  .get(userAuthorization.userAuth, userController.getMyProfile);

router
  .route("/me/users/:id")
  .get(userAuthorization.auth, userController.getUserById);

router
  .route("/me/admins/:id")
  .get(userAuthorization.auth, userController.getUserById);

router
  .route("/admins/me/users/:id")
  .get(userAuthorization.adminAuth, userController.getUserById);

router.route("/users/login").post(userController.login);

router
  .route("/me/users/update/:id")
  .patch(userAuthorization.auth, userController.updateUser);

router
  .route("/admins/me/users/update/:id")
  .patch(userAuthorization.adminAuth, userController.updateUserByAdmin);

router
  .route("/admins/me/update")
  .patch(userAuthorization.adminAuth, userController.updateMyProfile);

router
  .route("/me/users/delete/:id")
  .delete(userAuthorization.auth, userController.deleteUser);

router
  .route("/admins/me/users/delete/:id")
  .delete(userAuthorization.adminAuth, userController.deleteUserByAdmin);

module.exports = router;
