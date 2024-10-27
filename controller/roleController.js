const ErrorHander = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const roleModel = require("../db/models/roleModel");
const jwt = require("jsonwebtoken");
const responseBuilder = require("../builder/responseBuilder");

const index = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  console.log("===========req.query.page", req.query.page);
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  var query = {};

  if (req.query.roleName) {
    query.role_name = new RegExp(`^${req.query.roleName}$`, "i");
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  let totalData = await roleModel.countDocuments(query);
  console.log("totalData=================================", totalData);
  const data = await roleModel
    .find(query)
    .sort({ created_at: -1 })
    .skip(startIndex)
    .limit(limit);
  console.log("data", data);
  responseBuilder(res, 200, 'Success', data, {
    totalData: totalData,
    pageNo: page,
    limit: limit
  })
});

const show = catchAsyncError(async (req, res, next) => {
  let data = await roleModel.findById(req.params.id);
  if (!data) {
    return next(new ErrorHander("No data found", 404));
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});

const store = catchAsyncError(async (req, res, next) => {
  console.log("createData");
  const { token } = req.cookies;
  let newIdserial;
  let newIdNo;
  let newId;
  const lastDoc = await roleModel.find().sort({ _id: -1 });
  console.log("lastDoc 0000000000000000000", lastDoc);
  if (lastDoc.length > 0) {
    newIdserial = lastDoc[0].role_id.slice(0, 1);
    newIdNo = parseInt(lastDoc[0].role_id.slice(1)) + 1;
    newId = newIdserial.concat(newIdNo);
    console.log("newIdserial", newIdserial);
    console.log("newIdNo", newIdNo);
  } else {
    newId = "R100";
  }
  console.log("newId========================", newId);
  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let newData = {
    role_id: newId,
    created_by: decodedData?.user?.email,
    ...req.body,
  };

  console.log("newData------------------------------------------", newData);

  const data = await roleModel.create(newData);
  res.status(201).json({ message: "success", data: data });
});
// this function is for managing cancel or update any product quantity

const update = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  let data = await roleModel.findById(req.params.id);

  if (!data) {
    console.log("if");
    return next(new ErrorHander("No data found", 404));
  }

  let decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const newData = {
    ...req.body,
    updated_by: decodedData?.user?.email,
    updated_at: new Date(),
  };

  data = await roleModel.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModified: false,
  });

  res.status(200).json({
    success: true,
    message: "Update successfully",
    data: data,
  });
});

const remove = catchAsyncError(async (req, res, next) => {
  console.log("deleteData function is working");
  let data = await roleModel.findById(req.params.id);
  console.log("data", data);
  if (!data) {
    console.log("if");
    return next(new ErrorHander("No data found", 404));
  }

  await data.remove();
  res.status(200).json({
    success: true,
    message: "Delete successfully",
    data: data,
  });
});

module.exports = {
  index,
  show,
  store,
  update,
  remove
};
