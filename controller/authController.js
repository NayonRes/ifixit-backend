const userModel = require("../db/models/userModel");
const roleModel = require("../db/models/roleModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const imageUpload = require("../utils/imageUpload");
const imageDelete = require("../utils/imageDelete");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");
const { main } = require("../utils/TestNodemailerMail");

const show = catchAsyncError(async (req, res, next) => {
    console.log("getById");
    let data = await userModel.findById(req.params.id);
    if (!data) {
        return next(new ErrorHandler("No data found", 404));
    }
    res.status(200).json({
        success: true,
        message: "success",
        data: data,
    });
});
const register = catchAsyncError(async (req, res, next) => {
    // console.log("req.files", req.files);
    // console.log("req.body", req.body);
    const { token } = req.cookies;
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
        return next(new ErrorHandler("Email already exists", 401));
    }

    let imageData = [];
    if (req.files) {
        imageData = await imageUpload(req.files.image, "users", next);
    }
    console.log("imageData", imageData);
    let newIdserial;
    let newIdNo;
    let newId;
    const lastDoc = await userModel.find().sort({ _id: -1 });

    console.log("lastDoc", lastDoc);

    if (lastDoc.length > 0) {
        newIdserial = lastDoc[0].user_id.slice(0, 1);
        newIdNo = parseInt(lastDoc[0].user_id.slice(1)) + 1;
        newId = newIdserial.concat(newIdNo);
    } else {
        newId = "u100";
    }
    let decodedData = jwt.verify(token, process.env.JWT_SECRET);
    let newData = {
        ...req.body,
        image: imageData[0],
        user_id: newId,
        created_by: decodedData?.user?.email,
    };
    console.log("newData --------------------------1212", newData);
    const data = await userModel.create(newData);
    res.send({ message: "success", status: 201, data: data });
});

const token = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    console.log("isPasswordMatched", isPasswordMatched);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    let roleAndPermission = {};
    if (user.role_id) {
        roleAndPermission = await roleModel.findOne({ role_id: user.role_id });
    }

    // console.log("roleAndPermission=========================", roleAndPermission);
    sendToken(user, roleAndPermission, 200, res);
});

const logout = catchAsyncError(async (req, res, next) => {
    console.log("req========================");
    console.log("cookies-------------------------", req.cookies);
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

const updatePassword = catchAsyncError(async (req, res, next) => {
    console.log("updatePassword");
    const user = await userModel.findById(req.body.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// update User Profile
const updateProfile = catchAsyncError(async (req, res, next) => {
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
        message: "successfull",
        user,
    });
});

module.exports = {
    token,
    logout,
    register,
    updatePassword,
    updateProfile,
};