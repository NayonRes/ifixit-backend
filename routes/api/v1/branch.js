const express = require("express");
const {
    index,
    show,
    store,
    update,
    remove,
    dropdown
} = require("../../../controller/branchController");
const {isAuthenticatedUser, hasPermission} = require("../../../middleware/auth");

let router = express.Router();

router.route("/branch")
    .get(isAuthenticatedUser, hasPermission('branch-list'), index)
    .post(isAuthenticatedUser, hasPermission('branch-create'), store);

router.route("/branch/dropdown")
    .get(isAuthenticatedUser, dropdown);

router.route("/branch/:id")
    .get(isAuthenticatedUser, hasPermission('branch-show'), show)
    .put(isAuthenticatedUser, hasPermission('branch-update'), update)
    .delete(isAuthenticatedUser, hasPermission('branch-action'), remove);

module.exports = router;