const mongoose = require("mongoose");

const branchSchema = mongoose.Schema({
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

const branch = mongoose.model("branch", branchSchema);

const saveData = async () => {
  let totalData = await branch.countDocuments();
  console.log("totalData 123456", totalData);
  if (totalData < 1) {
    const branchDoc = new branch({
      name: "Primary",
    });
    await branchDoc.save();
  }
};
saveData();

module.exports = branch;
