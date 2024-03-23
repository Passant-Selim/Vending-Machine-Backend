const express = require("express");
const router = express.Router();

const verifySellerToken = require("../utils/sellerToken");
const verifyToken = require("../utils/verifyToken");
const verifyBuyerToken = require("../utils/buyerToken");

const {
  createProduct,
  updateProduct,
  getProducts,
  deleteProduct,
  buyProduct,
  addDposit,
  resetDeposit,
} = require("../conttrollers/productController");

// create product "Seller"
router.post("/", verifySellerToken, createProduct);

// get products "seller & buyer"
router.get("/", verifyToken, getProducts);

// update product "seller"
router.patch("/:id", verifySellerToken, updateProduct);

// delete product "seller"
router.delete("/:id", verifySellerToken, deleteProduct);

///////////////////////////////////////////
/////Buyer

/// add deposit
router.post("/deposit", verifyBuyerToken, addDposit);

// buy product "buyer"
router.post("/:id/buy", verifyBuyerToken, buyProduct);

/// reset deposit
router.put("/:id/reset", verifyBuyerToken, resetDeposit);

module.exports = router;
