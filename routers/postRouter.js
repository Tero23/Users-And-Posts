require("dotenv").config();
const postController = require("../controllers/postController");
const authorization = require("../middlewares/authorization");

const express = require("express");
const router = express.Router();

const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  dest: "images",
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpe?g|png)$/))
      return cb(new Error("Please upload an image"));
    cb(undefined, true);
  },
});

router
  .route("/users/me/posts")
  .post(
    authorization.userAuth,
    upload.single("image"),
    postController.createPost
  );

router
  .route("/me/posts/pending")
  .get(authorization.auth, postController.getAllPendingPosts);

router
  .route("/me/posts/pending/:id")
  .get(authorization.auth, postController.approvePostById);

router
  .route("/me/posts/pending/:id")
  .get(authorization.auth, postController.rejectPostById);

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
