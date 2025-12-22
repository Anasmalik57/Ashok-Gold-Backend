import { Schema, model } from 'mongoose';

const bannerSchema = new Schema(
  {
    bannerName: {
      type: String,
      required: [true, 'Banner name is required'],
      trim: true,
      maxlength: [150, 'Banner name cannot exceed 150 characters'],
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
bannerSchema.index({ status: 1, bannerName: 1 });

// Export the model
const Banner = model('Banner', bannerSchema);

export default Banner;