const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
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

const device = mongoose.model("devices", deviceSchema);

const saveData = async () => {
  let totalData = await device.countDocuments();
  console.log("totalData: ", totalData);
  if (totalData < 1) {
    const branchDoc = new device({
      name: "Primary",
    });
    await branchDoc.save();
  }
};
saveData();

module.exports = device;
