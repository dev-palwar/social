const Users = require("../Models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendResponse = require("../Utils/response");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await Users.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: response._id }, process.env.JWT_TOKEN);
    setCookie(token);
    sendResponse(res, "Success", response);
  } catch (error) {
    sendResponse(res, "failed", error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let resFromDB = await Users.findOne({ email });
    if (!resFromDB) {
      return sendResponse(res, "Failed", "No such record found");
    }
    const data = await bcrypt.compare(password, resFromDB.password);
    sendResponse(res, "Success", "User found");
} catch (error) {
    sendResponse(res, "Failed", "Internal server error", error.message);
}
};

module.exports = { signup, login };
