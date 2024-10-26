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
const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");
const storeUserRule = require('../../../rules/storeUserRule')
const updateUserRule = require("../../../rules/updateUserRule");

router.route("/user")
    .get(isAuthenticatedUser, hasPermission('user-list'), index)
    .post(
        isAuthenticatedUser,
        hasPermission('user-create'),
        storeUserRule,
        store
    );

router.route("/user/:id")
    .get(isAuthenticatedUser, hasPermission('user-show'), show)
    .put(isAuthenticatedUser, hasPermission('user-update'), updateUserRule, update)
    .delete(isAuthenticatedUser, hasPermission('user-action'), remove);

router.route("/user/:id/assign")
    .post(isAuthenticatedUser, hasPermission('user-list'), assignPermission)

module.exports = router;
