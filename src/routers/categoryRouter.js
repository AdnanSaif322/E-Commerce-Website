const express = require("express");
const runValidation = require("../validators/index");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const {
  handleCreategory,
  handleGetCategories,
  handleGetCategory,
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
categoryRouter.get(
  "/:slug",
  validateCategory,
  runValidation,
  handleGetCategory
); //get category

module.exports = categoryRouter;
