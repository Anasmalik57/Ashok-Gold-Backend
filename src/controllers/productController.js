import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

const createProduct = asyncHandler(async (req, res) => {
  // CHANGE: Added productCategory to destructuring
  const { productName, image, description, status, productCategory } = req.body;

  // CHANGE: Added productCategory to validation (keeps previous checks intact)
  if (!productName || !image || !description || !productCategory) {
    res.status(400);
    throw new Error("Product name, image, description, and product category are required");
  }

  const productExists = await Product.findOne({
    productName: { $regex: `^${productName.trim()}$`, $options: "i" },
  });

  if (productExists) {
    res.status(400);
    throw new Error("Product with this name already exists");
  }

  // CHANGE: Added productCategory to create (with trim for consistency)
  const product = await Product.create({
    productName: productName.trim(),
    image,
    description: description.trim(),
    productCategory: productCategory.trim(), // NEW
    status: status || "active",
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// ===============================================================
// ===============================================================

const getProducts = asyncHandler(async (req, res) => {
  const { status, search, category } = req.query; // CHANGE: Added 'category' to query params (optional, for filtering)

  let query = {};

  if (status) query.status = status;
  if (search) {
    query.$text = { $search: search };
  }
  // NEW: Optional filter by category (doesn't affect existing logic)
  if (category) query.productCategory = category;

  const total = await Product.countDocuments(query);
  // CHANGE: Added productCategory to select (previous fields unchanged)
  const products = await Product.find(query)
    .select("productName image description status productCategory createdAt") // UPDATED: Added productCategory
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    total,
    data: products,
  });
});

// ===============================================================
// ===============================================================
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    data: product,
  });
});

// ===============================================================
// ===============================================================

const updateProduct = asyncHandler(async (req, res) => {
  // CHANGE: Added productCategory to destructuring
  const { productName, image, description, status, productCategory } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Prevent duplicate name (except for itself)
  if (productName && productName.trim() !== product.productName) {
    const exists = await Product.findOne({
      productName: { $regex: `^${productName.trim()}$`, $options: "i" },
      _id: { $ne: req.params.id },
    });
    if (exists) {
      res.status(400);
      throw new Error("Another product with this name already exists");
    }
  }

  // CHANGE: Added productCategory to update (with trim, optional update like others)
  product.productName = productName?.trim() || product.productName;
  product.image = image || product.image;
  product.description = description?.trim() || product.description;
  product.productCategory = productCategory?.trim() || product.productCategory; // NEW
  product.status = status || product.status;

  const updatedProduct = await product.save();

  res.json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

// ===============================================================
// ===============================================================

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Product.deleteOne({ _id: req.params.id });

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
});

// ===============================================================
// ===============================================================

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};