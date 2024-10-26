const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/productController");

const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

const router = express.Router();

router.route("/product")
    .get(isAuthenticatedUser, hasPermission('product-list'), index)
    .post(isAuthenticatedUser, hasPermission('product-create'), store);

router.route("/product/:id")
    .get(isAuthenticatedUser, hasPermission('product-show'), show)
    .put(isAuthenticatedUser, hasPermission('product-update'), update)
    .delete(isAuthenticatedUser, hasPermission('product-action'), remove);

module.exports = router;
