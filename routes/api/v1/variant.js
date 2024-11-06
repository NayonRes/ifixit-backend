const express = require("express");
const {
  store,
  update,
  dropdown,
  remove
} = require("../../../controller/variantTypeController");
const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

let router = express.Router();

router.route("/variant")
    .get(isAuthenticatedUser, dropdown)
    .post(isAuthenticatedUser, hasPermission('variant-create'), store);

router.route("/variant/:id")
    .put(isAuthenticatedUser, hasPermission('variant-update'), update)
    .delete(isAuthenticatedUser, hasPermission('variant-action'), remove);

module.exports = router;
