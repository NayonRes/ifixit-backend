const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../controller/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const orderModel = require("../db/models/orderModel");

const router = express.Router();

router.route("/order")
    .get(index)
    .post(store);

router.route("/order/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
