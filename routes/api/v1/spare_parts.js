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

router.route("/spare-parts")
    .get(isAuthenticatedUser, hasPermission('parts-list'), index)
    .post(isAuthenticatedUser, hasPermission('parts-create'), store);

router.route("/spare-parts/:id")
    .get(isAuthenticatedUser, hasPermission('parts-show'), show)
    .put(isAuthenticatedUser, hasPermission('parts-update'), update)
    .delete(isAuthenticatedUser, hasPermission('parts-action'), remove);

module.exports = router;
