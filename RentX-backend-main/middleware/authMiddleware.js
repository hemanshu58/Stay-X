const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { errorHandler } = require("../utils/error");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token)
      return next(errorHandler(401, "No token, authorization denied."));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(errorHandler(404, "User not found."));

    req.user = user;
    next();
  } catch (error) {
    next(errorHandler(401, "Token is not valid."));
  }
};

module.exports = authenticate;
