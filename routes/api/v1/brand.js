const express = require("express");
const {
    index,
    show,
    store,
    update,
    remove,
    dropdown
} = require("../../../controller/brandController");
const {isAuthenticatedUser, hasPermission} = require("../../../middleware/auth");

let router = express.Router();

router.route("/brand")
    .get(isAuthenticatedUser, hasPermission('brand-list'), index)
    .post(isAuthenticatedUser, hasPermission('brand-create'), store);

router.route("/brand/dropdown")
    .get(isAuthenticatedUser, dropdown);

router.route("/brand/:id")
    .get(isAuthenticatedUser, hasPermission('brand-show'), show)
    .put(isAuthenticatedUser, hasPermission('brand-update'), update)
    .delete(isAuthenticatedUser, hasPermission('brand-action'), remove);

module.exports = router;
