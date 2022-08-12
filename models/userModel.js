require("../db/connection");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    role: {
      type: String,
      requred: true,
      enum: ["user", "admin", "superAdmin"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Invalid email structure!");
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 10,
      validate(value) {
        if (!/[a-z]/g.test(value))
          throw new Error(
            "Your password must contain at least 1 lowercase letter!"
          );
        if (!/[A-Z]/g.test(value))
          throw new Error(
            "Your password must contain at least 1 uppercase letter!"
          );
        if (!/[\W]/g.test(value))
          throw new Error(
            "Your password must contain at least 1 special character!"
          );
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatars: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.virtual("posts", {
//     ref: "Post",
//     localField: "_id",
//     foreignField: "owner",
//   });

module.exports = mongoose.model("User", userSchema);
