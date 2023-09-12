const express = require("express");
const { sendResponse } = require("../Utils/functions");
const {
  signup,
  login,
  logout,
  followUser,
  getUserDetails,
} = require("../controllers/users");
const ifAuthenticated = require("../middlewares/Auth");

const router = express.Router();

router.get("/", (req, res) => {
  sendResponse(res, "Success", "User router is working");
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/getUser/:userId", getUserDetails);
router.get("/follow/:userToFollow", ifAuthenticated, followUser);
router.get("/logout", logout);

module.exports = router;
