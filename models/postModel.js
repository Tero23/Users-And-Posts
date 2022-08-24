const User = require("./userModel");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "An image is required!"],
    },
    text: {
      type: String,
      required: [true, "A text is required!"],
    },
    // ownerId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A post must have an owner!"],
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Approved"],
        message: "The status must be either Pending or Approved!",
      },
      required: [true, "A post must have a status!"],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
