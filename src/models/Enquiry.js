import { Schema, model } from 'mongoose';

const enquirySchema = new Schema(
  {
    enquirerName: {
      type: String,
      required: [true, 'Enquirer name is required'],
      trim: true,
      maxlength: [100, 'Enquirer name cannot exceed 100 characters'],
      index: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function(v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: 'Please enter a valid 10-digit phone number'
      },
      index: true
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
      index: true
    },
    dateOfEnquiry: {
      type: Date,
      required: [true, 'Date of enquiry is required'],
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound indexes for common queries
enquirySchema.index({ dateOfEnquiry: -1, productName: 1 });
enquirySchema.index({ phone: 1, productName: 1 });

// Export the model
const Enquiry = model('Enquiry', enquirySchema);

export default Enquiry;