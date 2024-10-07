var express = require("express");
const {
  getParentDropdown,
  getDataWithPagination,
  getById,
  createData,
  updateData,
  deleteData,
} = require("../controller/serviceCustomerController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const serviceCustomerModel = require("../db/models/serviceCustomerModel");

var router = express.Router();

//Must be maintain the serial of declaring router.route accordimg to less middleware use
router.route("/dropdownlist").get(isAuthenticatedUser, getParentDropdown);

router
  .route("/")
  .get(isAuthenticatedUser, authorizeRoles("per103"), getDataWithPagination);
router
  .route("/:id")
  .get(isAuthenticatedUser, authorizeRoles("per103"), getById);
router
  .route("/create")
  .post(isAuthenticatedUser, authorizeRoles("per104"), createData);
router
  .route("/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("per105"), updateData);
router
  .route("/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("per106"), deleteData);

module.exports = router;
