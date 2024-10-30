const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter branch name"],
    trim: true,
    unique: true,
  },
  remarks: {
    type: String,
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

const brand = mongoose.model("brands", brandSchema);

const saveData = async () => {
  let totalData = await brand.countDocuments();
  console.log("totalData: ", totalData);
  if (totalData < 1) {
    const branchDoc = new brand({
      name: "Primary"
    });
    await branchDoc.save();
  }
};
saveData();

module.exports = brand;
