const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const PermissionData = require("../seeds/PermissionData")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [32, "Name cannot exceed 32 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  mobile: {
    type: String,
    maxLength: [14, "Mobile number cannot exceed 14 characters"],
    required: [true, "Please enter mobile number"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
  },

  designation: {
    type: String,
    required: [true, "Please Enter Your Designation"],
  },

  branch_id: {
    type: String,
    required: [true, "Please Enter Branch Id"],
  },
  image: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },

  permissions: {
    type: Array,
    default: [],
    select: true
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
    default: null,
  },
  created_at: { type: Date, default: Date.now },
  updated_by: {
    type: String,
    trim: true,
    default: "N/A",
  },
  updated_at: { type: Date, default: Date.now },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// schema.pre funtion run before create modal

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// // JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// // Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// // Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
const user = mongoose.model("User", userSchema);

let userData = [
  {
    user_id: "u100",
    name: "Admin",
    email: "admin@dg.com",
    password: "admin12345",
    created_by: "Super Admin",
    mobile: "01911785317",
    designation: "Manager",
    branch_id: 1
  },
  {
    user_id: "u101",
    name: "User",
    email: "user@dg.com",
    password: "user12345",
    created_by: "Super Admin",
    mobile: "01911785318",
    designation: "Manager",
    branch_id: 1
  },
];
const saveData = async () => {
  let totalData = await user.countDocuments();
  console.log("totalData 123456", totalData);
  console.log(PermissionData)

  if (totalData < 1) {
    for (let index = 0; index < userData.length; index++) {
      const element = userData[index];

      console.log("element", element);
      element.permissions = PermissionData.map(p => p.name);
      const userDoc = new user(element);
      await userDoc.save();
    }
  }
};
saveData().then(r => {
  console.log(r)
});
