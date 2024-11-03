const mongoose = require("mongoose");

const sparePartsSchema = mongoose.Schema({
  category_id: {
    type: String,
    required: [true, "Please enter the product category"],
  },
  brand_id: {
    type: String,
    required: [true, "Please enter the product brand"],
  },
  device_id: {
    type: String,
    required: [true, "Please enter the product device type"],
  },
  model_id: {
    type: String,
    required: [true, "Please enter the product model"],
  },
  name: {
    type: String,
    required: [true, "Please enter the product name"],
    trim: true,
    maxLength: [60, "Name can not exceed 60 character"],
  },
  description: {
    type: String,
    required: [true, "Please enter the product description"],
    trim: true,
    maxLength: [3000, "Name can not exceed 3000 character"],
  },

  warranty: {
    type: String,
    required: [true, "Please enter the product warranty"],
    trim: true,
    maxLength: [60, "Name can not exceed 60 character"],
    default: null
  },

  images: [
    {
      public_id: {
        type: String,
        // default: "N/A",
        // required: true,
      },
      url: {
        type: String,
        // required: true,
        // default: "N/A",
      },
    },
  ],

  remarks: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_by: {
    type: String,
    trim: true,
    default: "Admin",
  },
  created_at: { type: Date, default: Date.now },
  updated_by: {
    type: String,
    trim: true,
    default: "N/A",
  },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("spare_parts", sparePartsSchema);
