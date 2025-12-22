import express from "express";
import { createBanner, getBanners, getBannerById, updateBanner, deleteBanner } from "../controllers/bannerController.js";

const router = express.Router();

// CREATE & GET ALL
router.route("/").post(createBanner);
router.route("/").get(getBanners);

// GET, UPDATE, DELETE by ID
router.route("/:id").get(getBannerById);
router.route("/:id").put(updateBanner);
router.route("/:id").delete(deleteBanner);

export default router;
