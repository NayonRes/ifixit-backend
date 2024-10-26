const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/permissionController");
const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

const router = express.Router();

router.route("/permission")
    .get(isAuthenticatedUser, hasPermission('permission-list'), index)
    .post(isAuthenticatedUser, hasPermission('permission-create'), store);

router.route("/permission/:id")
    .get(isAuthenticatedUser, hasPermission('permission-show'), show)
    .put(isAuthenticatedUser, hasPermission('permission-update'), update)
    .delete(isAuthenticatedUser, hasPermission('permission-action'), remove);

module.exports = router;
