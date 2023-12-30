const express = require("express");
const runValidation = require("../validators/index");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { validateProduct } = require("../validators/product");
const { handleProduct } = require("../controllers/productController");
const { uploadProductImage } = require("../middlewares/uploadFile");

const productRouter = express.Router();

productRouter.post(
  "/",
  uploadProductImage.single("image"),
  isLoggedIn,
  isAdmin,
  validateProduct,
  runValidation,
  handleProduct
); //create product

// productRouter.get("/", handleGetCategories); //get all categories

// productRouter.put(
//   "/:slug",
//   isLoggedIn,
//   isAdmin,
//   validateCategory,
//   runValidation,
//   handleUpdateCategory
// ); //update category

// productRouter.get("/:slug", validateCategory, runValidation, handleGetCategory); //get category

// productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategory); //delete category

module.exports = productRouter;
