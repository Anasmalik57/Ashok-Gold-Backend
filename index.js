import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import connectDB from "./src/config/connectDB.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import bannerRoutes from "./src/routes/bannerRoutes.js";
import enquiryRoutes from "./src/routes/enquiryRoutes.js";
import job from "./src/config/cron.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") {
  job.start();
}

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        "https://ashok-gold.vercel.app",
        "http://localhost:3000",
      ];

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/enquiries", enquiryRoutes);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
