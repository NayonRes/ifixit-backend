const mongoose = require("mongoose");
const validator = require("validator");

const serviceCustomerSchema = mongoose.Schema({
  serviceCustomer_id: {
    type: String,
    required: [true, "Please enter serviceCustomer id"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter serviceCustomer name"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },

  number: {
    type: String,
    maxLength: [14, "Mobile number cannot exceed 14 characters"],
    required: [true, "Please enter serviceCustomer name"],
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  behavior: {
    type: String,
    required: [true, "Please enter serviceCustomer name"],
    trim: true,
  },
  membership_id: {
    type: String,
    trim: true,
  },
  due_limit: {
    type: Number,
    min: 0,
    default: 0,
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

const customerModel = mongoose.model(
  "serviceCustomer",
  serviceCustomerSchema
);

module.exports = customerModel;
