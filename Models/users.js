const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  avtar: {
    type: String,
    url: String,
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    unique: [true, "Username already exists"],
  },
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
