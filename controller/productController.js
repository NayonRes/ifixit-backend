const productModel = require("../db/models/product");
const sizeOf = require("image-size");
const ErrorHandler = require("../utils/errorHandler");
const imageUpload = require("../utils/imageUpload");
const imageDelete = require("../utils/imageDelete");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const filterHelper = require("../helpers/filterHelper");
const responseBuilder = require("../builder/responseBuilder");
const {counters} = require("sharp");

const index = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  console.log("===========req.query.page", req.query.page);
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  let query = filterHelper(req)
  let totalData = await productModel.countDocuments(query);
  console.log("totalData=================================", totalData);

  // -------------------------start-------------------------------------------
  const data = await productModel.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "category_id",
        as: "category_data",
      },
    },
    {
      $lookup: {
        from: "filters",
        localField: "filter_id",
        foreignField: "filter_id",
        as: "filter_data",
      },
    },

    {
      $project: {
        _id: 1,
        product_id: 1,
        name: 1,
        description: 1,
        price: 1,
        discount_price: 1,
        rating: 1,
        viewed: 1,
        stock_unit: 1,
        sku: 1,
        images: 1,
        filter_id: 1,
        store_id: 1,
        category_id: 1,
        location_id: 1,
        status: 1,
        created_by: 1,
        created_at: 1,
        updated_by: 1,
        updated_at: 1,
        "category_data._id": 1,
        "category_data.name": 1,
        "category_data.category_id": 1,
        "filter_data._id": 1,
        "filter_data.parent_name": 1,
        "filter_data.name": 1,
        "filter_data.filter_id": 1,
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
  let data = await productModel.findById(req.params.id);
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
  // console.log("req.body", req.body.variants[0].attributes);
  const { token } = req.cookies;
  let imageData = [];
  // if (req.files) {
  //   imageData = await imageUpload(req.files.images, "products", next);
  // }
  // console.log("imageData", imageData);

  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let newData = {
    ...req.body,
    // images: imageData,
    created_by: decodedData?.user?.email,
  };
  console.log("newData", newData);
  const product = await productModel.create(newData);
  if (product && newData.variants && newData.variants.length > 0) {
    console.log(newData.variants)
    await Promise.all(
        newData.variants.map((variant) => product.attachVariant(variant))
    );
  }
  res.send({ message: "success", status: 201, data: product });
});

const update = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    let data = await productModel.findById(req.params.id);

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
    let updateData = await productModel.findByIdAndUpdate(
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
  let data = await productModel.findById(req.params.id);
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
