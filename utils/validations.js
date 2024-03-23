const joi = require("joi");
const AppError = require("./AppError");

// create
const create = joi.object({
  userName: joi.string().min(3).max(10).required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{0,9}$")).required(),
});

const createValidation = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    await create.validateAsync({
      userName,
      password,
    });
  } catch (err) {
    return next(err);
  }
  next();
};

const login = joi.object({
  userName: joi.string().min(3).max(10).required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{0,9}$")).required(),
});

const loginValidation = async (req, res, next) => {
  try {
    const { error } = await login.validate(req.body);

    if (error) {
      throw new AppError(error.message, 404);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { createValidation, loginValidation };
