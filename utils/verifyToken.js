const jwt = require("jsonwebtoken");
const AppError = require("./AppError");
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const jwtSecret = process.env.jwtSecret;
    if (!token) return next(new AppError("Provide Token... ", 400));
    const { id, role } = await jwt.verify(token, jwtSecret);
    const user = await User.findOne({ _id: id });
    if (!user) return next(new AppError("Token is not Valid", 400));
    req.user = user;
    // req.role = role;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 400));
  }
};

module.exports = verifyToken;
