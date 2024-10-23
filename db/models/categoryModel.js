const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  parent_id: {
    type: String,
    default: null
  },
  name: {
    type: String,
    required: [true, "Please enter category name"],
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
 
const categoryModel = mongoose.model("category", categorySchema);

const saveData = async () => {
  let totalData = await categoryModel.countDocuments();
  console.log("totalData 123456", totalData);
  if (totalData < 1) {
    const catDoc = new categoryModel({
      name: "Primary",
    });
    await catDoc.save();
  }
};
saveData();

module.exports = categoryModel;
