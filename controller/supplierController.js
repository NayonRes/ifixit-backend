const supplierModel = require("../db/models/supplier");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const filterHelper = require("../helpers/filterHelper");
const responseBuilder = require("../builder/responseBuilder");

const index = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  console.log("===========req.query.page", req.query.page);
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let query = filterHelper(req)
  let totalData = await supplierModel.countDocuments(query);
  console.log("totalData=================================", totalData);

  // -------------------------start-------------------------------------------
  const data = await supplierModel.aggregate([
    {
      $match: query,
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        mobile: 1,
        address: 1,
        organization_name: 1,
        organization_address: 1,
        description: 1,
        remarks: 1,
        status: 1,
        created_by: 1,
        created_at: 1,
        updated_by: 1,
        updated_at: 1
      },
    },
    {
      $sort: { created_at: -1 },
    },

    {
      $skip: startIndex,
    },
    {
      $limit: limit,
    },
  ]);
  // -------------------------end-------------------------------------------
  // const data = await productModel.find(query).skip(startIndex).limit(limit);
  console.log("data", data);
  responseBuilder(res, 200, 'Success', data, {
    totalData: totalData,
    pageNo: page,
    limit: limit
  })
});

const show = catchAsyncError(async (req, res, next) => {
  let data = await supplierModel.findById(req.params.id);
  if (!data) {
    return next(new ErrorHandler("No data found", 404));
  }
  res.status(200).json({
    success: true,
    message: "success",
    data: data,
  });
});
const store = catchAsyncError(async (req, res, next) => {
  console.log("req.files", req.files);
  console.log("req.body", req.body);
  const { token } = req.cookies;

  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let newData = {
    ...req.body,
    created_by: decodedData?.user?.email,
  };
  console.log("newData", newData);
  const data = await supplierModel.create(newData);
  res.send({ message: "success", status: 201, data: data });
});

const update = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    let data = await supplierModel.findById(req.params.id);

    if (!data) {
      console.log("if");
      return next(new ErrorHandler("No data found", 404));
    }

    let newData = req.body;

    let decodedData = jwt.verify(token, process.env.JWT_SECRET);

    newData = {
      ...newData,
      updated_by: decodedData?.user?.email,
      updated_at: new Date(),
    };
    console.log("newData", newData);
    let updateData = await supplierModel.findByIdAndUpdate(
      req.params.id,
      newData,
      {
        new: false,
        runValidators: true,
        useFindAndModified: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Update successfully",
      data: updateData,
    });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error", status: 400, error: error });
  }
};

const remove = catchAsyncError(async (req, res, next) => {
  console.log("deleteData function is working");
  let data = await supplierModel.findById(req.params.id);
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
module.exports = {
  index,
  show,
  store,
  update,
  remove
};
