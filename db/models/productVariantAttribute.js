const mongoose = require("mongoose");

const productVariantAttributeSchema = mongoose.Schema({
  product_id: {
    type: String,
    index: true,
    required: [true, "Please enter spare parts id"],
  },
  key: {
    type: String,
    required: [false, "Please enter SKU"],
    index: true,
    trim: true
  },
  value: {
    type: String,
    trim: true
  },
});

const productVariantAttribute = mongoose.model("product_variant_attributes", productVariantAttributeSchema);

module.exports = productVariantAttribute;
