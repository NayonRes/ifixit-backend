const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  parent_id: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: [true, "Please enter branch name"],
    trim: true,
    unique: true,
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

const brand = mongoose.model("brands", brandSchema);

const saveData = async () => {
  let totalData = await brand.countDocuments();
  console.log("totalData 123456", totalData);
  if (totalData < 1) {
    const branchDoc = new brand({
      branch_id: "b100",
      name: "Primary",
      parent_name: "Primary",
    });
    await branchDoc.save();
  }
};
saveData();

module.exports = brand;
