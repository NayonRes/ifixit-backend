const mongoose = require("mongoose");
const PermissionData = require("../seeds/PermissionData");

const permissionSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter permission name"],
    trim: true,
    unique: true,
  },
  module_name: {
    type: String,
    required: [true, "Please enter module name"],
  },
  description: {
    type: String,
    required: [true, "Please enter module name"],
  },
  remarks: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const permission = mongoose.model("permission", permissionSchema);

const saveData = async () => {
  // console.log("PermissionData", PermissionData);
  let totalData = await permission.countDocuments();
  console.log("totalData 123456", totalData);
  if (totalData < 1) {
    for (let index = 0; index < PermissionData.length; index++) {
      const element = PermissionData[index];

      const permissionDoc = new permission({
        permission_id: element.permission_id,
        name: element.name,
        description: element.description,
        module_name: element.module_name,
      });
      await permissionDoc.save();
    }
  }
};
saveData();

module.exports = permission;
