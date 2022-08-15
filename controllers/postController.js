const path = require("path");
const Post = require("../models/postModel");
require("../db/connection");

const ImageDirectoryPath = path.join(__dirname, "../images");

exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      image: ImageDirectoryPath,
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
};

exports.approvePostById = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    post.status = "Approved";
    await post.save();
    res.status(200).json({ message: "Post Approved!", post: post.text });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.rejectPostById = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    await post.remove();
    res
      .status(200)
      .json({ message: "Post Rejected and removed!", post: post.text });
  } catch (error) {
    res.status(500).send(message.error);
  }
};

exports.deletePostById = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    await post.remove();
    res.status(200).json({ message: "Post deleted!", post: post.text });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post) throw new Error("There is no post with that id!");
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "Pending" });
    res.status(200).json({ count: posts.length, posts });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllApprovedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "Approved" });
    res.status(200).json({ count: posts.length, posts });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ count: posts.length, posts });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
