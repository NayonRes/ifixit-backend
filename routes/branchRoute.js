var express = require("express");
const {
  getParentDropdown,
  getLeafCategoryList,
  getDataWithPagination,
  getById,
  createData,
  updateData,
  deleteData,
  getCategoryWiseFilterList,
} = require("../controller/branchController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const branchModel = require("../db/models/branchModel");

var router = express.Router();

//Must be maintain the serial of declaring router.route accordimg to less middleware use
router.route("/dropdownlist").get(isAuthenticatedUser, getParentDropdown);
router.route("/leaf-dropdown").get(isAuthenticatedUser, getLeafCategoryList);
router
  .route("/category-filter-list")
  .post(isAuthenticatedUser, getCategoryWiseFilterList);

router.route("/").get(isAuthenticatedUser, getDataWithPagination);
router.route("/:id").get(isAuthenticatedUser, getById);
router.route("/create").post(isAuthenticatedUser, createData);
router.route("/update/:id").put(isAuthenticatedUser, updateData);
router.route("/delete/:id").delete(isAuthenticatedUser, deleteData);

module.exports = router;
