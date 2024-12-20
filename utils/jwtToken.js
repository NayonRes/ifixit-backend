const jwt = require("jsonwebtoken");
const sendToken = (user, statusCode, res) => {
  // const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  console.log("user===========", user);

  let newUser = {
    _id: user._id,
    name: user.name || null,
    email: user.email || null,
    image: user.image || null,
    permissions: user.permissions || [],
    status: user.status || false,
  };
  console.log("newUser==============", newUser); 

  const token = jwt.sign({ user: newUser }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: newUser,
    token,
  });
};

module.exports = sendToken;
