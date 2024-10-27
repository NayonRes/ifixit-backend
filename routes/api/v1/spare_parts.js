const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/sparePartsController");

const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

const router = express.Router();

router.route("/spare-parts")
    .get(isAuthenticatedUser, hasPermission('spare-parts-list'), index)
    .post(isAuthenticatedUser, hasPermission('spare-parts-create'), store);

router.route("/spare-parts/:id")
    .get(isAuthenticatedUser, hasPermission('spare-parts-show'), show)
    .put(isAuthenticatedUser, hasPermission('spare-parts-update'), update)
    .delete(isAuthenticatedUser, hasPermission('spare-parts-action'), remove);

module.exports = router;
