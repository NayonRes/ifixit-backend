var express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/serviceController");
const { isAuthenticatedUser, authorizeRoles } = require("../../../middleware/auth");

var router = express.Router();

router.route("/service")
    .get(index)
    .post(store);

router.route("/service/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
