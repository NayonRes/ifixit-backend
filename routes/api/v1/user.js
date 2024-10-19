const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove,
  assignPermission
} = require("../../../controller/userController");

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../../../middleware/auth");
const storeUserRule = require('../../../rules/storeUserRule')
const updateUserRule = require("../../../rules/updateUserRule");

router.route("/user")
    .get(isAuthenticatedUser, index)
    .post(
        isAuthenticatedUser,
        storeUserRule,
        store
    );

router.route("/user/:id")
    .get(isAuthenticatedUser, show)
    .put(isAuthenticatedUser, updateUserRule, update)
    .delete(isAuthenticatedUser, remove);

router.route("/user/:id/assign")
    .post(isAuthenticatedUser, assignPermission)

module.exports = router;
