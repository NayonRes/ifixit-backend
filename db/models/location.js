const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  parent_id: {
    type: String,
    required: [false, "Please enter location id"],
  },
  name: {
    type: String,
    required: [true, "Please enter category name"],
    trim: true,
    unique: true,
  },
  remarks: {
    type: String,
    trim: true
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

const location = mongoose.model("location", locationSchema);

const saveData = async () => {
  let totalData = await location.countDocuments();
  console.log("totalData 123456", totalData);
  if (totalData < 1) {
    const locDoc = new location({
      name: "Primary",
      remarks: "Primary",
    });
    await locDoc.save();
  }
};
saveData();

module.exports = location;
