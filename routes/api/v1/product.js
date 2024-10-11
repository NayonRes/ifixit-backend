const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../../../middleware/auth");

const router = express.Router();

router.route("/product")
    .get(index)
    .post(store);

router.route("/product/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
