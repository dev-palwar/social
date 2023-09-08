const jwt = require("jsonwebtoken");
const { sendResponse } = require("../Utils/functions");
const Users = require("../Models/users");

const ifAuthenticated = (req, res, next) => {
  if (!req.cookies.token) {
    return sendResponse(res, "Failed", "Login first");
  }

  const decodedData = jwt.verify(req.cookies.token, process.env.JWT_TOKEN);
  try {
    req.user = Users.findById(decodedData._id);
  } catch (error) {
    sendResponse(res, "Failed", "User does not exists");
  }
  next();
};

module.exports = ifAuthenticated;
