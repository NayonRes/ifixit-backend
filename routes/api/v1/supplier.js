const express = require("express");
const {
    index,
    show,
    store,
    update,
    remove
} = require("../../../controller/supplierController");

const { isAuthenticatedUser, authorizeRoles } = require("../../../middleware/auth");

const router = express.Router();

router.route("/supplier")
    .get(isAuthenticatedUser, index)
    .post(isAuthenticatedUser, store);

router.route("/supplier/:id")
    .get(isAuthenticatedUser, show)
    .put(isAuthenticatedUser, update)
    .delete(isAuthenticatedUser, remove);

module.exports = router;
