const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/customerController");
const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

let router = express.Router();

router.route("/customer")
    .get(isAuthenticatedUser, hasPermission('customer-list'), index)
    .post(isAuthenticatedUser, hasPermission('customer-create'), store);

router.route("/customer/:id")
    .get(isAuthenticatedUser, hasPermission('customer-show'), show)
    .put(isAuthenticatedUser, hasPermission('customer-update'), update)
    .delete(isAuthenticatedUser, hasPermission('customer-action'), remove);

module.exports = router;
