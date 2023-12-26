const express = require("express");
const runValidation = require("../validators/index");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const {
  handleCreategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory,
} = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  validateCategory,
  runValidation,
  handleCreategory
); //create categories

categoryRouter.get("/", handleGetCategories); //get all categories

categoryRouter.put(
  "/:slug",
  isLoggedIn,
  isAdmin,
  validateCategory,
  runValidation,
  handleUpdateCategory
); //update category

categoryRouter.get(
  "/:slug",
  validateCategory,
  runValidation,
  handleGetCategory
); //get category

categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategory); //delete category

module.exports = categoryRouter;
