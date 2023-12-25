const express = require("express");
const runValidation = require("../validators/index");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const { handleCreategory } = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");

const categoryRouter = express.Router();

// GET  /users
categoryRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  validateCategory,
  runValidation,
  handleCreategory
); //create categories

module.exports = categoryRouter;
