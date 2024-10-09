const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../controller/permissionController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/permission")
    .get(index)
    .post(store);

router.route("/permission/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
