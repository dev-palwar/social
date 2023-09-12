const sendResponse = (res, status, message, resFromDB) => {
  res.json({
    status: status,
    message: message,
    resFromDB,
  });
};

const setCookie = (res, token) => {
  res.cookie("token", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    SameSite: "none"
  });
};

const destroyCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.status(200).json({ message: "user loggout out" });
};

const log = (value) => {
  console.log(value);
};

const getUser = async (req, res) => {
  const loggedInUser = await req.user;
  if (!loggedInUser) {
    return sendResponse(res, "Failed", "Account does not exists");
  }
  return loggedInUser;
};

module.exports = { sendResponse, setCookie, destroyCookie, log, getUser };
