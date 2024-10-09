const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../controller/roleController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/role")
    .get(index)
    .post(store);

router.route("/role/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
