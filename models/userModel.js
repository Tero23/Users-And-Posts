require("../db/connection");
const { ApprovedPost, PendingPost } = require("./postModel");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
        if (!/\W/g.test(value))
          throw new Error(
            "Your password must contain at least 1 special character!"
          );
        if (!/\d/g.test(value))
          throw new Error("Your password must contain at least 1 digit!");
      },
    },
    deletedAt: {
      type: Date,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.generateAuthTokens = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");
  return user;
};

userSchema.pre("remove", async function (next) {
  await Post.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
