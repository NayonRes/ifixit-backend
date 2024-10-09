var express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../controller/customerController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

var router = express.Router();

router.route("/customer")
    .get(index)
    .post(store);

router.route("/customer/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
