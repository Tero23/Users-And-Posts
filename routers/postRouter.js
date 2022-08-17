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
  .get(authorization.adminAuth, postController.getAllPendingPosts);

//Accessable by admins and the superAdmin
router
  .route("/posts/pending/:id")
  .get(authorization.adminAuth, postController.approvePostById)
  .delete(authorization.adminAuth, postController.rejectPostById);

//Accessable by Everyone. But a user can only delete his/her post
router
  .route("/posts/:id")
  .delete(authorization.userAuth, postController.deletePostById)
  .get(authorization.userAuth, postController.getPostById);

//Accessable by Everyone. Case of users it is simply getting all the posts... Since pending posts are not accessable by users.
router
  .route("/posts")
  .get(authorization.userAuth, postController.getAllApprovedPosts)
  .post(
    authorization.userAuth,
    multer(multerConfig).single("image"),
    postController.createPost
  );

module.exports = router;
