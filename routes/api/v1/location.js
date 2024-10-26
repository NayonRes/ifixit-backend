const express = require("express");
const {
    index,
    show,
    store,
    update,
    remove,
    dropdown,
    dropdownChild
} = require("../../../controller/locationController");

const {isAuthenticatedUser, hasPermission} = require("../../../middleware/auth");

let router = express.Router();
router.route("/location")
    .get(isAuthenticatedUser, hasPermission('location-list'), index)
    .post(isAuthenticatedUser, hasPermission('location-create'), store);

router.route("/location/dropdown")
    .get(dropdown);

router.route("/location/child")
    .get(dropdownChild);

router.route("/location/:id")
    .get(isAuthenticatedUser, hasPermission('location-show'), show)
    .put(isAuthenticatedUser, hasPermission('location-update'), update)
    .delete(isAuthenticatedUser, hasPermission('location-action'), remove);

module.exports = router;
