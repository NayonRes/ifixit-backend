const categoryModel = require("../db/models/category");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const branchModel = require("../db/models/branch");
const responseBuilder = require("../builder/responseBuilder");

const index = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  console.log("===========req.query.page", req.query.page);
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  var query = {};
  if (req.query.name) {
    query.name = new RegExp(`^${req.query.name}$`, "i");
  }
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.parent_id) {
    query.parent_id = new RegExp(`^${req.query.parent_id}$`, "i");
  }
  let totalData = await categoryModel.countDocuments(query);
  console.log("totalData=================================", totalData);
  const data = await categoryModel.find(query).skip(startIndex).limit(limit);
  console.log("data", data);
  responseBuilder(res, 200, 'Success', data, {
    totalData: totalData,
    pageNo: page,
    limit: limit
  })
});
const show = catchAsyncError(async (req, res, next) => {
  let data = await categoryModel.findById(req.params.id);
  if (!data) {
    return res.send({ message: "No data found", status: 404 });
  }
  res.send({ message: "success", status: 200, data: data });
});

const store = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let newData = {
    ...req.body,
    created_by: decodedData?.user?.email,
  };

  const data = await categoryModel.create(newData);
  res.send({ message: "success", status: 201, data: data });
});

const update = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  const { name } = req.body;

  let data = await categoryModel.findById(req.params.id);

  if (!data) {
    console.log("if");
    return next(new ErrorHandler("No data found", 404));
  }
  let decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const newData = {
    ...req.body,
    updated_by: decodedData?.user?.email,
    updated_at: new Date(),
  };

  data = await categoryModel.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModified: true,
  });

  res.status(200).json({
    success: true,
    message: "Update successfully",
    data: data
  });
});

const remove = catchAsyncError(async (req, res, next) => {
  console.log("deleteData function is working");
  let data = await categoryModel.findById(req.params.id);
  console.log("data", data);
  if (!data) {
    console.log("if");
    return next(new ErrorHandler("No data found", 404));
  }

  await data.remove();
  res.status(200).json({
    success: true,
    message: "Delete successfully",
    data: data,
  });
});


const dropdownChild = catchAsyncError(async (req, res, next) => {
  // Fetch locations where parent_id is not equal to provided id
  const data = await categoryModel
      .find({parent_id: {$ne: req.params.parent_id}}, "name _id")
      .lean();

  // Logging data if needed
  console.log("category list:", data);

  // Return response
  res.status(200).json({
    success: true,
    message: "Data fetched successfully",
    data,
  });
});

const dropdown = catchAsyncError(async (req, res, next) => {
  try {
    console.log(req)
    // Fetch only the required fields
    const data = await categoryModel.find({ parent_id: null}, "name _id").lean();
    console.log(data)

    // Log the fetched data
    console.log("Fetched category list:", data);

    // Check if data exists
    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: "No data found",
        data: [],
      });
    }

    // Return successful response
    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = {
  index,
  show,
  store,
  update,
  remove,
  dropdown,
  dropdownChild
};
