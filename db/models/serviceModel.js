const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
  service_id: {
    type: String,
    required: [true, "Please enter service id"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter service name"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  branch_id: {
    type: String,
    // required: [true, "Please Enter Branch Id"],
  },
  operating_system_type: {
    type: String,
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

const serviceModel = mongoose.model("service", serviceSchema);

const saveData = async () => {
  let totalData = await serviceModel.countDocuments();
  console.log("totalData 123456", totalData);
  if (totalData < 1) {
    const catDoc = new serviceModel({
      service_id: "s100",
      name: "Primary",
      parent_name: "Primary",
    });
    await catDoc.save();
  }
};
saveData();

module.exports = serviceModel;
