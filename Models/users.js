const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  avtar: {
    public_id: String,
    url: String,
  },
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Emalil already exists"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password must be of atleast 6 characters"],
    unique: [true, "Emalil already exists"],
  },
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

module.exports = mongoose.model("Users", userSchema);
