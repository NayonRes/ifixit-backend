const express = require("express");
const {
    token,
    register,
    logout,
    profile,
    updateProfile,
    updatePassword
} = require("../../../controller/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../../../middleware/auth");

let router = express.Router();

router.route("/auth/token").post(token);
router.route("/auth/register").post(register);
router.route("/auth/logout").post(isAuthenticatedUser, logout);
router.route("/auth/profile").get(isAuthenticatedUser, profile);
router.route("/auth/profile").post(isAuthenticatedUser, updateProfile);
router.route("/auth/update-password").post(isAuthenticatedUser, updatePassword);

module.exports = router;