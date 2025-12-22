import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

const createCategory = asyncHandler(async (req, res) => {
  const { categoryName, image, status } = req.body;

  // Basic validation (extra safety, mongoose bhi validate karta hai)
  if (!categoryName || !image) {
    res.status(400);
    throw new Error("Category name and image are required");
  }

  // Check if category already exists (case-insensitive recommended)
  const categoryExists = await Category.findOne({
    categoryName: { $regex: `^${categoryName}$`, $options: "i" },
  });

  if (categoryExists) {
    res.status(400);
    throw new Error("Category with this name already exists");
  }

  const category = await Category.create({
    categoryName: categoryName.trim(),
    image,
    status: status || "active",
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const query = status ? { status } : {};

  const total = await Category.countDocuments(query);
  const categories = await Category.find(query)
    .select("categoryName image status createdAt")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: categories.length,
    total,
    data: categories,
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({
    success: true,
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryName, image, status } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.categoryName = categoryName || category.categoryName;
  category.image = image || category.image;
  category.status = status || category.status;

  const updatedCategory = await category.save();

  res.json({
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await Category.deleteOne({ _id: req.params.id }); // Hard delete
  // Or for soft delete: category.status = 'deleted'; await category.save();

  res.json({
    success: true,
    message: "Category deleted successfully",
  });
});

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
