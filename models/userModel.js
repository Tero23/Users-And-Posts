require("../db/connection");
const Post = require("./postModel");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter username!"],
      trim: true,
      unique: true,
      minlength: [3, "Minimum username length must be of 3 characters!"],
    },
    role: {
      type: String,
      required: [true, "Please enter the user role!"],
      enum: {
        values: ["user", "admin", "superAdmin"],
        message: "Role is either user, admin or superAdmin!",
      },
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      trim: true,
      unique: true,
      validate: {
        validator: function (value) {
          // this only points to current doc on NEW document creation
          return validator.isEmail(value);
        },
        message: "Invalid email structure!",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter a password!"],
      minlength: [10, "Password length must be at least 10 characters long!"],
      validate: {
        validator: function (value) {
          return (
            /[a-z]/g.test(value) &&
            /[A-Z]/g.test(value) &&
            /\W/g.test(value) &&
            /\d/g.test(value)
          );
        },
        message:
          "Your password must contain at least 1 lowerCase letter at least 1 upperCase letter at least 1 digit and at least 1 special character!",
      },
    },
    deletedAt: {
      type: Date,
    },
    tokens: [
      {
        token: {
          type: String,
          required: [true, "A token is required!"],
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
  if (!user)  throw new AppError("Unable to login", 400);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)  throw new AppError("Unable to login", 400);
  return user;
};

userSchema.pre("remove", async function (next) {
  await Post.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
