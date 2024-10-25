const express = require("express");
const {
    index,
    show,
    store,
    update,
    remove,
    dropdown,
    dropdownChild
} = require("../../../controller/branchController");
const {isAuthenticatedUser, authorizeRoles} = require("../../../middleware/auth");

let router = express.Router();

router.route("/branch")
    .get(isAuthenticatedUser, authorizeRoles('branch-list'), index)
    .post(isAuthenticatedUser, authorizeRoles('branch-create'), store);

router.route("/branch/dropdown")
    .get(isAuthenticatedUser, dropdown);

router.route("/branch/child")
    .get(isAuthenticatedUser, dropdownChild);

router.route("/branch/:id")
    .get(isAuthenticatedUser, authorizeRoles('branch-show'), show)
    .put(isAuthenticatedUser, authorizeRoles('branch-update'), update)
    .delete(isAuthenticatedUser, authorizeRoles('branch-action'), remove);

module.exports = router;
