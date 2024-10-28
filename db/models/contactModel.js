const mongoose = require("mongoose");
const validator = require("validator");
const counterModel = require("./counterModel");

const contactSchema = mongoose.Schema({
  member_id: {
    type: Number,
    unique: true
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

async function getNextMemberId() {
  const result = await counterModel.findByIdAndUpdate(
      { _id: 'memberId' },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true } // upsert creates the document if it doesn't exist
  );
  return result.sequenceValue;
}

contactSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.member_id = await getNextMemberId();
  }
  next();
});

const contactModel = mongoose.model(
  "contacts",
    contactSchema
);

module.exports = contactModel;
