const { body } = require("express-validator");

// product validation
const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required!")
    .isLength({ min: 3 })
    .withMessage("Category Name should be 3 characters long."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required!")
    .isLength({ min: 3 })
    .withMessage("Product description should be 3 characters long."),
  body("price")
    .notEmpty()
    .withMessage("Product price is required!")
    .isNumeric()
    .withMessage("Product price should be numeric."),
  body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required!")
    .isNumeric()
    .withMessage("Product quantity should be numeric."),
  body("category").notEmpty().withMessage("Product category is required!"),
];

module.exports = { validateProduct };
