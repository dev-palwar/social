const express = require("express");
const sendResponse = require("../Utils/response");
const usersController = require("../controllers/users");

const router = express.Router();

router.get("/", (req, res) => {
  sendResponse(res, "Success", "API working fine");
});

router.post("/signup", usersController.signup);
router.post("/login", usersController.login);

module.exports = router;
