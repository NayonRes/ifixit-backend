const express = require("express");
const {
    index,
    show,
    store,
    update,
    remove,
    dropdown
} = require("../../../controller/deviceModelController");
const {isAuthenticatedUser, hasPermission} = require("../../../middleware/auth");

let router = express.Router();

router.route("/device")
    .get(isAuthenticatedUser, hasPermission('device-list'), index)
    .post(isAuthenticatedUser, hasPermission('device-create'), store);

router.route("/device/dropdown")
    .get(isAuthenticatedUser, dropdown);

router.route("/device/:id")
    .get(isAuthenticatedUser, hasPermission('device-show'), show)
    .put(isAuthenticatedUser, hasPermission('device-update'), update)
    .delete(isAuthenticatedUser, hasPermission('device-action'), remove);

module.exports = router;
