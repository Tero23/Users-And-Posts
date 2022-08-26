const path = require("path");
require("dotenv").config();
const postController = require("../controllers/postController");
const authorization = require("../middlewares/authorization");
const Post = require("../models/postModel");

const express = require("express");
const router = express.Router();

const multer = require("multer");

const ImageDirectoryPath = path.join(__dirname, "../images");

const multerConfig = {
  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, "images");
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      next(null, Date.now() + "." + file.originalname);
    },
  }),

  //A means of ensuring only images are uploaded.
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith("image/");
    if (image) {
      next(null, true);
    } else {
      return next();
    }
  },
};

//Accessable by admins and the superAdmin
router
  .route("/posts/pending")
  .get(
    authorization.auth,
    authorization.restrictTo("admin", "superAdmin"),
    postController.getAllPendingPosts
  );

//Accessable by admins and the superAdmin
router
  .route("/posts/pending/:id")
  .get(
    authorization.auth,
    authorization.restrictTo("admin", "superAdmin"),
    postController.approvePostById
  )
  .delete(
    authorization.auth,
    authorization.restrictTo("admin", "superAdmin"),
    postController.rejectPostById
  );

//Accessable by Everyone. But a user can only delete his/her post
router
  .route("/posts/:id")
  .delete(
    authorization.auth,
    authorization.restrictTo("user", "admin", "superAdmin"),
    postController.deletePostById
  )
  .get(
    authorization.auth,
    authorization.restrictTo("user", "admin", "superAdmin"),
    postController.getPostById
  );

//Accessable by Everyone. Case of users it is simply getting all the posts... Since pending posts are not accessable by users.
router
  .route("/posts")
  .get(
    authorization.auth,
    authorization.restrictTo("user", "admin", "superAdmin"),
    postController.getAllApprovedPosts
  )
  .post(
    authorization.auth,
    authorization.restrictTo("user", "admin", "superAdmin"),
    multer(multerConfig).single("image"),
    postController.createPost
  );

module.exports = router;
