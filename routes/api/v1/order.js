const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/orderController");
const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

const router = express.Router();

router.route("/order")
    .get(isAuthenticatedUser, hasPermission('order-list'), index)
    .post(isAuthenticatedUser, hasPermission('order-create'), store);

router.route("/order/:id")
    .get(isAuthenticatedUser, hasPermission('order-show'), show)
    .put(isAuthenticatedUser, hasPermission('order-update'), update)
    .delete(isAuthenticatedUser, hasPermission('order-action'), remove);

module.exports = router;
