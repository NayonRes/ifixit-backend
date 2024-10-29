const sparePartsModel = require("../db/models/spareParts");
const sizeOf = require("image-size");
const ErrorHandler = require("../utils/errorHandler");
const imageUpload = require("../utils/imageUpload");
const imageDelete = require("../utils/imageDelete");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const filterHelper = require("../helpers/filterHelper");
const responseBuilder = require("../builder/responseBuilder");

const index = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  console.log("===========req.query.page", req.query.page);
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  let query = filterHelper(req)
  let totalData = await sparePartsModel.countDocuments(query);
  console.log("totalData=================================", totalData);

  // -------------------------start-------------------------------------------
  const data = await sparePartsModel.aggregate([
    {
      $match: query,
    },
    {
      $addFields: {
        category_id: { $toObjectId: "$category_id" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        images: 1,
        category_id: 1,
        status: 1,
        created_by: 1,
        created_at: 1,
        updated_by: 1,
        updated_at: 1,
        "category._id": 1,
        "category.name": 1,
        "category.category_id": 1
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
  let data = await sparePartsModel.findById(req.params.id);
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
  let imageData = [];
  if (req.files) {
    imageData = await imageUpload(req.files.images, "products", next);
  }
  console.log("imageData", imageData);

  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let newData = {
    ...req.body,
    images: imageData,
    created_by: decodedData?.user?.email,
  };
  console.log("newData", newData);
  const data = await sparePartsModel.create(newData);
  res.send({ message: "success", status: 201, data: data });
});

const update = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    let data = await sparePartsModel.findById(req.params.id);

    if (!data) {
      console.log("if");
      return next(new ErrorHandler("No data found", 404));
    }

    // deleting previous images
    if (req.files && data.images.length > 0) {
      for (let index = 0; index < data.images.length; index++) {
        const element = data.images[index];
        await imageDelete(element.public_id, next);
      }
    }
    //uploading new images
    let imageData = [];
    let newData = req.body;
    if (req.files) {
      imageData = await imageUpload(req.files.images, "products", next);
    }
    console.log("imageData", imageData);
    if (imageData.length > 0) {
      newData = { ...req.body, images: imageData };
    }
    let decodedData = jwt.verify(token, process.env.JWT_SECRET);

    newData = {
      ...newData,
      updated_by: decodedData?.user?.email,
      updated_at: new Date(),
    };
    console.log("newData", newData);
    let updateData = await sparePartsModel.findByIdAndUpdate(
      req.params.id,
      newData,
      {
        new: true,
        runValidators: true,
        useFindAndModified: false,
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

const patchData = async (req, res, next) => {
  console.log("patchData function is working");
};

const remove = catchAsyncError(async (req, res, next) => {
  console.log("deleteData function is working");
  let data = await sparePartsModel.findById(req.params.id);
  console.log("data", data.images);
  if (!data) {
    console.log("if");
    return next(new ErrorHandler("No data found", 404));
  }

  if (data.images.length > 0) {
    for (let index = 0; index < data.images.length; index++) {
      const element = data.images[index];
      await imageDelete(element.public_id, next);
    }
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
