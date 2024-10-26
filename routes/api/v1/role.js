const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/roleController");

const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

const router = express.Router();

router.route("/role")
    .get(isAuthenticatedUser, hasPermission('role-list'), index)
    .post(isAuthenticatedUser, hasPermission('role-create'), store);

router.route("/role/:id")
    .get(isAuthenticatedUser, hasPermission('role-show'), show)
    .put(isAuthenticatedUser, hasPermission('role-update'), update)
    .delete(isAuthenticatedUser, hasPermission('role-action'), remove);

module.exports = router;
