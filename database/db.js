const mongoose = require("mongoose");
const mongodbURL = process.env.mongodbURL;

mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log("App connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
