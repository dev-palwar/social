const {
  sendResponse,
  setCookie,
  destroyCookie,
  log,
  getUser,
} = require("../Utils/functions");
const Users = require("../Models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { avtar, name, username, password } = req.body;
  const response = await Users.findOne({ username: username });

  if (response) {
    return sendResponse(res, "Failed", "Username already taken");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const resFromDB = await Users.create({
      avtar,
      name,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: resFromDB._id }, process.env.JWT_TOKEN);
    setCookie(res, token);
    sendResponse(res, "Success", "User added", resFromDB);
    log(resFromDB);
  } catch (error) {
    sendResponse(res, "failed", "Username already taken");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let resFromDB = await Users.findOne({ username });
    if (!resFromDB) {
      return sendResponse(res, "Failed", "No such record found");
    }

    const isPasswordValid = await bcrypt.compare(password, resFromDB.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: resFromDB._id }, process.env.JWT_TOKEN);
      setCookie(res, token);
      sendResponse(res, "Success", "User found", resFromDB);
    }
  } catch (error) {
    sendResponse(res, "Failed", "Internal server error", error.message);
  }
};

const getUserDetails = async (req, res) => {

  const {userId}  = req.params;

  try {
    const resFromDB = await Users.findById(userId);
    sendResponse(res, "Success", "User found", resFromDB);
  } catch (error) {
    sendResponse(res, "Failed", "User not found", error.message);
  }
};

const followUser = async (req, res) => {
  let { userToFollow } = req.params;

  try {
    userToFollow = await Users.findOne({ _id: userToFollow });
    const loggedInUser = await getUser(req, res);

    if (!userToFollow) {
      return sendResponse(res, "Failed", "No such record exists");
    }

    const isFollowing = loggedInUser.following.some((user) =>
      user._id.equals(userToFollow._id)
    );

    if (isFollowing) {
      await Users.updateOne(
        { _id: loggedInUser._id },
        { $pull: { following: userToFollow._id } }
      );
      await Users.updateOne(
        { _id: userToFollow._id },
        { $pull: { followers: loggedInUser._id } }
      );
      sendResponse(res, "Success", "Unfollowed", loggedInUser);
    } else {
      await Users.updateOne(
        { _id: loggedInUser._id },
        { $push: { following: userToFollow } }
      );
      await Users.updateOne(
        { _id: userToFollow._id },
        { $push: { followers: loggedInUser } }
      );

      sendResponse(res, "Success", "Followed", loggedInUser);
    }
  } catch (error) {
    sendResponse(res, "Failed", "Internal server error", error.message);
  }
};

const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  res.status(200).json({ message: "User logged out" });
};

module.exports = { signup, login, getUserDetails, followUser, logout };
