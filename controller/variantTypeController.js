const variantTypeModel = require("../db/models/variantType");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");

const store = catchAsyncError(async (req, res, next) => {
    let newData = {
        ...req.body,
        // created_by: decodedData?.user?.email,
    };

    const data = await variantTypeModel.create(newData);
    res.send({message: "success", status: 201, data: data});
});

const update = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    const {name} = req.body;

    let data = await variantTypeModel.findById(req.params.id);

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

    data = await variantTypeModel.findByIdAndUpdate(req.params.id, newData, {
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

const remove = catchAsyncError(async (req, res, next) => {
    console.log("deleteData function is working");
    let data = await variantTypeModel.findById(req.params.id);
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
        const data = await variantTypeModel.find({ parent_id: null}, "name _id").lean();
        console.log(data)

        // Return successful response
        res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            data
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
    store,
    update,
    remove,
    dropdown
};
