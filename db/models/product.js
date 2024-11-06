const mongoose = require("mongoose");
const productVariant = require("./productVariant");

const productSchema = mongoose.Schema({
  category_id: {
    type: String,
    // required: [true, "Please enter the product category"],
  },
  brand_id: {
    type: String,
    // required: [true, "Please enter the product category"],
  },
  device_id: {
    type: String,
    // required: [true, "Please enter the product category"],
  },
  model_id: {
    type: String,
    // required: [true, "Please enter the product category"],
  },
  product_type: {
    type: String,
    default: "product"
  },
  name: {
    type: String,
    // required: [true, "Please enter the product name"],
    trim: true,
    maxLength: [60, "Name can not exceed 60 character"],
  },
  description: {
    type: String,
    default: null
  },

  rating: [
    {
      total_user: {
        type: String,
        default: 5,
        // required: true,
      },
      total_rating_no: {
        type: Number,
        default: 23,
        // required: true,
      },
    },
  ],
  viewed: {
    type: Number,
    default: 0,
  },
  total_sales: {
    type: Number,
    default: 0,
    min: [0, "Sorry! sales can't be less than 0"],
  },
  sku: {
    type: String,
    required: [true, "Please enter the product name"],
    trim: true,
    maxLength: [20, "Name can not exceed 20 character"],
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

productSchema.methods.attachVariant = async function(variantData) {
  console.log(variantData)
  const variant = new productVariant({ ...variantData, product_id: this._id });
  await variant.save();
};

module.exports = mongoose.model("products", productSchema);
