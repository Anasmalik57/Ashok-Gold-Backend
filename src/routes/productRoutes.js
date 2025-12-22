import express from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

// CREATE & GET ALL
router.route("/").post(createProduct);
router.route("/").get(getProducts);

// GET, UPDATE, DELETE by ID
router.route("/:id").get(getProductById);
router.route("/:id").put(updateProduct);
router.route("/:id").delete(deleteProduct);

export default router;
