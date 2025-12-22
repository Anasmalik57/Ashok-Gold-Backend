import express from "express";
import { getCategories, getCategoryById, updateCategory, deleteCategory, createCategory } from "../controllers/categoryController.js";

const router = express.Router();

// GET all categories + GET by ID
router.route("/").get(getCategories);
router.route("/").post(createCategory)
router.route("/:id").get(getCategoryById);

// Update and Delete
router.route("/:id").put(updateCategory);
router.route("/:id").delete(deleteCategory);

export default router;
