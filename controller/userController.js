const userModel = require("../db/models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const imageUpload = require("../utils/imageUpload");
const imageDelete = require("../utils/imageDelete");
const jwt = require("jsonwebtoken");
const validationResponseBuilder = require("../builder/validationResponseBuilder");
const sendToken = require("../utils/jwtToken");

const index = catchAsyncError(async (req, res, next) => {
  console.log("getDataWithPagination");

  console.log("req.cookies ---------------------------------", req.cookies);
  const page = parseInt(req.query.page) || 1;
  console.log("===========req.query.page", req.query.page);
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  var query = {};
  if (req.query.name) {
    query.name = new RegExp(`^${req.query.name}$`, "i");
  }

  if (req.query.email) {
    query.email = new RegExp(`^${req.query.email}$`, "i");
  }
  if (req.query.email) {
    query.customer_phone = new RegExp(`^${req.query.email}$`, "i");
  }
  // if (req.query.status) {
  //   query.status = req.query.status;
  // }

  let totalData = await userModel.countDocuments(query);
  console.log("totalData=================================", totalData);
  // const data = await userModel
  //   .find(query)
  //   .sort({ created_at: -1 })
  //   .skip(startIndex)
  //   .limit(limit);

  const data = await userModel.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "roles", // The name of the Role model collection in your database
        localField: "role_id", // Field in userModel that holds the role ID
        foreignField: "role_id", // Field in roleModel that the role ID refers to
        as: "role", // The name of the field to add the result to
      }
    },
    {
      $lookup: {
        from: "branches", // The name of the Role model collection in your database
        localField: "branch_id", // Field in userModel that holds the role ID
        foreignField: "branch_id", // Field in roleModel that the role ID refers to
        as: "branch", // The name of the field to add the result to
      },
    },
    {
      $project: {
        _id: 1,
        user_id: 1,
        name: 1,
        email: 1,
        password: 1,
        number: 1,
        designation: 1,
        image: 1,
        status: 1,
        created_by: 1,
        created_at: 1,
        updated_by: 1,
        updated_at: 1,
        "role._id": 1,
        "role.role_id": 1,
        "role.name": 1,
        "branch._id": 1,
        "branch.branch_id": 1,
        "branch.name": 1,
        permissions: 1,
      },
    },
    // { $unwind: "$role" }, // Unwind the array if you expect only one related role per user
    // { $sort: { created_at: -1 } },
    { $skip: startIndex },
    { $limit: limit },
  ]);
  console.log("data", data);
  res.status(200).json({
    success: true,
    message: "successful",
    data: data,
    totalData: totalData,
    pageNo: page,
    limit: limit,
  });
});

const store = catchAsyncError(async (req, res, next) => {
  // console.log("req.files", req.files);
  // console.log("req.body", req.body);
  const { token } = req.cookies;
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (user) {
    return validationResponseBuilder(res, {email: "The email is already taken"});
  }

  let imageData = [];
  if (req.files) {
    imageData = await imageUpload(req.files.image, "users", next);
  }
  console.log("imageData", imageData);

  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let newData = {
    ...req.body,
    image: imageData[0],
    created_by: decodedData?.user?.email,
  };
  console.log("newData --------------------------1212", newData);
  const data = await userModel.create(newData);
  res.send({ message: "success", status: 201, data: data });
});

const remove = catchAsyncError(async (req, res, next) => {
  console.log("deleteData function is working");
  let data = await userModel.findById(req.params.id);
  console.log("data====================", data.image.public_id);

  if (!data) {
    console.log("if");
    return next(new ErrorHandler("No data found", 404));
  }

  // if (data.images.length > 0) {
  //   for (let index = 0; index < data.images.length; index++) {
  //     const element = data.images[index];
  //     await imageDelete(element.public_id);
  //   }
  // }
  if (data.image.public_id !== undefined) {
    console.log("========================if data.image====================");
    await imageDelete(data.image.public_id, next);
  }
  await data.remove();
  res.status(200).json({
    success: true,
    message: "Delete successfully",
    data: data,
  });
});

const show = catchAsyncError(async (req, res, next) => {
  let data = await userModel.findById(req.params.id).populate('permissions');
  if (!data) {
    return res.send({ message: "No data found", status: 404 });
  }
  res.send({ message: "success", status: 200, data: data });
});


// update User Profile
const update = catchAsyncError(async (req, res, next) => {
  console.log("req.params.id =======================", req.params.id);
  const { token } = req.cookies;

  const userData = await userModel.findById(req.params.id);

  if (!userData) {
    return next(new ErrorHandler("No data found", 404));
  }
  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  const newUserData = {
    name: req.body.name,
    // email: req.body.email,
    role_id: req.body.role_id,
    status: req.body.status,

    updated_by: decodedData?.user?.email,
    updated_at: new Date(),
  };
  console.log("newUserData", newUserData);
  console.log("req.body.avatar", req.body);

  // if (req.body.avatar !== "" || req.body.avatar !== undefined) {

  console.log("userData----------------", userData);

  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);
  let imageData = [];
  if (req.files) {
    imageData = await imageUpload(req.files.image, "users", next);
  }
  if (imageData.length > 0) {
    newUserData.image = imageData[0];
  }
  if (userData.image.public_id) {
    console.log("previous image delete");

    await imageDelete(userData.image.public_id, next);
  }
  console.log("imageData", imageData);

  // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: "avatars",
  //   width: 150,
  //   crop: "scale",
  // });

  // newUserData.image = {
  //   public_id: myCloud.public_id,
  //   url: myCloud.secure_url,
  // };

  console.log("2222222222222222222222222222222222");
  // }
  console.log("3333333333333333333333333");
  const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "successful",
    user,
  });
});

const assignPermission = catchAsyncError(async (req, res, next) => {
  try {
    // 1. Fetch the user by ID (from the request)
    let user = await userModel.findById(req.user._id);

    // 2. Check if user exists
    if (!user) {
      return res.status(404).send({ message: "User not found", status: 404 });
    }

    // 3. Validate the permissions (ensure it's an array of permission strings or IDs)
    if (!req.body.permissions || !Array.isArray(req.body.permissions)) {
      return res.status(400).send({ message: "Invalid permissions data", status: 400 });
    }

    // 4. Assign permissions to the user (assuming permissions are strings or IDs)
    user.permissions = req.body.permissions;

    // 5. Save the updated user object
    await user.save();

    // 6. Respond with success message
    res.status(200).send({ message: "Permissions assigned successfully", status: 200, data: user });

  } catch (error) {
    // 7. Error handling
    res.status(500).send({ message: "Server error", status: 500, error: error.message });
  }
});

module.exports = {
  index,
  show,
  store,
  update,
  remove,
  assignPermission
};
