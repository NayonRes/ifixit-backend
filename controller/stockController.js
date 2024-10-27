const stockModel = require("../db/models/stockModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const filterHelper = require("../helpers/filterHelper");

const index = catchAsyncError(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    console.log("===========req.query.page", req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    let query = filterHelper(req)
    let totalData = await stockModel.countDocuments(query);
    console.log("totalData=================================", totalData);
    const data = await stockModel.find(query).skip(startIndex).limit(limit);
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
const show = catchAsyncError(async (req, res, next) => {
    let data = await stockModel.findById(req.params.id);
    if (!data) {
        return res.send({message: "No data found", status: 404});
    }
    res.send({message: "success", status: 200, data: data});
});

const update = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;

    let data = await stockModel.findById(req.params.id);
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

    data = await stockModel.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModified: false,
    });
    res.status(200).json({
        success: true,
        message: "Update successfully",
        data: data
    });
});

module.exports = {
    index,
    show,
    update
};
