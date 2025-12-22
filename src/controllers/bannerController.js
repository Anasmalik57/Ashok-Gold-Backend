import asyncHandler from "express-async-handler";
import Banner from "../models/Banner.js";


const createBanner = asyncHandler(async (req, res) => {
  const { bannerName, image, status } = req.body;

  if (!bannerName || !image) {
    res.status(400);
    throw new Error("Banner name and image are required");
  }

  // Optional: Prevent duplicate banner names
  const bannerExists = await Banner.findOne({
    bannerName: { $regex: `^${bannerName.trim()}$`, $options: "i" }
  });

  if (bannerExists) {
    res.status(400);
    throw new Error("Banner with this name already exists");
  }

  const banner = await Banner.create({
    bannerName: bannerName.trim(),
    image,
    status: status || "active"
  });

  res.status(201).json({
    success: true,
    message: "Banner created successfully",
    data: banner
  });
});


const getBanners = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const query = status ? { status } : {};

  const total = await Banner.countDocuments(query);
  const banners = await Banner.find(query)
    .select("bannerName image status createdAt")
    .sort({ createdAt: -1 })
   

  res.json({
    success: true,
    count: banners.length,
    total,
    data: banners,
  });
});


const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  res.json({
    success: true,
    data: banner,
  });
});


const updateBanner = asyncHandler(async (req, res) => {
  const { bannerName, image, status } = req.body;

  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  // Prevent duplicate name (except current one)
  if (bannerName && bannerName.trim() !== banner.bannerName) {
    const exists = await Banner.findOne({
      bannerName: { $regex: `^${bannerName.trim()}$`, $options: "i" },
      _id: { $ne: req.params.id }
    });
    if (exists) {
      res.status(400);
      throw new Error("Another banner with this name already exists");
    }
  }

  banner.bannerName = bannerName?.trim() || banner.bannerName;
  banner.image = image || banner.image;
  banner.status = status || banner.status;

  const updatedBanner = await banner.save();

  res.json({
    success: true,
    message: "Banner updated successfully",
    data: updatedBanner,
  });
});


const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  await Banner.deleteOne({ _id: req.params.id });

  res.json({
    success: true,
    message: "Banner deleted successfully",
  });
});

export { createBanner, getBanners, getBannerById, updateBanner, deleteBanner };