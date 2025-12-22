import express from "express";
import { createEnquiry, getEnquiries, getEnquiryById, deleteEnquiry } from "../controllers/enquiryController.js";

const router = express.Router();

// CREATE (Public) & GET ALL (Admin)
router.route("/").post(createEnquiry);
router.route("/").get(getEnquiries);

// GET & DELETE by ID (Admin)
router.route("/:id").get(getEnquiryById);
router.route("/:id").delete(deleteEnquiry);

export default router;
