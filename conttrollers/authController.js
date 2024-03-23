const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// create user
const createUser = async (req, res, next) => {
  const { userName, password, role, deposit } = req.body;
  if (userName.length < 4 || userName.length > 10) {
    return res
      .status(400)
      .json({ message: "User Name must be less than 10 and more than 3" });
  }

  if (!/^[a-zA-Z0-9]{0,9}$/.test(password) || !/\d/.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 9 characters and contain at least one number",
    });
  }

  try {
    const jwtSecret = process.env.jwtSecret;
    let user;

    if (role === "buyer") {
      if (!deposit) {
        return next(new AppError("Buyer must provide a deposit", 400));
      } else {
        user = await User.create({
          userName,
          password,
          role,
          deposit,
        });
      }
    } else {
      if (deposit) {
        return next(new AppError("Seller mustn't provide a deposit", 400));
      } else {
        user = await User.create({
          userName,
          password,
          role,
        });
      }
    }

    user.setPassword(password);

    const savedUser = await user.save();

    const maxAge = 3 * 60 * 60;
    const token = jwt.sign(
      { id: savedUser._id, userName, role: savedUser.role },
      jwtSecret,
      {
        expiresIn: maxAge,
      }
    );
    //  console.log("Generated Token:", token);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({
      message: "User successfully created",
      id: savedUser._id,
      token,
    });
  } catch (err) {
    console.error(err);
    return next(new AppError("User not successfully created", 400));
  }
};

// logIn
const logIn = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const jwtSecret = process.env.jwtSecret;

    if (!userName || !password) {
      return next(new AppError("Please enter all required", 400));
    }

    const user = await User.findOne({ userName }).select("+password");
    console.log(userName);

    console.log(user);

    console.log(password);

    if (!user) return next(new AppError("User not found", 400));

    if (!user.validPassword(password)) {
      return next(new AppError("Invalid password", 400));
    }

    if (user.validPassword(password)) {
      const maxAge = 3 * 60 * 60;
      const token = jwt.sign(
        { id: user._id, userName: user.userName, role: user.role },
        jwtSecret,
        {
          expiresIn: maxAge,
        }
      );

      console.log("Generated Token:", token);

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });

      res.status(201).json({
        message: "User successfully Logged in",
        id: user._id,
        token,
        user,
      });
    } else {
      console.log("Password comparison failed");
      return next(new AppError("Login not successful", 400));
    }
  } catch (error) {
    console.error(error);
    return next(new AppError("An error occurred", 400));
  }
};

module.exports = { createUser, logIn };
