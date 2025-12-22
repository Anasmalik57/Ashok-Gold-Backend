import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
      index: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for common queries
productSchema.index({ status: 1, productName: 1 });

// Text index for search functionality
productSchema.index({ productName: "text", description: "text" });

// Export the model
const Product = model("Product", productSchema);

export default Product;
