const express = require("express");
const {
    index,
    show,
    store,
    update,
    remove
} = require("../../../controller/supplierController");

const { isAuthenticatedUser, hasPermission } = require("../../../middleware/auth");

const router = express.Router();

router.route("/supplier")
    .get(isAuthenticatedUser, hasPermission('supplier-list'), index)
    .post(isAuthenticatedUser, hasPermission('supplier-create'), store);

router.route("/supplier/:id")
    .get(isAuthenticatedUser, hasPermission('supplier-show'), show)
    .put(isAuthenticatedUser, hasPermission('supplier-update'), update)
    .delete(isAuthenticatedUser, hasPermission('supplier-action'), remove);

module.exports = router;
