const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let crypto = require("crypto");

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  deposit: {
    type: Number,
    validate: {
      validator: function (value) {
        return [5, 10, 20, 50, 100].includes(value);
      },
      message: "Deposit must be 5, 10, 20, 50, or 100",
    },
  },
  role: {
    type: String,
    enum: ["seller", "buyer"],
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  hash: String,
  salt: String,
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hash === hash;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
