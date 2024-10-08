const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../controller/userController");

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/category")
    .get(index)
    .post(store);

router.route("/category/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
