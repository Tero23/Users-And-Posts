const userController = require("../controllers/userController");
const userAuthorization = require("../middlewares/authorization");

const express = require("express");
const router = express.Router();

router
  .route("/me/admins")
  .get(userAuthorization.auth, userController.getAllAdmins);

router
  .route("/me/users")
  .get(userAuthorization.auth, userController.getAllUsers);
router
  .route("/me/admins&users")
  .get(userAuthorization.auth, userController.getAllAdminsAndUsers);
router
  .route("/admins/users")
  .get(userAuthorization.adminAuth, userController.getAllUsers);
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
  .route("/admins/me/users/:id")
  .get(userAuthorization.adminAuth, userController.getUserById);

router.route("/users/login").post(userController.login);

module.exports = router;
