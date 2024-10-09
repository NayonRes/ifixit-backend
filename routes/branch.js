const express = require("express");
const {
  getDataWithPagination,
  getById,
  createData,
  updateData,
  deleteData,
} = require("../controller/branchController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

let router = express.Router();

router.route("/branch")
    .get(isAuthenticatedUser, getDataWithPagination)
    .post(isAuthenticatedUser, createData);
router.route("/branch/:id")
    .get(isAuthenticatedUser, getById)
    .put(isAuthenticatedUser, updateData)
    .delete(isAuthenticatedUser, deleteData);

module.exports = router;
