const express = require("express");
const {
  index,
  show,
  update
} = require("../../../controller/stockController");
const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

let router = express.Router();

router.route("/stock")
    .get(isAuthenticatedUser, hasPermission('stock-list'), index)

router.route("/stock/:id")
    .get(isAuthenticatedUser, hasPermission('stock-show'), show)
    .put(isAuthenticatedUser, hasPermission('stock-update'), update)

module.exports = router;
