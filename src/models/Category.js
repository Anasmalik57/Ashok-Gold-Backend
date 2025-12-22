import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
      index: true
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: '{VALUE} is not a valid status'
      },
      default: 'active',
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound index for common queries
categorySchema.index({ status: 1, categoryName: 1 });

// Export the model
const Category = model('Category', categorySchema);

export default Category;