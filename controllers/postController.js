const path = require("path");
const Post = require("../models/postModel");
require("../db/connection");
const multer = require("multer");
const upload = multer({ dest: "images/" });
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const ImageDirectoryPath = path.join(__dirname, "../images");

exports.createPost = catchAsync(async (req, res, next) => {
  const post = new Post({
    image: req.file.filename,
    text: req.body.text,
    ownerId: req.user._id,
    ownerName: req.user.username,
    status: "Pending",
  });
  await post.save();
  res.status(201).json({
    message: "Post created, wait for approval!",
    post: post.text,
  });
});

exports.approvePostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById({ _id: req.params.id });
  if (!post) return next(new AppError("There is no post with that ID!", 404));
  if (post.status === "Approved")
    return next(new AppError("Post already Approved!", 304));
  post.status = "Approved";
  await post.save();
  res.status(200).json({ message: "Post Approved!", post: post.text });
});

exports.rejectPostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById({ _id: req.params.id });
  if (!post) return next(new AppError("There is no post with that ID!", 404));
  await post.remove();
  res
    .status(200)
    .json({ message: "Post Rejected and removed!", post: post.text });
});

exports.deletePostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById({ _id: req.params.id });
  if (!post) return next(new AppError("There is no post with that ID!", 404));
  if (
    req.user.role === "user" &&
    req.user._id.toString() !== post.ownerId.toString()
  ) {
    return next("You cannot delete other's posts!", 403);
  }
  await post.remove();
  res.status(200).json({ message: "Post deleted!", post: post.text });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById({ _id: req.params.id });
  if (!post) return next(new AppError("There is no post with that ID!", 404));
  res.status(200).json({ post });
});

exports.getAllPendingPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ status: "Pending" });
  res.status(200).json({ count: posts.length, posts });
});

exports.getAllApprovedPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ status: "Approved" });
  res.status(200).json({ count: posts.length, posts });
});
