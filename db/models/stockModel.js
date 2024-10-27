const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
  product_id: {
    type: String,
    index: true,
    required: [true, "Please enter spare parts id"],
  },
  product_variant_id: {
    type: String,
    required: [true, "Please enter service name"],
    index: true,
    trim: true
  },
  qty: {
    type: Number,
    default: 0
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const stockModel = mongoose.model("stocks", stockSchema);

module.exports = stockModel;
