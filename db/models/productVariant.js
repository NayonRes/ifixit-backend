const mongoose = require("mongoose");

const productVariantSchema = mongoose.Schema({
  product_id: {
    type: String,
    index: true,
    required: [true, "Please enter spare parts id"],
  },
  sku: {
    type: String,
    required: [false, "Please enter SKU"],
    index: true,
    trim: true,
    unique: true
  },
  purchase_price: {
    type: Number,
    default: 0
  },
  selling_price: {
    type: Number,
    default: 0
  },
  strike_price: {
    type: Number,
    default: 0
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const productVariant = mongoose.model("product_variants", productVariantSchema);

module.exports = productVariant;
