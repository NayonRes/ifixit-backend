const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/serviceController");
const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

let router = express.Router();

router.route("/service")
    .get(isAuthenticatedUser, hasPermission('service-list'), index)
    .post(isAuthenticatedUser, hasPermission('service-create'), store);

router.route("/service/:id")
    .get(isAuthenticatedUser, hasPermission('service-show'), show)
    .put(isAuthenticatedUser, hasPermission('service-update'), update)
    .delete(isAuthenticatedUser, hasPermission('service-action'), remove);

module.exports = router;
