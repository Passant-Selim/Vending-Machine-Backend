const AppError = require("../utils/AppError");
const Product = require("../models/productModel");

// create product "Seller"
const createProduct = async (req, res, next) => {
  try {
    const { name, quantity, cost } = req.body;

    const product = await Product.create({
      name,
      quantity,
      cost,
      seller: req.user._id,
    });

    req.user.products.push(product._id);
    await req.user.save();
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Failed to create product", 500));
  }
};

// get product "seller & buyer"
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("seller", "userName");

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Failed to fetch products", 500));
  }
};

// update product "seller"
const updateProduct = async (req, res, next) => {
  try {
    const { name, quantity, cost } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name,
      quantity,
      cost,
    });
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Failed to update product", 500));
  }
};

// delete product "seller"
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    req.user.products.pull(product._id);
    await req.user.save();

    res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Failed to delete product", 500));
  }
};
//////////////////////////////////////////////////////////////
/// Buyer

/// deposit
const addDposit = async (req, res, next) => {
  try {
    const { deposit } = req.body;

    if (!deposit) {
      return next(new AppError("Please enter all required", 400));
    }

    if (req.user.deposit < 0) {
      return next(new AppError("Insufficient deposit", 403));
    }

    req.user.deposit += deposit;
    await req.user.save();
    res.status(200).json({
      message: "Deposit added successfully",
      deposit: req.user.deposit,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Failed to add deposit", 500));
  }
};

// buy product "buyer"
const buyProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (product.quantity === 0) {
      return next(new AppError("Product is out of stock", 403));
    }

    if (product.cost > req.user.deposit) {
      return next(new AppError("Insufficient deposit", 403));
    }
    product.quantity -= 1;
    await product.save();

    req.user.deposit -= product.cost;
    await req.user.save();

    res.status(200).json({
      message: "Product purchased successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Failed to purchase product", 500));
  }
};

// reset deposit
const resetDeposit = (req, res, next) => {
  try {
    req.user.deposit = 0;
    req.user.save();
    res.status(200).json({
      message: "Deposit reset successfully",
      deposit: req.user.deposit,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Failed to reset deposit", 500));
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  deleteProduct,
  buyProduct,
  addDposit,
  resetDeposit,
};
