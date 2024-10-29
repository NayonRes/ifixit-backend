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
const {isAuthenticatedUser, hasPermission} = require("../../../middleware/auth");
const categoryModel = require("../../../db/models/category");

const router = express.Router();

router.route("/category")
    .get(isAuthenticatedUser, hasPermission('category-list'), index)
    .post(isAuthenticatedUser, hasPermission('category-create'), store);

router.route("/category/dropdown")
    .get(isAuthenticatedUser, dropdown);

router.route("/category/child")
    .get(isAuthenticatedUser, dropdownChild);

router.route("/category/:id")
    .get(isAuthenticatedUser, hasPermission('category-show'), show)
    .put(isAuthenticatedUser, hasPermission('category-update'), update)
    .delete(isAuthenticatedUser, hasPermission('category-action'), remove);

module.exports = router;
