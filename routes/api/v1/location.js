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

const {isAuthenticatedUser, authorizeRoles} = require("../../../middleware/auth");

let router = express.Router();
router.route("/location")
    .get(isAuthenticatedUser, authorizeRoles('location-list'), index)
    .post(isAuthenticatedUser, authorizeRoles('location-create'), store);

router.route("/location/dropdown")
    .get(dropdown);

router.route("/location/child")
    .get(dropdownChild);

router.route("/location/:id")
    .get(isAuthenticatedUser, authorizeRoles('location-show'), show)
    .put(isAuthenticatedUser, authorizeRoles('location-update'), update)
    .delete(isAuthenticatedUser, authorizeRoles('location-action'), remove);

module.exports = router;
