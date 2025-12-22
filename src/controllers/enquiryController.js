import asyncHandler from "express-async-handler";
import Enquiry from "../models/Enquiry.js";

const createEnquiry = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400);
    throw new Error("Request body is missing or empty");
  }

  const { enquirerName, phone, productName, dateOfEnquiry } = req.body;

  if (!enquirerName || !phone || !productName) {
    res.status(400);
    throw new Error("Enquirer name, phone, and product name are required");
  }

  const enquiry = await Enquiry.create({
    enquirerName: enquirerName.trim(),
    phone: phone.trim(),
    productName: productName.trim(),
    dateOfEnquiry: dateOfEnquiry || Date.now(),
  });

  res.status(201).json({
    success: true,
    message: "Enquiry submitted successfully",
    data: enquiry,
  });
});

const getEnquiries = asyncHandler(async (req, res) => {
  const { phone, productName, startDate, endDate } = req.query;

  let query = {};

  if (phone) query.phone = phone;
  if (productName) {
    query.productName = { $regex: productName, $options: "i" };
  }
  if (startDate || endDate) {
    query.dateOfEnquiry = {};
    if (startDate) query.dateOfEnquiry.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.dateOfEnquiry.$lte = end;
    }
  }

  const total = await Enquiry.countDocuments(query);
  const enquiries = await Enquiry.find(query)
    .select("enquirerName phone productName dateOfEnquiry createdAt")
    .sort({ dateOfEnquiry: -1 });

  res.json({
    success: true,
    count: enquiries.length,
    total,
    data: enquiries,
  });
});

const getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  res.json({
    success: true,
    data: enquiry,
  });
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  await Enquiry.deleteOne({ _id: req.params.id });

  res.json({
    success: true,
    message: "Enquiry deleted successfully",
  });
});

export { createEnquiry, getEnquiries, getEnquiryById, deleteEnquiry };
