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

router.route("/device/model")
    .get(isAuthenticatedUser, hasPermission('model-list'), index)
    .post(isAuthenticatedUser, hasPermission('model-create'), store);

router.route("/device/model/dropdown")
    .get(isAuthenticatedUser, dropdown);

router.route("/device/model/:id")
    .get(isAuthenticatedUser, hasPermission('model-show'), show)
    .put(isAuthenticatedUser, hasPermission('device-model-update'), update)
    .delete(isAuthenticatedUser, hasPermission('model-action'), remove);

module.exports = router;
