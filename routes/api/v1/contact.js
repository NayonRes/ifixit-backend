const express = require("express");
const {
    index,
    show,
    store,
    update,
    remove,
    find
} = require("../../../controller/contactController");
const {isAuthenticatedUser, hasPermission} = require("../../../middleware/auth");

let router = express.Router();

router.route("/contact")
    .get(isAuthenticatedUser, hasPermission('contact-list'), index)
    .post(isAuthenticatedUser, hasPermission('contact-create'), store);

router.route("/contact/:id")
    .get(isAuthenticatedUser, hasPermission('contact-show'), show)
    .put(isAuthenticatedUser, hasPermission('contact-update'), update)
    .delete(isAuthenticatedUser, hasPermission('contact-action'), remove);

router.route("/contact/:mobile/find")
    .get(isAuthenticatedUser, hasPermission('contact-show'), find)

module.exports = router;
