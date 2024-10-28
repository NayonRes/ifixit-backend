const mongoose = require("mongoose");
const validator = require("validator");

const supplierSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the product name"],
    trim: true,
    unique: true,
    maxLength: [60, "Name can not exceed 60 character"],
  },
  mobile: {
    type: String,
    maxLength: [14, "Mobile number cannot exceed 14 characters"],
    required: [true, "Please enter serviceCustomer name"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  organisation_name: {
    type: String,
    trim: true,
    default: null
  },
  organisation_address: {
    type: String,
    trim: true,
    default: null
  },
  description: {
    type: String,
    trim: true,
    maxLength: [3000, "Name can not exceed 3000 character"],
  },
  address: {
    type: String,
    trim: true,
    default: null
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
