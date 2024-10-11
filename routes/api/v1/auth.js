const express = require("express");
const {
    token,
    register,
    logout
} = require("../../../controller/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../../../middleware/auth");

let router = express.Router();

router.route("/auth/token").post(token);
router.route("/auth/register").post(register);
router.route("/auth/logout").post(isAuthenticatedUser, logout);

module.exports = router;