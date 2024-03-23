const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

const { createUser, logIn } = require("../conttrollers/authController");
const { createValidation, loginValidation } = require("../utils/validations");

// create user
router.post("/", createValidation, createUser);
// get user
router.post("/login", loginValidation, logIn);

module.exports = router;
