const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const user = require("./routes/userRoute");
const product = require("./routes/productRout");

require("dotenv").config();
require("./database/db");

const port = process.env.port;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/user", user);
app.use("/product", product);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    status: statusCode,
    message: err?.message || "Internal Server",
    error: err?.message || [],
  });
});

app.listen(port, () => {
  console.log(`Server listens on port ${port}`);
});
