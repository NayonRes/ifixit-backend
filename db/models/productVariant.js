const mongoose = require("mongoose");

const productVariantSchema = mongoose.Schema({
  product_id: {
    type: String,
    index: true,
    required: [true, "Please enter spare parts id"],
  },
  type: {
    type: String,
    required: [true, "Please enter Type"],
    index: true,
    trim: true
  },
  value: {
    type: String,
    required: [true, "Please enter Value"],
    index: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Please enter price"],
    index: true,
    trim: true,
    default: 0
  },
  attributes: {
    type: Array,
    required: [false, "You may add some attributes"],
    default: []
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const productVariant = mongoose.model("product_variants", productVariantSchema);

module.exports = productVariant;
