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

router.route("/spare-parts")
    .get(isAuthenticatedUser, index)
    .post(isAuthenticatedUser, store);

router.route("/spare-parts/:id")
    .get(isAuthenticatedUser, show)
    .put(isAuthenticatedUser, update)
    .delete(isAuthenticatedUser, remove);

module.exports = router;
