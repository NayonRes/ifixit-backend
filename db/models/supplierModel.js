const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the product name"],
    trim: true,
    unique: true,
    maxLength: [60, "Name can not exceed 60 character"],
  },
  description: {
    type: String,
    trim: true,
    maxLength: [3000, "Name can not exceed 3000 character"],
  },
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

module.exports = mongoose.model("suppliers", supplierSchema);
