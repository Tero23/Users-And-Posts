const path = require("path");
require("dotenv").config();
const postController = require("../controllers/postController");
const authorization = require("../middlewares/authorization");
const Post = require("../models/postModel");

const express = require("express");
const router = express.Router();

const multer = require("multer");

const ImageDirectoryPath = path.join(__dirname, "../images");

// const upload = multer({
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpe?g|png)$/))
//       return cb(new Error("Please upload an image"));
//     cb(undefined, true);
//   },
// });

const multerConfig = {
  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, "images");
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      // console.log(file);
      const ext = file.mimetype.split("/")[1];
      next(null, +Date.now() + "." + file.originalname);
    },
  }),

  //A means of ensuring only images are uploaded.
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith("image/");
    if (image) {
      console.log("photo uploaded");
      next(null, true);
    } else {
      console.log("file not supported");

      return next();
    }
  },
};

router
  .route("/users/me/posts")
  .post(
    authorization.userAuth,
    multer(multerConfig).single("image"),
    async (req, res) => {
      console.log(req.file);
      try {
        const post = new Post({
          image: req.file.filename,
          text: req.body.text,
          owner: req.user._id,
          status: "Pending",
        });
        await post.save();
        res.status(201).json({
          message: "Post created, wait for approval!",
          postPath: ImageDirectoryPath,
        });
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  );

router
  .route("/me/posts/pending")
  .get(authorization.auth, postController.getAllPendingPosts);

router
  .route("/me/posts/pending/:id")
  .get(authorization.auth, postController.approvePostById)
  .delete(authorization.auth, postController.rejectPostById);

router
  .route("/admins/me/posts/pending/:id")
  .get(authorization.adminAuth, postController.approvePostById);

router
  .route("/admins/me/posts/pending/:id")
  .get(authorization.adminAuth, postController.rejectPostById);

router
  .route("/me/posts/:id")
  .delete(authorization.auth, postController.deletePostById);

router
  .route("/admins/me/posts/:id")
  .delete(authorization.adminAuth, postController.deletePostById);

router
  .route("/users/me/posts/:id")
  .delete(authorization.userAuth, postController.deletePostById);

router
  .route("/admins/me/posts/pending")
  .get(authorization.adminAuth, postController.getAllPendingPosts);

router
  .route("/me/posts/approved")
  .get(authorization.auth, postController.getAllApprovedPosts);

router
  .route("/admins/me/posts/approved")
  .get(authorization.adminAuth, postController.getAllApprovedPosts);

router.route("/me/posts").get(authorization.auth, postController.getAllPosts);

router
  .route("/admins/me/posts")
  .get(authorization.adminAuth, postController.getAllPosts);

router
  .route("/users/me/posts")
  .get(authorization.userAuth, postController.getAllApprovedPosts);

router
  .route("/me/posts/:id")
  .get(authorization.auth, postController.getPostById);

router
  .route("/admins/me/posts/:id")
  .get(authorization.adminAuth, postController.getPostById);

router
  .route("/users/me/posts/:id")
  .get(authorization.userAuth, postController.getPostById);

module.exports = router;
