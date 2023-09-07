const sendResponse = (res, status, message, resFromDB) => {
  res.json({
    status: status,
    message: message,
    resFromDB,
  });
};

const setCookie = (token) => {
  res.cookie("token", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
};

module.exports = {sendResponse, setCookie};
