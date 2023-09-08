const express = require("express");
const { sendResponse } = require("../Utils/functions");
const { signup, login, logout, followUser } = require("../controllers/users");
const ifAuthenticated = require("../middlewares/Auth");

const router = express.Router();

router.get("/", (req, res) => {
  sendResponse(res, "Success", "API working fine");
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/follow/:userToFollow", ifAuthenticated, followUser);
router.get("/logout", ifAuthenticated, logout);

module.exports = router;
