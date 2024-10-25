const express = require("express");
const {
    index,
    show,
    store,
    update,
    remove,
    dropdown,
    dropdownChild
} = require("../../../controller/categoryController");
const {isAuthenticatedUser, authorizeRoles} = require("../../../middleware/auth");
const categoryModel = require("../../../db/models/categoryModel");

const router = express.Router();

router.route("/category")
    .get(isAuthenticatedUser, authorizeRoles('category-list'), index)
    .post(isAuthenticatedUser, authorizeRoles('category-create'), store);

router.route("/category/dropdown")
    .get(isAuthenticatedUser, dropdown);

router.route("/category/child")
    .get(isAuthenticatedUser, dropdownChild);

router.route("/category/:id")
    .get(isAuthenticatedUser, authorizeRoles('category-show'), show)
    .put(isAuthenticatedUser, authorizeRoles('category-update'), update)
    .delete(isAuthenticatedUser, authorizeRoles('category-action'), remove);

module.exports = router;
