const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../controller/locationController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

let router = express.Router();
router.route("/location")
    .get(index)
    .post(store);

router.route("/location/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
