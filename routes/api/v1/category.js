const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/categoryController");
const { isAuthenticatedUser, authorizeRoles } = require("../../../middleware/auth");
const categoryModel = require("../../../db/models/categoryModel");

const router = express.Router();

router.route("/category")
    .get(index)
    .post(store);

router.route("/category/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
