const permissionModel = require("../db/models/permissionModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const responseBuilder = require("../builder/responseBuilder");
const filterHelper = require("../helpers/filterHelper");

const index = catchAsyncError(async (req, res, next) => {
  const data = await permissionModel.aggregate([
    {
      $group: {
        _id: "$module_name", // Group by `module_name`
        permissions: {
          $push: {
            _id: "$_id",
            name: "$name",
            description: "$description"
          }
        } // Only include selected fields for each permission
      },
    },
    {
      $project: {
        _id: 0, // Exclude `_id` from the output if not needed
        module_name: "$_id",
        permissions: 1,
      },
    },
  ]);
  responseBuilder(res, 200, 'Success', data)
})
//
// const index = catchAsyncError(async (req, res, next) => {
//   const page = parseInt(req.query.page) || 1;
//   console.log("===Filter========req.query.page", req.query.page);
//   const limit = parseInt(req.query.limit) || 10;
//   const startIndex = (page - 1) * limit;
//   const endIndex = page * limit;
//
//   let query = filterHelper(req)
//   let totalData = await permissionModel.countDocuments(query);
//   console.log("totalData=================================", totalData);
//
//   // this query for name with parent list
//   const pipeline = [
//     {
//       $match: query,
//     },
//     {
//       $graphLookup: {
//         from: "permissions",
//         startWith: "$name",
//         connectFromField: "module_name",
//         connectToField: "module_name",
//         maxDepth: 1,
//         as: "children",
//       },
//     },
//     {
//       $sort: { module_name: 1 },
//     },
//   ];
//
//   const data = await permissionModel
//     .aggregate(pipeline)
//     .skip(startIndex)
//     .limit(limit)
//     .exec();
//   console.log("data", data);
//
//   responseBuilder(res, 200, 'Success', data, {
//     totalData: totalData,
//     pageNo: page,
//     limit: limit
//   })
// });

const show = catchAsyncError(async (req, res, next) => {
  let data = await permissionModel.findById(req.params.id);
  if (!data) {
    return res.send({ message: "No data found", status: 404 });
  }
  res.send({ message: "success", status: 200, data: data });
});

const store = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  let newIdserial;
  let newIdNo;
  let newId;
  const lastDoc = await permissionModel.find().sort({ _id: -1 });
  if (lastDoc.length > 0) {
    newIdserial = lastDoc[0].permission_id.slice(0, 3);
    newIdNo = parseInt(lastDoc[0].permission_id.slice(3)) + 1;
    newId = newIdserial.concat(newIdNo);
  } else {
    newId = "f100";
  }
  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let newData = {
    ...req.body,
    permission_id: newId,
    created_by: decodedData?.user?.email,
  };

  const data = await permissionModel.create(newData);
  res.send({ message: "success", status: 201, data: data });
});

const update = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  let data = await permissionModel.findById(req.params.id);
  if (!data) {
    console.log("if");
    return next(new ErrorHandler("No data found", 404));
  }
  let decodedData = jwt.verify(token, process.env.JWT_SECRET);

  let newData = {
    ...req.body,
    updated_by: decodedData?.user?.email,
    updated_at: new Date(),
  };
  data = await permissionModel.findByIdAndUpdate(req.params.id, newData, {
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
  let data = await permissionModel.findById(req.params.id);
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
module.exports = {
  index,
  show,
  store,
  update,
  remove,
};
