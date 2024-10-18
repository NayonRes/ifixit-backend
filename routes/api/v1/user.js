const express = require("express");
const {
  index,
  show,
  store,
  update,
  remove
} = require("../../../controller/userController");

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../../../middleware/auth");
const storeUserRule = require('../../../rules/storeUserRule')
const updateUserRule = require("../../../rules/updateUserRule");

router.route("/user")
    .get(isAuthenticatedUser, index)
    .post(
        storeUserRule,
        store
    );

router.route("/user/:id")
    .get(show)
    .put(updateUserRule, update)
    .delete(remove);

module.exports = router;
