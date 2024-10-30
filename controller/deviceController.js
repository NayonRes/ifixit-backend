const deviceModel = require("../db/models/branch");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const responseBuilder = require("../builder/responseBuilder");
const filterHelper = require("../helpers/filterHelper")

const index = catchAsyncError(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    console.log("===========req.query.page", req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const filter = filterHelper(req)
    let totalData = await deviceModel.countDocuments(filter);
    console.log("totalData=================================", totalData);
    const data = await deviceModel.find(filter).skip(startIndex).limit(limit);
    console.log("data", data);
    responseBuilder(res, 200, 'Success', data, {
        totalData: totalData,
        pageNo: page,
        limit: limit
    })
});

const show = catchAsyncError(async (req, res, next) => {
    let data = await deviceModel.findById(req.params.id);
    if (!data) {
        return res.send({message: "No data found", status: 404});
    }
    res.send({message: "success", status: 200, data: data});
});

const store = catchAsyncError(async (req, res, next) => {
    let newData = {
        ...req.body,
        // created_by: decodedData?.user?.email,
    };

    const data = await deviceModel.create(newData);
    res.send({message: "success", status: 201, data: data});
});

const update = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    const {name} = req.body;

    let data = await deviceModel.findById(req.params.id);
    let oldParentName = data.name;

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

    data = await deviceModel.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModified: false,
    });

    const childrenParentUpdate = await deviceModel.updateMany(
        {parent_name: oldParentName},
        {$set: {parent_name: name}}
    );
    res.status(200).json({
        success: true,
        message: "Update successfully",
        data: data,
        childrenParentUpdate,
    });
});

const remove = catchAsyncError(async (req, res, next) => {
    console.log("deleteData function is working");
    let data = await deviceModel.findById(req.params.id);
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

const dropdown = catchAsyncError(async (req, res, next) => {
    try {
        console.log(req)
        // Fetch only the required fields
        const data = await deviceModel.find({ parent_id: null}, "name _id").lean();
        console.log(data)

        // Log the fetched data
        console.log("Fetched branch list:", data);

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
    dropdown
};
