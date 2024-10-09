const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../controller/branchController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

let router = express.Router();

router.route("/branch")
    .get(index)
    .post(store);
router.route("/branch/:id")
    .get(show)
    .put(update)
    .delete(remove);

module.exports = router;
