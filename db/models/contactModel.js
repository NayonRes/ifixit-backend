const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = mongoose.Schema({
  member_id: {
    type: String,
    required: [true, "Please enter serviceCustomer name"],
    trim: true,
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
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },

  mobile: {
    type: String,
    maxLength: [14, "Mobile number cannot exceed 14 characters"],
    required: [true, "Please enter serviceCustomer name"],
    unique: true,
    trim: true,
  },

  address: {
    type: String,
    trim: true,
    default: null
  },

  remarks: {
    type: String,
  },

  type: {
    type: String,
    trim: true,
    default: 'Walking'
  },

  rating: {
    type: String,
    trim: true,
    default: null
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

const contactModel = mongoose.model(
  "contacts",
    contactSchema
);

module.exports = contactModel;
